import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginModal } from "@/components/LoginModal";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockFetch = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// Replace global fetch with mock
beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderModal(props = {}) {
  const defaults = {
    isOpen: true,
    onClose: vi.fn(),
    onSignupClick: vi.fn(),
  };
  return render(<LoginModal {...defaults} {...props} />);
}

function mockFetchSuccess() {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });
}

function mockFetchError(message: string, status = 401) {
  mockFetch.mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ error: message }),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("LoginModal — visibility", () => {
  it("renders when isOpen is true", () => {
    renderModal();
    expect(screen.getByRole("heading", { name: "Entrar" })).toBeInTheDocument();
  });

  it("renders nothing when isOpen is false", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText("Entrar")).not.toBeInTheDocument();
  });
});

describe("LoginModal — form fields", () => {
  it("has an email input", () => {
    renderModal();
    expect(screen.getByPlaceholderText("O teu email")).toBeInTheDocument();
  });

  it("has a password input of type password", () => {
    renderModal();
    const pw = screen.getByPlaceholderText("A tua palavra-passe");
    expect(pw).toHaveAttribute("type", "password");
  });

  it("toggles password visibility when eye button is clicked", () => {
    renderModal();
    const pw = screen.getByPlaceholderText("A tua palavra-passe");
    const toggle = screen.getByRole("button", { name: /mostrar palavra-passe/i });
    expect(pw).toHaveAttribute("type", "password");
    fireEvent.click(toggle);
    expect(pw).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: /ocultar palavra-passe/i }));
    expect(pw).toHaveAttribute("type", "password");
  });
});

describe("LoginModal — submission", () => {
  it("calls /api/auth/login with correct credentials", async () => {
    mockFetchSuccess();
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("O teu email"), {
      target: { value: "user@barza.app" },
    });
    fireEvent.change(screen.getByPlaceholderText("A tua palavra-passe"), {
      target: { value: "senha123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@barza.app", password: "senha123" }),
      });
    });
  });

  it("redirects to /community on success", async () => {
    mockFetchSuccess();
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("O teu email"), {
      target: { value: "user@barza.app" },
    });
    fireEvent.change(screen.getByPlaceholderText("A tua palavra-passe"), {
      target: { value: "senha123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/community");
    });
  });

  it("shows error message returned by the API", async () => {
    mockFetchError("Email ou palavra-passe incorrectos.");
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("O teu email"), {
      target: { value: "wrong@barza.app" },
    });
    fireEvent.change(screen.getByPlaceholderText("A tua palavra-passe"), {
      target: { value: "errada" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Email ou palavra-passe incorrectos.")).toBeInTheDocument();
    });
  });

  it("shows fallback error when API returns no message", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("O teu email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("A tua palavra-passe"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Erro ao entrar. Tenta novamente.")).toBeInTheDocument();
    });
  });
});

describe("LoginModal — navigation", () => {
  it("calls onClose when X is clicked", () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByText("close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose + onSignupClick when "Criar Conta Agora" is clicked', () => {
    const onClose = vi.fn();
    const onSignupClick = vi.fn();
    renderModal({ onClose, onSignupClick });
    fireEvent.click(screen.getByText("Criar Conta Agora"));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onSignupClick).toHaveBeenCalledOnce();
  });
});
