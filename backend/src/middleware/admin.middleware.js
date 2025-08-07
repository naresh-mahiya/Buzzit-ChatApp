export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }

    next();
  } catch (error) {
    console.log("Error in requireAdmin middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
