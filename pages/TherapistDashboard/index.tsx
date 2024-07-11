import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "../../db/db";
import { Therapist, Specialization } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

type TherapistWithSpecializations = Therapist & {
  specializations: Specialization[];
};

interface TherapistDashboardProps {
  therapist: TherapistWithSpecializations | null;
}

export default function TherapistDashboard({
  therapist,
}: TherapistDashboardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/TherapistDashboard");
    }
  }, [status, router]);

  if (status === "loading" || !therapist) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {therapist.fullName}</h1>
      <p>Type: {therapist.type}</p>
      <p>
        Specializations:{" "}
        {therapist.specializations.map((s) => s.name).join(", ")}
      </p>
      <h1>Therapist Dashboard</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  TherapistDashboardProps
> = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return {
      redirect: {
        destination: "/api/auth/signin?callbackUrl=/TherapistDashboard",
        permanent: false,
      },
    };
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    include: { specializations: true },
  });

  if (!therapist) {
    return {
      redirect: {
        destination: "/TherapistApply",
        permanent: false,
      },
    };
  }

  return {
    props: {
      therapist: JSON.parse(JSON.stringify(therapist)),
    },
  };
};
