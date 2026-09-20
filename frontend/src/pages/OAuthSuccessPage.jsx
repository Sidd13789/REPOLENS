import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// GitHub OAuth redirects here with ?token=<jwt> after a successful login.
export default function OAuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login");
      return;
    }
    loginWithToken(token).then(() => navigate("/dashboard"));
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400">
      Signing you in with GitHub...
    </div>
  );
}
