// middleware/auth.ts

import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

export function isAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const session = req.cookies.session;

  if (session === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
