import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [devUrl, setDevUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
      if (res.devResetUrl) setDevUrl(res.devResetUrl);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-xl font-bold text-center mb-1">Reset your password</h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          Enter your email and we'll send a reset link.
        </p>

        {!message ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-medium disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-sm text-gray-300 space-y-3">
            <p>{message}</p>
            {devUrl && (
              <p className="text-xs text-gray-500 break-all">
                (dev only — no email service configured)
                <br />
                <Link to={devUrl.replace(window.location.origin, "")} className="text-blue-400">
                  {devUrl}
                </Link>
              </p>
            )}
          </div>
        )}

        <p className="text-sm text-center mt-6 text-gray-400">
          <Link to="/login" className="text-blue-400 hover:underline">
            ← Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
