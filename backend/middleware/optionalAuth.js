import jwt from "jsonwebtoken";

// Like `protect`, but doesn't reject the request when there's no/invalid
// token — it just leaves req.user unset. Used on routes that behave
// differently for logged-in vs anonymous users (e.g. /repos/analyze).
export const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // invalid/expired token on an optional route — just proceed anonymously
  }
  next();
};
