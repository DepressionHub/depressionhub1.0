// pages/api/therapists/[therapistId].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { therapistId } = req.query;

  if (req.method === "PATCH") {
    try {
      const updatedTherapist = await prisma.therapist.update({
        where: { id: String(therapistId) },
        data: {
          isVerified: true,
        },
        include: {
          specializations: true,
        },
      });
      res.status(200).json(updatedTherapist);
    } catch (error) {
      console.error("Error toggling verification status:", error);
      res.status(500).json({ error: "Failed to toggle verification status" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
