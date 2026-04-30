import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoogleButton } from "@/components/GoogleButton";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockSignInWithOAuth = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signInWithOAuth: mockSignInWithOAuth },
  }),
}));

Object.defineProperty(window, "location", {
  value: { origin: "https://barza.app" },
  writable: true,
});

beforeEach(() => vi.clearAllMocks());

describe("GoogleButton — render", () => {
  it("renders with default label", () => {
    render(<GoogleButton />);
    expect(screen.getByText("Continuar com Google")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<GoogleButton label="Registar com Google" />);
    expect(screen.getByText("Registar com Google")).toBeInTheDocument();
  });

  it("renders the Google SVG logo", () => {
    const { container } = render(<GoogleButton />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("GoogleButton — OAuth flow", () => {
  it("calls signInWithOAuth with google provider and correct redirectTo", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    render(<GoogleButton />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: expect.objectContaining({
          redirectTo: "https://barza.app/auth/callback",
        }),
      });
    });
  });

  it("passes access_type=offline and prompt=consent queryParams", async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    render(<GoogleButton />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(mockSignInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          }),
        })
      );
    });
  });

  it("shows loading state while redirecting", async () => {
    // Never resolves — simulates redirect in progress
    mockSignInWithOAuth.mockReturnValue(new Promise(() => {}));
    render(<GoogleButton />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("A redirecionar...")).toBeInTheDocument();
    });
  });

  it("shows error message when OAuth fails", async () => {
    mockSignInWithOAuth.mockResolvedValue({
      error: { message: "OAuth error" },
    });
    render(<GoogleButton />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao iniciar sessão com Google. Tenta novamente.")
      ).toBeInTheDocument();
    });
  });

  it("is disabled while loading", async () => {
    mockSignInWithOAuth.mockReturnValue(new Promise(() => {}));
    render(<GoogleButton />);

    const btn = screen.getByRole("button");
    fireEvent.click(btn);

    await waitFor(() => {
      expect(btn).toBeDisabled();
    });
  });
});
