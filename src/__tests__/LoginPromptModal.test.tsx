import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPromptModal } from "@/components/LoginPromptModal";

describe("LoginPromptModal", () => {
  it("renders with feature name and buttons", () => {
    const onClose = vi.fn();
    const onSignIn = vi.fn();

    render(
      <LoginPromptModal
        isOpen={true}
        onClose={onClose}
        featureName="the AI Assistant"
        onSignIn={onSignIn}
      />,
    );

    expect(screen.getByText("Sign In Required")).toBeTruthy();
    expect(screen.getByText(/sign in to access/i)).toBeTruthy();
    expect(screen.getByText(/AI Assistant/i)).toBeTruthy();
  });

  it("calls onSignIn when Sign In button clicked", () => {
    const onClose = vi.fn();
    const onSignIn = vi.fn();

    render(
      <LoginPromptModal
        isOpen={true}
        onClose={onClose}
        featureName="find your representative"
        onSignIn={onSignIn}
      />,
    );

    fireEvent.click(screen.getByText("Sign In"));
    expect(onSignIn).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Cancel button clicked", () => {
    const onClose = vi.fn();
    const onSignIn = vi.fn();

    render(
      <LoginPromptModal
        isOpen={true}
        onClose={onClose}
        featureName="test feature"
        onSignIn={onSignIn}
      />,
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not render when closed", () => {
    const onClose = vi.fn();
    const onSignIn = vi.fn();

    render(
      <LoginPromptModal
        isOpen={false}
        onClose={onClose}
        featureName="test"
        onSignIn={onSignIn}
      />,
    );

    expect(screen.queryByText("Sign In Required")).toBeNull();
  });
});
