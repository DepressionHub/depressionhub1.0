// pages/api/auth/check.ts

import { NextApiRequest, NextApiResponse } from "next";
import { isAuthenticated } from "../../admin/ middleware/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    isAuthenticated(req, res, () => {
      res.status(200).json({ message: "Authenticated" });
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
