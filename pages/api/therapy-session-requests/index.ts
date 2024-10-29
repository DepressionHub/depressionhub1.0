import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../db/db";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    console.log("Fetching requests");
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
          therapist: {
            select: {
              fullName: true,
            },
          },
        },
      });
      console.log("Found requests:", requests);
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  } else if (req.method === "POST") {
    const { therapistId } = req.body;

    if (!therapistId) {
      return res.status(400).json({ error: "Therapist ID is required" });
    }

    try {
      const newRequest = await prisma.therapySessionRequest.create({
        data: {
          userId: token.sub,
          therapistId,
          status: "PENDING",
        },
      });
      console.log("Created new request:", newRequest);
      res.status(201).json(newRequest);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ error: "Failed to create request" });
    }
  } else if (req.method === "PUT") {
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id, status } = req.body;
    console.log("Updating session request:", { id, status });

    try {
      const updatedRequest = await prisma.therapySessionRequest.update({
        where: { id },
        data: { status },
      });

      console.log("Updated request:", updatedRequest);
      return res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Error updating session request:", error);
      return res
        .status(500)
        .json({ error: "Failed to update session request" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
