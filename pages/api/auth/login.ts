import { NextApiRequest, NextApiResponse } from "next";

const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (username === adminUsername && password === adminPassword) {
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
