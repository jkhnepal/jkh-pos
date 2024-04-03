import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const requireBranch = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: true, msg: "Access token is missing" });
  }

  try {
    const decoded: any = jwt.verify(token, `${process.env.AUTH_SECRET_KEY}`);

    if (decoded.branch.type !== "branch") {
      return res.status(403).json({ error: true, msg: "Branch is not authorized " });
    }

    // Attach the decoded payload to the request for later use in the route handlers
    // req.user = decoded.user;

    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ error: true, msg: "Invalid token" });
  }
};
