// pages/api/therapists/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const therapists = await prisma.therapist.findMany({
        include: {
          specializations: true,
        },
      });
      res.status(200).json(therapists);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      res.status(500).json({ error: "Failed to fetch therapists" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
