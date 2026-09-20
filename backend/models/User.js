import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    githubId: {
      type: Number,
      unique: true,
      sparse: true,
    },

    githubUsername: {
      type: String,
    },

    avatar: {
      type: String,
    },

    githubAccessToken: {
      type: String,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// Compare password
userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);