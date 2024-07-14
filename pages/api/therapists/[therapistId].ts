// pages/api/therapists/[therapistId].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { therapistId } = req.query;

  if (req.method === "PATCH") {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ error: "Invalid isVerified value" });
    }

    try {
      const updatedTherapist = await prisma.therapist.update({
        where: { id: String(therapistId) },
        data: {
          isVerified: isVerified,
        },
        include: {
          specializations: true,
        },
      });
      res.status(200).json(updatedTherapist);
    } catch (error) {
      console.error("Error updating verification status:", error);
      res.status(500).json({ error: "Failed to update verification status" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
