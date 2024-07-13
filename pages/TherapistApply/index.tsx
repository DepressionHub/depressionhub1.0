import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/db/db";
import { Therapist } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface SerializedTherapist extends Omit<Therapist, "dateOfBirth"> {
  dateOfBirth: string | null;
}

interface TherapistApplyProps {
  therapist: SerializedTherapist | null;
}

export default function TherapistApply({ therapist }: TherapistApplyProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    currentLocation: "",
    languages: "",
    hoursAvailable: "",
    experienceYears: "",
    specializations: "",
    heardFrom: "",
    workingElsewhere: "",
    whyJoining: "",
    linkedinProfile: "",
    referredBy: "",
    longBio: "",
    certifications: [
      {
        name: "",
        issuedAt: "",
        expiresAt: "",
        issuedBy: "",
      },
    ],
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
      },
    ],
    workExperience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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

  const handleCertificationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [name]: value } : cert
      ),
    }));
  };

  const handleEducationChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [name]: value } : edu
      ),
    }));
  };

  const handleWorkExperienceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) =>
        i === index ? { ...exp, [name]: value } : exp
      ),
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
    return <div>You have already submitted an application as a therapist.</div>;
  }

  return (
    <div>
      <h1>Apply as a Therapist</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Basic Information</h2>
          <label>
            Type:
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="PROFESSIONAL">Professional</option>
              <option value="STUDENT">Student</option>
            </select>
          </label>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Current Location:
            <input
              type="text"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Languages Spoken:
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Hours Available:
            <input
              type="number"
              name="hoursAvailable"
              value={formData.hoursAvailable}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Experience (Years):
            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Specializations (comma separated):
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Heard From:
            <input
              type="text"
              name="heardFrom"
              value={formData.heardFrom}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Working Elsewhere:
            <select
              name="workingElsewhere"
              value={formData.workingElsewhere}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          <label>
            Why Joining:
            <textarea
              name="whyJoining"
              value={formData.whyJoining}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            LinkedIn Profile:
            <input
              type="text"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
            />
          </label>
          <label>
            Referred By:
            <input
              type="text"
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
            />
          </label>
          <label>
            Long Bio:
            <textarea
              name="longBio"
              value={formData.longBio}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form-section">
          <h2>Certifications</h2>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="sub-section">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(index, e)}
                  required
                />
              </label>
              <label>
                Issued At:
                <input
                  type="date"
                  name="issuedAt"
                  value={cert.issuedAt}
                  onChange={(e) => handleCertificationChange(index, e)}
                  required
                />
              </label>
              <label>
                Expires At:
                <input
                  type="date"
                  name="expiresAt"
                  value={cert.expiresAt}
                  onChange={(e) => handleCertificationChange(index, e)}
                />
              </label>
              <label>
                Issued By:
                <input
                  type="text"
                  name="issuedBy"
                  value={cert.issuedBy}
                  onChange={(e) => handleCertificationChange(index, e)}
                  required
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                certifications: [
                  ...prev.certifications,
                  {
                    name: "",
                    issuedAt: "",
                    expiresAt: "",
                    issuedBy: "",
                  },
                ],
              }))
            }
          >
            Add Certification
          </button>
        </div>

        <div className="form-section">
          <h2>Education</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="sub-section">
              <label>
                Institution:
                <input
                  type="text"
                  name="institution"
                  value={edu.institution}
                  onChange={(e) => handleEducationChange(index, e)}
                  required
                />
              </label>
              <label>
                Degree:
                <input
                  type="text"
                  name="degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, e)}
                  required
                />
              </label>
              <label>
                Field of Study:
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleEducationChange(index, e)}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, e)}
                  required
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  name="endDate"
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </label>
              <label>
                Grade:
                <input
                  type="text"
                  name="grade"
                  value={edu.grade}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                education: [
                  ...prev.education,
                  {
                    institution: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    grade: "",
                  },
                ],
              }))
            }
          >
            Add Education
          </button>
        </div>

        <div className="form-section">
          <h2>Work Experience</h2>
          {formData.workExperience.map((exp, index) => (
            <div key={index} className="sub-section">
              <label>
                Company:
                <input
                  type="text"
                  name="company"
                  value={exp.company}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                  required
                />
              </label>
              <label>
                Position:
                <input
                  type="text"
                  name="position"
                  value={exp.position}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                  required
                />
              </label>
              <label>
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  value={exp.startDate}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                  required
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  name="endDate"
                  value={exp.endDate}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={exp.description}
                  onChange={(e) => handleWorkExperienceChange(index, e)}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                workExperience: [
                  ...prev.workExperience,
                  {
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  },
                ],
              }))
            }
          >
            Add Work Experience
          </button>
        </div>

        <button type="submit">Submit Application</button>
      </form>
      <style jsx>{`
        .form-section {
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .form-section h2 {
          margin-top: 0;
        }

        .sub-section {
          margin-bottom: 10px;
        }

        label {
          display: block;
          margin-bottom: 10px;
        }

        input[type="text"],
        input[type="date"],
        input[type="number"],
        select,
        textarea {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        button {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #fff;
          background-color: #0070f3;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #005bb5;
        }
      `}</style>
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

  const serializedTherapist: SerializedTherapist | null = therapist
    ? {
        ...therapist,
        dateOfBirth: therapist.dateOfBirth?.toISOString() || null,
      }
    : null;

  return {
    props: {
      therapist: serializedTherapist,
    },
  };
};
