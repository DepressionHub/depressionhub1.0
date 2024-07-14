/* eslint-disable react-hooks/exhaustive-deps */
// pages/admin/therapist-list.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "./utils/auth";

interface Therapist {
  id: string;
  userId: string;
  type: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  currentLocation: string;
  languages: string[];
  hoursAvailable: number;
  experienceYears: number;
  heardFrom: string;
  workingElsewhere: boolean;
  whyJoining: string;
  linkedinProfile: string | null;
  referredBy: string | null;
  longBio: string;
  isVerified: boolean;
  specializations: { id: string; name: string }[];
}

const AdminTherapistListPage: React.FC = () => {
  useAuth();
  const router = useRouter();
  const [therapistsList, setTherapistsList] = useState<Therapist[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTherapists = async () => {
    try {
      const response = await fetch("/api/therapists");
      if (response.status === 401) {
        router.push("/admin"); // Redirect to login if unauthorized
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch therapists");
      }
      const fetchedTherapists: Therapist[] = await response.json();
      setTherapistsList(fetchedTherapists);
      setError(null);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setError("Failed to fetch therapists. Please try again.");
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const updateVerificationStatus = async (
    therapistId: string,
    isVerified: boolean
  ) => {
    try {
      const response = await fetch(`/api/therapists/${therapistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVerified }),
      });
      if (!response.ok) {
        throw new Error("Failed to update verification status");
      }
      await fetchTherapists(); // Refresh therapists list after update
    } catch (error) {
      console.error("Error updating verification status:", error);
      setError("Failed to update therapist status. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Therapist List</h1>
      {therapistsList.length === 0 ? (
        <p>No therapists found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {therapistsList.map((therapist) => (
            <li key={therapist.id} className="py-4">
              <p className="text-lg font-semibold">{therapist.fullName}</p>
              <p>Type: {therapist.type}</p>
              <p>
                Verified:{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm ${
                    therapist.isVerified
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {therapist.isVerified ? "Yes" : "No"}
                </span>
              </p>
              <div className="mt-2">
                <button
                  className={`mr-2 px-4 py-2 rounded ${
                    therapist.isVerified
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  onClick={() => updateVerificationStatus(therapist.id, true)}
                >
                  Verify
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    !therapist.isVerified
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                  onClick={() => updateVerificationStatus(therapist.id, false)}
                >
                  Unverify
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminTherapistListPage;
