import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/db/db";
import { Therapist } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface TherapistApplyProps {
  therapist:
    | (Omit<Therapist, "dateOfBirth"> & { dateOfBirth: string | null })
    | null;
}

export default function TherapistApply({ therapist }: TherapistApplyProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    // ... your existing formData initialization
    dateOfBirth: "", // Adjust based on your form requirements
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (therapist && therapist.dateOfBirth) {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: new Date(therapist.dateOfBirth)
          .toISOString()
          .split("T")[0],
      }));
    }
  }, [therapist]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/therapists/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/TherapistDashboard");
      } else {
        console.error("Failed to register therapist:", response.statusText);
      }
    } catch (error) {
      console.error("Error registering therapist:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to apply as a therapist.</div>;
  }

  if (therapist) {
    return <div>You have already applied as a therapist.</div>;
  }

  return (
    <div>
      <h1>Apply as a Therapist</h1>
      <form onSubmit={handleSubmit}>{/* Your form inputs */}</form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  TherapistApplyProps
> = async (context) => {
  const session = await getSession(context);

  if (!session || !session.user || !session.user.id) {
    return { props: { therapist: null } };
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
  });

  if (therapist) {
    return {
      props: {
        therapist: {
          ...therapist,
          dateOfBirth: therapist.dateOfBirth
            ? therapist.dateOfBirth.toISOString()
            : null,
        },
      },
    };
  }

  return {
    props: {
      therapist: null,
    },
  };
};
