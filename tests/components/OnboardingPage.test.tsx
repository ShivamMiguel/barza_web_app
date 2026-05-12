import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Supabase browser client — used for avatar upload + auth check.
const mockGetUser = vi.fn()
const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: () => mockGetUser() },
    storage: {
      from: (bucket: string) => ({
        // capture which bucket the page asks for
        _bucket: bucket,
        upload: (...args: unknown[]) => mockUpload(bucket, ...args),
        getPublicUrl: (path: string) => mockGetPublicUrl(bucket, path),
      }),
    },
  }),
}))

const mockFetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = mockFetch
  if (typeof URL.createObjectURL === 'undefined') {
    // jsdom doesn't ship it
    Object.defineProperty(URL, 'createObjectURL', {
      value: () => 'blob:preview',
      configurable: true,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: () => {},
      configurable: true,
    })
  }
})

async function renderPage() {
  const mod = await import('@/app/onboarding/page')
  const Page = mod.default
  return render(<Page />)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Onboarding /onboarding — render', () => {
  it('renders the headline and tagline', async () => {
    await renderPage()
    expect(screen.getByText('Antes de começares…')).toBeInTheDocument()
    expect(screen.getByText(/Toda presença precisa de uma forma/)).toBeInTheDocument()
  })

  it('renders the phone digits field with the national placeholder', async () => {
    await renderPage()
    expect(screen.getByPlaceholderText('900 000 000')).toBeInTheDocument()
  })

  it('defaults the dial-code selector to Angola (+244)', async () => {
    await renderPage()
    expect(
      screen.getByRole('button', { name: /Indicativo Angola \+244/i })
    ).toBeInTheDocument()
  })

  it('opens the dial-code dropdown and changes the prefix', async () => {
    await renderPage()
    const trigger = screen.getByRole('button', { name: /Indicativo Angola \+244/i })
    fireEvent.click(trigger)
    // Pick Portugal — listbox shows the country name
    fireEvent.click(screen.getByRole('option', { name: /Portugal.*\+351/i }))
    expect(
      screen.getByRole('button', { name: /Indicativo Portugal \+351/i })
    ).toBeInTheDocument()
  })

  it('renders the avatar upload button', async () => {
    await renderPage()
    expect(screen.getByRole('button', { name: /carregar imagem/i })).toBeInTheDocument()
  })
})

describe('Onboarding /onboarding — Skip', () => {
  it('routes to /onboarding/intent without saving anything', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /^skip$/i }))
    expect(mockPush).toHaveBeenCalledWith('/onboarding/intent')
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

describe('Onboarding /onboarding — Continuar', () => {
  it('PATCHes /api/profile with concat dial+digits and location, then goes to /onboarding/intent', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    await renderPage()

    // Default dial is +244 (Angola)
    fireEvent.change(screen.getByPlaceholderText('900 000 000'), {
      target: { value: '923 555 444' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/profile', expect.objectContaining({
        method: 'PATCH',
      }))
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body.phone).toBe('+244923555444') // dial prefix + digits-only
    expect(body.location).toEqual({ dial_code: '+244', country_code: 'AO' })
    expect(body.avatar_url).toBeUndefined()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/intent')
    })
  })

  it('skips the API call when nothing is filled in', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/intent')
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('shows server error when /api/profile fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Falha ao guardar' }),
    })
    await renderPage()

    fireEvent.change(screen.getByPlaceholderText('900 000 000'), {
      target: { value: '923000000' },
    })
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByText('Falha ao guardar')).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe('Onboarding /onboarding — avatar upload', () => {
  function pickFile(file: File) {
    // input is visually hidden; find by type/accept
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    expect(fileInput).toBeTruthy()
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
      configurable: true,
    })
    fireEvent.change(fileInput)
  }

  it('rejects non-image files with an inline error', async () => {
    await renderPage()
    pickFile(new File(['hello'], 'note.txt', { type: 'text/plain' }))
    expect(await screen.findByText('O ficheiro deve ser uma imagem.')).toBeInTheDocument()
  })

  it('rejects images larger than 5MB', async () => {
    await renderPage()
    const big = new File([new Uint8Array(6 * 1024 * 1024)], 'big.jpg', {
      type: 'image/jpeg',
    })
    pickFile(big)
    expect(await screen.findByText('A imagem ultrapassa 5MB.')).toBeInTheDocument()
  })

  it('uploads to the "avatars" bucket (not "logo") when submitted', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-xyz' } } })
    mockUpload.mockResolvedValue({ error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://cdn/avatars/u.jpg' } })
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })

    await renderPage()

    const file = new File([new Uint8Array(1024)], 'me.png', { type: 'image/png' })
    pickFile(file)

    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled()
    })

    // first arg is the bucket name we captured
    const [bucketName, path] = mockUpload.mock.calls[0]
    expect(bucketName).toBe('avatars')
    // path is namespaced by user id, no leading "avatars/" prefix (bucket already says it)
    expect(path).toMatch(/^user-xyz\/\d+-[a-z0-9]+\.png$/)

    // and the PATCH body carries the resulting public URL
    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.avatar_url).toBe('https://cdn/avatars/u.jpg')
    })
  })
})
