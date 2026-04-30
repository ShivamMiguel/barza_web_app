import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupModal } from "@/components/SignupModal";

// ─── Mocks ────────────────────────────────────────────────────────────────────
const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
});

function renderModal(props: Record<string, unknown> = {}) {
  const defaults = {
    isOpen: true,
    onClose: vi.fn(),
    onLoginClick: vi.fn(),
    onSignupSuccess: vi.fn(),
  };
  return render(<SignupModal {...defaults} {...props} />);
}

function mockFetchSuccess() {
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });
}

function mockFetchError(message: string) {
  mockFetch.mockResolvedValue({
    ok: false,
    json: async () => ({ error: message }),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("SignupModal — visibility", () => {
  it("renders when isOpen is true", () => {
    renderModal();
    expect(screen.getByRole("heading", { name: "Criar Conta" })).toBeInTheDocument();
  });

  it("renders nothing when isOpen is false", () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText("Criar Conta")).not.toBeInTheDocument();
  });
});

describe("SignupModal — form fields", () => {
  it("has a name field", () => {
    renderModal();
    expect(screen.getByPlaceholderText("Como gostas de ser chamado?")).toBeInTheDocument();
  });

  it("has an email field", () => {
    renderModal();
    expect(screen.getByPlaceholderText("O teu melhor email")).toBeInTheDocument();
  });

  it("has no phone field", () => {
    renderModal();
    expect(screen.queryByPlaceholderText("Número para acesso rápido")).not.toBeInTheDocument();
  });

  it("has a password field with minLength 8", () => {
    renderModal();
    const pw = screen.getByPlaceholderText("Mínimo 8 caracteres");
    expect(pw).toHaveAttribute("minLength", "8");
    expect(pw).toHaveAttribute("type", "password");
  });

  it("toggles password visibility when eye button is clicked", () => {
    renderModal();
    const pw = screen.getByPlaceholderText("Mínimo 8 caracteres");
    const toggle = screen.getByRole("button", { name: /mostrar palavra-passe/i });
    expect(pw).toHaveAttribute("type", "password");
    fireEvent.click(toggle);
    expect(pw).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: /ocultar palavra-passe/i }));
    expect(pw).toHaveAttribute("type", "password");
  });
});

describe("SignupModal — submission", () => {
  it("calls /api/auth/signup without phone field", async () => {
    mockFetchSuccess();
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("Como gostas de ser chamado?"), {
      target: { value: "Beatriz Luanda" },
    });
    fireEvent.change(screen.getByPlaceholderText("O teu melhor email"), {
      target: { value: "beatriz@barza.app" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"), {
      target: { value: "segura123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "beatriz@barza.app",
          password: "segura123",
          full_name: "Beatriz Luanda",
        }),
      });
    });
  });

  it("calls onSignupSuccess with the email on success", async () => {
    mockFetchSuccess();
    const onSignupSuccess = vi.fn();
    renderModal({ onSignupSuccess });

    fireEvent.change(screen.getByPlaceholderText("Como gostas de ser chamado?"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("O teu melhor email"), {
      target: { value: "test@barza.app" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"), {
      target: { value: "password8" },
    });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(onSignupSuccess).toHaveBeenCalledWith("test@barza.app");
    });
  });

  it("shows error when email already registered", async () => {
    mockFetchError("Este email já tem uma conta. Faz login.");
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("Como gostas de ser chamado?"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText("O teu melhor email"), {
      target: { value: "existing@barza.app" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mínimo 8 caracteres"), {
      target: { value: "password8" },
    });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => {
      expect(screen.getByText("Este email já tem uma conta. Faz login.")).toBeInTheDocument();
    });
  });
});

describe("SignupModal — navigation", () => {
  it("calls onClose when X is clicked", () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByText("close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose + onLoginClick when "Entrar na Conta" is clicked', () => {
    const onClose = vi.fn();
    const onLoginClick = vi.fn();
    renderModal({ onClose, onLoginClick });
    fireEvent.click(screen.getByText("Entrar na Conta"));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onLoginClick).toHaveBeenCalledOnce();
  });
});
