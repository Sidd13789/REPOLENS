import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  githubLoginRedirect,
  githubCallback,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create an account with email + password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, username, email, password, confirmPassword]
 *             properties:
 *               name: { type: string }
 *               username: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       201: { description: Account created, returns a JWT + user profile }
 *       400: { description: Validation error }
 *       409: { description: Email or username already taken }
 */
router.post("/signup", authLimiter, signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with email + password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Returns a JWT + user profile }
 *       401: { description: Invalid credentials }
 */
router.post("/login", authLimiter, login);

router.post("/logout", logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get the current authenticated user's profile
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: The current user }
 *       401: { description: Not authorized }
 */
router.get("/me", protect, getMe);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { email: { type: string } }
 *     responses:
 *       200: { description: Always returns success, to avoid leaking which emails are registered }
 */
router.post("/forgot-password", authLimiter, forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using a token from the reset email/link
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       200: { description: Password updated }
 *       400: { description: Invalid or expired token }
 */
router.post("/reset-password", authLimiter, resetPassword);

/**
 * @openapi
 * /auth/github:
 *   get:
 *     summary: Start the GitHub OAuth login flow (redirects to GitHub)
 *     tags: [Auth]
 *     responses:
 *       302: { description: Redirect to GitHub's consent screen }
 */
router.get("/github", githubLoginRedirect);

router.get("/github/callback", githubCallback);

export default router;
