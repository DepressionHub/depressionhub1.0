import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../db/db";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const request = await prisma.therapySessionRequest.findUnique({
        where: { id: id as string },
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

      if (!request) {
        return res
          .status(404)
          .json({ error: "Therapy session request not found" });
      }

      return res.status(200).json(request);
    } catch (error) {
      console.error("Error fetching therapy session request:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch therapy session request" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
