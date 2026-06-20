import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate } from "react-router-dom";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <button className="btn-ghost" onClick={() => void navigate("/login")}>
        Sign in
      </button>
    );
  }

  return (
    <button className="btn-ghost" onClick={() => void signOut()}>
      Sign out
    </button>
  );
}
