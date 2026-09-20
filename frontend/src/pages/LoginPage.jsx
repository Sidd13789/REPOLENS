import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });

      showToast("Logged in successfully");

      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/auth_lo.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Login Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          lg:ml-[35%]
          xl:ml-[40%]
        "
      >
        <div
          className="
            w-full
            bg-gray-950/60
            backdrop-blur-xl
            border
            border-white/20
            rounded-2xl
            p-7
            sm:p-8
            shadow-2xl
          "
        >

          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-3xl font-bold text-white">
              Repo<span className="text-blue-500">Lens</span>
            </h1>

            <p className="text-gray-300 text-sm mt-2">
              Welcome back
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  bg-black/30
                  text-white
                  placeholder-gray-400
                  border
                  border-white/20
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                  transition
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  bg-black/30
                  text-white
                  placeholder-gray-400
                  border
                  border-white/20
                  rounded-lg
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                  focus:ring-1
                  focus:ring-blue-500
                  transition
                "
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-500
                text-white
                rounded-lg
                py-3
                font-semibold
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition
                shadow-lg
                shadow-blue-600/20
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6 text-xs text-gray-400">
            <div className="flex-1 h-px bg-white/15" />
            <span>OR</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* GitHub */}
          <a
            href="/api/auth/github"
            className="
              block
              text-center
              w-full
              bg-white/10
              hover:bg-white/15
              text-white
              border
              border-white/15
              rounded-lg
              py-3
              font-medium
              transition
            "
          >
            Continue with GitHub
          </a>

          {/* Links */}
          <div className="text-sm text-center mt-6 space-y-2">

            <p>
              <Link
                to="/forgot-password"
                className="
                  text-blue-400
                  hover:text-blue-300
                  hover:underline
                "
              >
                Forgot password?
              </Link>
            </p>

            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="
                  text-blue-400
                  hover:text-blue-300
                  hover:underline
                  font-medium
                "
              >
                Sign up
              </Link>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}