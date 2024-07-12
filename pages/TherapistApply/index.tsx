import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "../../db/db";
import { Therapist, Specialization, TherapistType } from "@prisma/client";
import { useState, useEffect } from "react";
import {
  ArrowButton,
  Box,
  Container,
  Input,
  Radio,
  RadioGroup,
  ShadowBox,
  Stack,
  Text,
  Textarea,
  Checkbox,
} from "@/lib/ui";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
import { useRouter } from "next/router";

type TherapistWithRelations = Therapist & {
  specializations: Specialization[];
  certifications: {
    name: string;
    issuedAt: Date;
    expiresAt: Date | null;
    issuedBy: string;
  }[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate: Date | null;
    grade: number | null;
  }[];
  workExperience: {
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    description: string | null;
  }[];
};

interface TherapistApplyProps {
  therapist: TherapistWithRelations | null;
}

interface FormData {
  type: TherapistType;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  currentLocation: string;
  languages: string[];
  hoursAvailable: number;
  experienceYears: number;
  specializations: string[];
  heardFrom: string;
  workingElsewhere: boolean;
  whyJoining: string;
  linkedinProfile: string;
  referredBy: string;
  longBio: string;
  certifications: Array<{
    name: string;
    issuedAt: string;
    expiresAt: string;
    issuedBy: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: number | null;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

export default function TherapistApply({ therapist }: TherapistApplyProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/TherapistApply");
    }
  }, [status, router]);

  const [formData, setFormData] = useState<FormData>({
    type: TherapistType.PROFESSIONAL,
    fullName: "",
    dateOfBirth: "",
    gender: "",
    currentLocation: "",
    languages: [],
    hoursAvailable: 0,
    experienceYears: 0,
    specializations: [],
    heardFrom: "",
    workingElsewhere: false,
    whyJoining: "",
    linkedinProfile: "",
    referredBy: "",
    longBio: "",
    certifications: [{ name: "", issuedAt: "", expiresAt: "", issuedBy: "" }],
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: null,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayChange = (
    index: number,
    field: keyof FormData,
    subfield: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) =>
        i === index ? { ...item, [subfield]: value } : item
      ),
    }));
  };

  const addArrayItem = (field: keyof FormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), {}],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      console.error("No session found");
      return;
    }
    try {
      const response = await fetch("/api/therapists/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          certifications: formData.certifications.filter(
            (cert) => cert.name && cert.issuedAt
          ),
          education: formData.education.filter(
            (edu) => edu.institution && edu.startDate
          ),
          workExperience: formData.workExperience.filter(
            (exp) => exp.company && exp.startDate
          ),
        }),
      });
      if (response.ok) {
        router.push("/TherapistDashboard");
        window.location.href = "/TherapistDashboard";
      } else {
        const errorData = await response.json();
        console.error("Failed to register therapist:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (therapist) {
    // ... (existing code for displaying therapist info)
  }

  return (
    <div className="flex justify-center">
      <Box pl={{ base: 0, md: 8, lg: 3, xl: 20 }}>
        <Container
          maxW={"container.2xl"}
          py={{ base: "4rem", md: "8rem", lg: "9rem" }}
        >
          <Box mb={8}>
            <Box maxW={{ base: "100%", md: "450px" }}>
              <ShadowBox p={12}>
                <Box mb={15}>
                  <Image
                    src={Logo}
                    className="mb-15"
                    alt="depressionhub"
                    width={400}
                    height={100}
                  />
                  <form onSubmit={handleSubmit}>
                    <Text className="">Please enter your Full Name</Text>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Please choose your profession</Text>
                    <RadioGroup
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: value as TherapistType,
                        }))
                      }
                      value={formData.type}
                    >
                      <Stack direction="column">
                        <Radio value={TherapistType.PROFESSIONAL} size="sm">
                          Professional
                        </Radio>
                        <Radio value={TherapistType.STUDENT} size="sm">
                          Student
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    <Text className="mt-4">Date of Birth</Text>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Gender</Text>
                    <Input
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      placeholder="Gender"
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Current Location</Text>
                    <Input
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={handleChange}
                      placeholder="Current Location"
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Languages (comma-separated)</Text>
                    <Input
                      name="languages"
                      value={formData.languages.join(",")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          languages: e.target.value
                            .split(",")
                            .map((lang) => lang.trim()),
                        }))
                      }
                      placeholder="Languages"
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Hours Available</Text>
                    <Input
                      name="hoursAvailable"
                      type="number"
                      value={formData.hoursAvailable}
                      onChange={handleChange}
                      placeholder="Hours Available"
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Years of Experience</Text>
                    <Input
                      name="experienceYears"
                      type="number"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      placeholder="Years of Experience"
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">
                      Specializations (comma-separated)
                    </Text>
                    <Input
                      name="specializations"
                      value={formData.specializations.join(",")}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specializations: e.target.value
                            .split(",")
                            .map((spec) => spec.trim()),
                        }))
                      }
                      placeholder="Specializations"
                      required
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">How did you hear about us?</Text>
                    <Input
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={handleChange}
                      placeholder="How did you hear about us?"
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Are you working elsewhere?</Text>
                    <Checkbox
                      name="workingElsewhere"
                      isChecked={formData.workingElsewhere}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          workingElsewhere: e.target.checked,
                        }))
                      }
                    >
                      Yes, Im working elsewhere
                    </Checkbox>
                    <Text className="mt-4">Why are you joining?</Text>
                    <Textarea
                      name="whyJoining"
                      value={formData.whyJoining}
                      onChange={handleChange}
                      placeholder="Why are you joining?"
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">LinkedIn Profile</Text>
                    <Input
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleChange}
                      placeholder="LinkedIn Profile URL"
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Referred By</Text>
                    <Input
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={handleChange}
                      placeholder="Referred By"
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    <Text className="mt-4">Long Bio</Text>
                    <Textarea
                      name="longBio"
                      value={formData.longBio}
                      onChange={handleChange}
                      placeholder="Long Bio"
                      size="sm"
                      className="w-full"
                      variant="flushed"
                    />
                    {/* Certifications */}
                    <Text className="mt-4">Certifications</Text>
                    {formData.certifications.map((cert, index) => (
                      <Box key={index} mb={4}>
                        <Input
                          placeholder="Certification Name"
                          value={cert.name}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "certifications",
                              "name",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          type="date"
                          placeholder="Issued At"
                          value={cert.issuedAt}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "certifications",
                              "issuedAt",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          type="date"
                          placeholder="Expires At"
                          value={cert.expiresAt}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "certifications",
                              "expiresAt",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          placeholder="Issued By"
                          value={cert.issuedBy}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "certifications",
                              "issuedBy",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                      </Box>
                    ))}
                    <ArrowButton
                      onClick={() => addArrayItem("certifications")}
                      size="sm"
                    >
                      Add Certification
                    </ArrowButton>

                    {/* Education */}
                    <Text className="mt-4">Education</Text>
                    {formData.education.map((edu, index) => (
                      <Box key={index} mb={4}>
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "education",
                              "institution",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "education",
                              "degree",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          placeholder="Field of Study"
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "education",
                              "fieldOfStudy",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          type="date"
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "education",
                              "startDate",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          type="date"
                          placeholder="End Date"
                          value={edu.endDate}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "education",
                              "endDate",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Grade"
                          value={edu.grade || ""}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "education",
                              "grade",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                      </Box>
                    ))}
                    <ArrowButton
                      onClick={() => addArrayItem("education")}
                      size="sm"
                    >
                      Add Education
                    </ArrowButton>

                    {/* Work Experience */}
                    <Text className="mt-4">Work Experience</Text>
                    {formData.workExperience.map((exp, index) => (
                      <Box key={index} mb={4}>
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "workExperience",
                              "company",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "workExperience",
                              "position",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          type="date"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "workExperience",
                              "startDate",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Input
                          type="date"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "workExperience",
                              "endDate",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                        <Textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "workExperience",
                              "description",
                              e.target.value
                            )
                          }
                          size="sm"
                          className="w-full mb-2"
                          variant="flushed"
                        />
                      </Box>
                    ))}
                    <ArrowButton
                      onClick={() => addArrayItem("workExperience")}
                      size="sm"
                    >
                      Add Work Experience
                    </ArrowButton>
                    <div className="flex justify-center">
                      <ArrowButton
                        className="mt-10 flex justify-center"
                        size="sm"
                        type="submit"
                      >
                        Register as Therapist
                      </ArrowButton>
                    </div>
                  </form>
                </Box>
              </ShadowBox>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  TherapistApplyProps
> = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return {
      props: { therapist: null },
    };
  }

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session.user.id },
    include: {
      specializations: true,
      certifications: true,
      education: true,
      workExperience: true,
    },
  });

  return {
    props: {
      therapist: therapist ? JSON.parse(JSON.stringify(therapist)) : null,
    },
  };
};
