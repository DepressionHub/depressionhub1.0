import { GetServerSideProps } from "next";
import { getSession, useSession, signIn } from "next-auth/react";
import prisma from "../../db/db";
import { Therapist, Specialization } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface TherapistWithSpecializations extends Therapist {
  specializations: Specialization[];
}

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
      signIn(undefined, { callbackUrl: router.asPath });
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  if (!therapist) {
    return (
      <div>Therapist information not found. Please complete your profile.</div>
    );
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

  if (!session || !session.user || !session.user.id) {
    return {
      redirect: {
        destination:
          "/api/auth/signin?callbackUrl=" +
          encodeURIComponent(context.resolvedUrl),
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
