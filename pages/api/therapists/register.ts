import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../db/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const {
    type,
    fullName,
    dateOfBirth,
    gender,
    currentLocation,
    languages,
    hoursAvailable,
    experienceYears,
    specializations = [],
    heardFrom,
    workingElsewhere,
    whyJoining,
    linkedinProfile,
    referredBy,
    longBio,
    certifications = [],
    education = [],
    workExperience = [],
  } = req.body;
  const specializationArray = Array.isArray(specializations)
    ? specializations
    : [];
  try {
    const therapistData = {
      userId: session.user.id,
      type,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      currentLocation,
      languages: Array.isArray(languages)
        ? languages
            .filter(
              (lang) => lang && typeof lang === "object" && "value" in lang
            )
            .map((lang) => lang.value)
        : typeof languages === "string"
        ? languages.split(",").map((lang) => lang.trim())
        : [],
      hoursAvailable: Number(hoursAvailable),
      experienceYears: Number(experienceYears),
      heardFrom,
      workingElsewhere: Boolean(workingElsewhere),
      whyJoining,
      linkedinProfile,
      referredBy,
      longBio,
      specializations: {
        create: specializationArray.map((spec: any) => ({
          name: spec.name || spec.value,
        })),
      },
      certifications: {
        create: certifications
          .filter((cert: any) => cert.name && cert.issuedAt)
          .map((cert: any) => ({
            name: cert.name,
            issuedAt: new Date(cert.issuedAt),
            expiresAt: cert.expiresAt ? new Date(cert.expiresAt) : null,
            issuedBy: cert.issuedBy,
          })),
      },
      education: {
        create: education
          .filter((edu: any) => edu.institution && edu.startDate)
          .map((edu: any) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            grade: edu.grade ? Number(edu.grade) : null,
          })),
      },
      workExperience: {
        create: workExperience
          .filter((exp: any) => exp.company && exp.startDate)
          .map((exp: any) => ({
            company: exp.company,
            position: exp.position,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          })),
      },
    };

    const newTherapist = await prisma.therapist.create({
      data: therapistData,
      include: {
        specializations: true,
        certifications: true,
        education: true,
        workExperience: true,
      },
    });

    return res.status(201).json(newTherapist);
  } catch (error) {
    console.error("Error saving therapist:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
