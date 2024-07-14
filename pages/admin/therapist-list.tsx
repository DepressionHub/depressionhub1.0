// pages/admin/therapist-list.tsx

import { useEffect, useState } from "react";

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
  const [therapistsList, setTherapistsList] = useState<Therapist[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTherapists = async () => {
    try {
      const response = await fetch("/api/therapists");
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

  const toggleVerificationStatus = async (therapistId: string) => {
    try {
      const response = await fetch(`/api/therapists/${therapistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to toggle verification status");
      }
      await fetchTherapists(); // Refresh therapists list after toggle
    } catch (error) {
      console.error("Error toggling verification status:", error);
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
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => toggleVerificationStatus(therapist.id)}
              >
                Toggle Verification
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminTherapistListPage;
