import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../db/db";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  // Update the session type
  if (!session || !session.user || typeof session.user.id !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { therapistId } = req.body;

    if (
      typeof session.user.id !== "string" ||
      typeof therapistId !== "string"
    ) {
      return res.status(400).json({ error: "Invalid User ID or Therapist ID" });
    }

    try {
      const request = await prisma.therapySessionRequest.create({
        data: {
          userId: session.user.id,
          therapistId: therapistId,
          status: "PENDING",
        },
      });

      return res.status(201).json(request);
    } catch (error) {
      console.error("Error creating session request:", error);
      return res
        .status(500)
        .json({ error: "Failed to create session request" });
    }
  } else if (req.method === "GET") {
    try {
      const requests = await prisma.therapySessionRequest.findMany({
        where: {
          status: "PENDING",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching session requests:", error);
      res.status(500).json({ error: "Failed to fetch session requests" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
