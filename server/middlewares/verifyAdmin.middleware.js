import jwt from "jsonwebtoken";

export const verifyAdminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or invalid!",
        error: true,
        success: false,
      });
    }

    const token = authHeader.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.admin = decoded;
    next(); 
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      message: "Invalid or expired token!",
      error: true,
      success: false,
    });
  }
};
