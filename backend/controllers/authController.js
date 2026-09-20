import axios from "axios";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { logger } from "../utils/logger.js";

const signToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  githubUsername: user.githubUsername,
});

// ==========================================
// POST /api/auth/signup
// ==========================================

export const signup = async (req, res, next) => {
  try {
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Required fields
    if (!name || !username || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    // Clean input
    const cleanName = name.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Validate username
    if (cleanUsername.length < 3) {
      const error = new Error(
        "Username must be at least 3 characters"
      );
      error.statusCode = 400;
      throw error;
    }

    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      const error = new Error("Invalid email address");
      error.statusCode = 400;
      throw error;
    }

    // Validate password
    if (password.length < 8) {
      const error = new Error(
        "Password must be at least 8 characters"
      );
      error.statusCode = 400;
      throw error;
    }

    // Confirm password
    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      throw error;
    }

    // ==========================================
    // Check if email OR username already exists
    // ==========================================

    const existingEmail = await User.findOne({
      email: cleanEmail,
    });

    if (existingEmail) {
      const error = new Error(
        "An account with this email already exists"
      );
      error.statusCode = 409;
      throw error;
    }

    const existingUsername = await User.findOne({
      username: cleanUsername,
    });

    if (existingUsername) {
      const error = new Error(
        "This username is already taken"
      );
      error.statusCode = 409;
      throw error;
    }

    // ==========================================
    // Create user
    // Password will be hashed by User model
    // ==========================================

    const user = await User.create({
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password,
    });

    logger.info("User signed up", {
      userId: user._id.toString(),
    });

    // Response
    res.status(201).json({
      success: true,
      data: {
        token: signToken(user),
        user: publicUser(user),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// POST /api/auth/login
// ==========================================

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error(
        "Email and password are required"
      );
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    }).select("+password");

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    res.json({
      success: true,
      data: {
        token: signToken(user),
        user: publicUser(user),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// POST /api/auth/logout
// ==========================================

export const logout = (req, res) => {
  res.json({
    success: true,
    message: "Logged out",
  });
};

// ==========================================
// GET /api/auth/me
// ==========================================

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: publicUser(user),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// POST /api/auth/forgot-password
// ==========================================

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.json({
        success: true,
        message:
          "If that email is registered, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordExpires =
      Date.now() + 30 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

    logger.info(
      "Password reset link generated (email sending not configured)",
      {
        resetUrl,
      }
    );

    res.json({
      success: true,
      message:
        "If that email is registered, a reset link has been sent.",
      ...(process.env.NODE_ENV !== "production" && {
        devResetUrl: resetUrl,
      }),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// POST /api/auth/reset-password
// ==========================================

export const resetPassword = async (req, res, next) => {
  try {
    const {
      token,
      password,
      confirmPassword,
    } = req.body;

    if (!token || !password) {
      const error = new Error(
        "Token and new password are required"
      );
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error(
        "Password must be at least 8 characters"
      );
      error.statusCode = 400;
      throw error;
    }

    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      throw error;
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    }).select(
      "+resetPasswordToken +resetPasswordExpires +password"
    );

    if (!user) {
      const error = new Error(
        "Reset link is invalid or has expired"
      );
      error.statusCode = 400;
      throw error;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message:
        "Password updated — you can log in now.",
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// GET /api/auth/github
// Start GitHub OAuth
// ==========================================

export const githubLoginRedirect = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,

    redirect_uri:
      process.env.GITHUB_CALLBACK_URL ||
      `${req.protocol}://${req.get(
        "host"
      )}/api/auth/github/callback`,

    scope: "read:user user:email repo",
  });

  const githubUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  res.redirect(githubUrl);
};

// ==========================================
// GET /api/auth/github/callback
// GitHub OAuth callback
// ==========================================

export const githubCallback = async (
  req,
  res,
  next
) => {
  try {
    const { code } = req.query;

    if (!code) {
      const error = new Error(
        "GitHub authorization code is missing"
      );
      error.statusCode = 400;
      throw error;
    }

    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      const error = new Error(
        "GitHub OAuth failed — no access token returned"
      );
      error.statusCode = 401;
      throw error;
    }

    // Get GitHub user
    const { data: ghUser } = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Check existing GitHub account
    let user = await User.findOne({
      githubId: ghUser.id,
    });

    // ==========================================
    // Create GitHub account if not found
    // ==========================================

    if (!user) {
      const email =
        ghUser.email ||
        `${ghUser.login}-${ghUser.id}@users.noreply.github.com`;

      let username = ghUser.login;

      // Avoid username collision
      const usernameExists = await User.findOne({
        username,
      });

      if (usernameExists) {
        username = `${username}-${ghUser.id}`;
      }

      // Avoid email collision
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
      });

      if (emailExists) {
        user = emailExists;

        user.githubId = ghUser.id;
        user.githubUsername = ghUser.login;
        user.avatar = ghUser.avatar_url;
        user.githubAccessToken = accessToken;

        await user.save();
      } else {
        user = await User.create({
          name: ghUser.name || ghUser.login,
          username,
          email: email.toLowerCase(),
          githubId: ghUser.id,
          githubUsername: ghUser.login,
          avatar: ghUser.avatar_url,
          githubAccessToken: accessToken,
        });
      }
    } else {
      // Update existing GitHub account
      user.githubAccessToken = accessToken;
      user.avatar = ghUser.avatar_url;
      user.githubUsername = ghUser.login;

      await user.save();
    }

    const jwtToken = signToken(user);

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${jwtToken}`
    );
  } catch (err) {
    next(err);
  }
};