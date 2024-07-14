// pages/api/auth/login.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // In a real application, you would check these credentials against a database
    if (username === "admin" && password === "securepassword") {
      // Set a secure, HTTP-only cookie
      res.setHeader(
        "Set-Cookie",
        "session=admin; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600"
      );
      res.status(200).json({ message: "Logged in successfully" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
