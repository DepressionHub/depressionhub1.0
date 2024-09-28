// pages/api/therapists/[therapistId].ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../db/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { therapistId } = req.query;

  console.log("Attempting to update therapist with ID:", therapistId);

  if (req.method === "GET") {
    try {
      const therapist = await prisma.therapist.findUnique({
        where: { id: String(therapistId) },
        include: {
          specializations: true,
        },
      });

      if (therapist) {
        res.status(200).json(therapist);
      } else {
        res.status(404).json({ message: "Therapist not found" });
      }
    } catch (error) {
      console.error("Error fetching therapist:", error);
      res.status(500).json({ error: "Failed to fetch therapist" });
    }
  } else if (req.method === "PATCH") {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ error: "Invalid isVerified value" });
    }

    if (typeof therapistId !== "string") {
      return res.status(400).json({ error: "Invalid therapistId" });
    }

    try {
      const updatedTherapist = await prisma.therapist.update({
        where: { id: therapistId },
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
    res.setHeader("Allow", ["GET", "PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
