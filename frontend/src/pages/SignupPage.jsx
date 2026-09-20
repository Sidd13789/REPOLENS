import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => {
    setForm((current) => ({
      ...current,
      [field]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check password
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check minimum password length
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      showToast("Account created! Please login.");

      // Signup ke baad Login page
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden">

      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}
      <div
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url('/auth_bg.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      />

      {/* Light dark overlay */}
      <div className="absolute inset-0 bg-black/20" />


      {/* =====================================================
          SIGNUP CONTENT
      ====================================================== */}
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

        {/* =====================================================
            SIGNUP CARD
        ====================================================== */}
        <div
          className="
            w-full

            bg-gray-950/55
            backdrop-blur-xl

            border
            border-white/20

            rounded-2xl

            p-7
            sm:p-8

            shadow-2xl
          "
        >

          {/* =====================================================
              LOGO / HEADING
          ====================================================== */}
          <div className="text-center mb-7">

            <h1 className="text-3xl font-bold text-white">
              Repo<span className="text-blue-500">Lens</span>
            </h1>

            <p className="text-gray-300 text-sm mt-2">
              Create your account
            </p>

          </div>


          {/* =====================================================
              SIGNUP FORM
          ====================================================== */}
          <form
            onSubmit={handleSubmit}
            className="space-y-3.5"
          >

            {/* =================================================
                FULL NAME
            ================================================== */}
            <div>
              <input
                type="text"
                placeholder="Full name"
                required
                value={form.name}
                onChange={update("name")}
                className="
                  w-full

                  bg-black/25

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


            {/* =================================================
                USERNAME
            ================================================== */}
            <div>
              <input
                type="text"
                placeholder="Username"
                required
                value={form.username}
                onChange={update("username")}
                className="
                  w-full

                  bg-black/25

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


            {/* =================================================
                EMAIL
            ================================================== */}
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={update("email")}
                className="
                  w-full

                  bg-black/25

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


            {/* =================================================
                PASSWORD
            ================================================== */}
            <div>
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                required
                minLength={8}
                value={form.password}
                onChange={update("password")}
                className="
                  w-full

                  bg-black/25

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


            {/* =================================================
                CONFIRM PASSWORD
            ================================================== */}
            <div>
              <input
                type="password"
                placeholder="Confirm password"
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                className="
                  w-full

                  bg-black/25

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


            {/* =================================================
                ERROR MESSAGE
            ================================================== */}
            {error && (
              <p className="text-red-400 text-sm pt-1">
                {error}
              </p>
            )}


            {/* =================================================
                CREATE ACCOUNT BUTTON
            ================================================== */}
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
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>


          {/* =====================================================
              OR DIVIDER
          ====================================================== */}
          <div
            className="
              flex
              items-center
              gap-3

              my-6

              text-xs
              text-gray-400
            "
          >

            <div className="flex-1 h-px bg-white/15" />

            <span>OR</span>

            <div className="flex-1 h-px bg-white/15" />

          </div>


          {/* =====================================================
              GITHUB LOGIN
          ====================================================== */}
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


          {/* =====================================================
              LOGIN LINK
          ====================================================== */}
          <p
            className="
              text-sm
              text-center

              mt-6

              text-gray-300
            "
          >
            Already have an account?{" "}

            <Link
              to="/login"
              className="
                text-blue-400

                hover:text-blue-300
                hover:underline

                font-medium
              "
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}