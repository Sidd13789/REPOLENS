import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    const e = new Error("Not authorized — no token provided");
    e.statusCode = 401;
    return next(e);
  }

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    err.statusCode = 401;
    err.message = "Not authorized — invalid or expired token";
    next(err);
  }
};
