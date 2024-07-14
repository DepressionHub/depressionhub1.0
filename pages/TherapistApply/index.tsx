import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/db/db";
import { Therapist, TherapistType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  Select,
} from "@/lib/ui";

interface SerializedTherapist extends Omit<Therapist, "dateOfBirth"> {
  dateOfBirth: string | null;
}

interface TherapistApplyProps {
  therapist: SerializedTherapist | null;
}

const ProgressIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    "Personal Details",
    "Professional Details",
    "Education & Experience",
    "Additional Information",
  ];
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index + 1 <= currentStep
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </div>
          <span className="mt-2 text-sm text-center">{step}</span>
        </div>
      ))}
    </div>
  );
};

export default function TherapistApply({ therapist }: TherapistApplyProps) {
  const { data: session, status } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: TherapistType.PROFESSIONAL,
    fullName: "",
    dateOfBirth: "",
    gender: "",
    currentLocation: "",
    languages: "",
    hoursAvailable: "",
    experienceYears: "",
    specializations: "",
    heardFrom: "",
    workingElsewhere: false,
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

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    arrayName: string,
    index: number,
    name: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: (prev[arrayName as keyof typeof prev] as any[]).map(
        (item: any, i: number) =>
          i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName: string) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName as keyof typeof prev] || []), {}],
    }));
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: Array.isArray(prev[arrayName])
        ? prev[arrayName]?.filter((_: any, i: number) => i !== index)
        : [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/therapists/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        router.push("/TherapistDashboard");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Failed to register therapist. Please try again."
        );
      }
    } catch (error) {
      console.error("Error registering therapist:", error);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (status === "loading") {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Text>Please sign in to apply as a therapist.</Text>;
  }

  if (therapist) {
    return (
      <Text>You have already submitted an application as a therapist.</Text>
    );
  }

  return (
    <Container maxWidth="100%" margin="0 auto" className="px-4 sm:px-6 lg:px-8">
      <Box padding="2rem" className="max-w-4xl mx-auto">
        <Text
          as="h1"
          fontSize="3xl"
          fontWeight="bold"
          marginBottom="2rem"
          className="text-center"
        >
          Apply as a Therapist
        </Text>
        <ProgressIndicator currentStep={currentStep} />
        {isSubmitted && (
          <Box
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">
              Your application has been submitted successfully!
            </span>
          </Box>
        )}
        {error && (
          <Box
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">
              {"yo! u missed somthing check again"}
            </span>
          </Box>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            {currentStep === 1 && (
              <ShadowBox className="p-6">
                <Text
                  as="h2"
                  fontSize="2xl"
                  fontWeight="bold"
                  marginBottom="1.5rem"
                >
                  Personal Details
                </Text>
                <Stack spacing="1.5rem">
                  <Box>
                    <Text
                      as="label"
                      htmlFor="type"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Therapist Type
                    </Text>
                    <Select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={TherapistType.PROFESSIONAL}>
                        Professional
                      </option>
                      <option value={TherapistType.STUDENT}>Student</option>
                    </Select>
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="fullName"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Full Name
                    </Text>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="dateOfBirth"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Date of Birth
                    </Text>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleChange("dateOfBirth", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="gender"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Gender
                    </Text>
                    <RadioGroup
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={(e) => handleChange("gender", e)}
                      className="flex space-x-4"
                    >
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                      <Radio value="other">Other</Radio>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="currentLocation"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Current Location
                    </Text>
                    <Input
                      id="currentLocation"
                      name="currentLocation"
                      value={formData.currentLocation}
                      onChange={(e) =>
                        handleChange("currentLocation", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                </Stack>
              </ShadowBox>
            )}

            {currentStep === 2 && (
              <ShadowBox className="p-6">
                <Text
                  as="h2"
                  fontSize="2xl"
                  fontWeight="bold"
                  marginBottom="1.5rem"
                >
                  Professional Details
                </Text>
                <Stack spacing="1.5rem">
                  <Box>
                    <Text
                      as="label"
                      htmlFor="languages"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Languages Spoken (comma-separated)
                    </Text>
                    <Input
                      id="languages"
                      name="languages"
                      value={formData.languages}
                      onChange={(e) =>
                        handleChange("languages", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="hoursAvailable"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Hours Available per Week
                    </Text>
                    <Input
                      id="hoursAvailable"
                      name="hoursAvailable"
                      type="number"
                      value={formData.hoursAvailable}
                      onChange={(e) =>
                        handleChange("hoursAvailable", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="experienceYears"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Years of Experience
                    </Text>
                    <Input
                      id="experienceYears"
                      name="experienceYears"
                      type="number"
                      step="0.1"
                      value={formData.experienceYears}
                      onChange={(e) =>
                        handleChange("experienceYears", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="specializations"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Specializations (comma-separated)
                    </Text>
                    <Input
                      id="specializations"
                      name="specializations"
                      value={formData.specializations}
                      onChange={(e) =>
                        handleChange("specializations", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                </Stack>
              </ShadowBox>
            )}

            {currentStep === 3 && (
              <ShadowBox className="p-6">
                <Text
                  as="h2"
                  fontSize="2xl"
                  fontWeight="bold"
                  marginBottom="1.5rem"
                >
                  Education & Experience
                </Text>
                <Stack spacing="1.5rem">
                  <Box>
                    <Text
                      as="h3"
                      fontSize="xl"
                      fontWeight="bold"
                      marginBottom="1rem"
                    >
                      Education
                    </Text>
                    {formData.education.map((edu, index) => (
                      <Box key={index} className="mb-4 p-4 border rounded">
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "degree",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          placeholder="Field of Study"
                          value={edu.fieldOfStudy}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "fieldOfStudy",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          type="date"
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          type="date"
                          placeholder="End Date"
                          value={edu.endDate}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Grade"
                          value={edu.grade}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "grade",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("education", index)}
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </Box>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("education")}
                      className="text-blue-500"
                    >
                      Add Education
                    </button>
                  </Box>
                  <Box>
                    <Text
                      as="h3"
                      fontSize="xl"
                      fontWeight="bold"
                      marginBottom="1rem"
                    >
                      Work Experience
                    </Text>
                    {formData.workExperience.map((exp, index) => (
                      <Box key={index} className="mb-4 p-4 border rounded">
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "position",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          type="date"
                          placeholder="Start Date"
                          value={exp.startDate}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Input
                          type="date"
                          placeholder="End Date"
                          value={exp.endDate}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <Textarea
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="mb-2 w-full"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("workExperience", index)
                          }
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </Box>
                    ))}
                    <button
                      type="button"
                      onClick={() => addArrayItem("workExperience")}
                      className="text-blue-500"
                    >
                      Add Work Experience
                    </button>
                  </Box>
                </Stack>
              </ShadowBox>
            )}

            {currentStep === 4 && (
              <ShadowBox className="p-6">
                <Text
                  as="h2"
                  fontSize="2xl"
                  fontWeight="bold"
                  marginBottom="1.5rem"
                >
                  Additional Information
                </Text>
                <Stack spacing="1.5rem">
                  <Box>
                    <Text
                      as="label"
                      htmlFor="heardFrom"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      How did you hear about us?
                    </Text>
                    <Input
                      id="heardFrom"
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={(e) =>
                        handleChange("heardFrom", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="workingElsewhere"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Are you currently working elsewhere?
                    </Text>
                    <RadioGroup
                      id="workingElsewhere"
                      name="workingElsewhere"
                      value={formData.workingElsewhere.toString()}
                      onChange={(e) =>
                        handleChange("workingElsewhere", e === "true")
                      }
                      className="flex space-x-4"
                    >
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="whyJoining"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Why are you joining our platform?
                    </Text>
                    <Textarea
                      id="whyJoining"
                      name="whyJoining"
                      value={formData.whyJoining}
                      onChange={(e) =>
                        handleChange("whyJoining", e.target.value)
                      }
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="linkedinProfile"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      LinkedIn Profile
                    </Text>
                    <Input
                      id="linkedinProfile"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={(e) =>
                        handleChange("linkedinProfile", e.target.value)
                      }
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="referredBy"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Referred By
                    </Text>
                    <Input
                      id="referredBy"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={(e) =>
                        handleChange("referredBy", e.target.value)
                      }
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    <Text
                      as="label"
                      htmlFor="longBio"
                      marginBottom="0.5rem"
                      display="block"
                      className="font-medium"
                    >
                      Long Bio
                    </Text>
                    <Textarea
                      id="longBio"
                      name="longBio"
                      value={formData.longBio}
                      onChange={(e) => handleChange("longBio", e.target.value)}
                      required
                      className="border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500"
                    />
                  </Box>
                  <Box>
                    {/* <Text as="h3" fontSize="xl" fontWeight="bold" marginBottom="1rem">
                    Certifications
                  </Text> */}
                    {/* {formData.certifications.map((cert, index) => (
                    <Box key={index} className="mb-4 p-4 border rounded">
                      <Input
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={(e) => handleArrayChange("certifications", index, "name", e.target.value)}
                        className="mb-2 w-full"
                      /> */}
                    {/* <Input
                        type="date"
                        placeholder="Issued At"
                        value={cert.issuedAt}
                        onChange={(e) => handleArrayChange("certifications", index, "issuedAt", e.target.value)}
                        className="mb-2 w-full"
                      /> */}
                    {/* <Input
                        type="date"
                        placeholder="Expires At"
                        value={cert.expiresAt}
                        onChange={(e) => handleArrayChange("certifications", index, "expiresAt", e.target.value)}
                        className="mb-2 w-full"
                      /> */}
                    {/* <Input
                        placeholder="Issued By"
                        value={cert.issuedBy}
                        onChange={(e) => handleArrayChange("certifications", index, "issuedBy", e.target.value)}
                        className="mb-2 w-full"
                      /> */}
                    {/* <button type="button" onClick={() => removeArrayItem("certifications", index)} className="text-red-500">
                        Remove
                      </button> */}
                    {/* </Box>
                  ))}
                  <button type="button" onClick={() => addArrayItem("certifications")} className="text-blue-500">
                    Add Certification
                  </button> */}
                  </Box>
                </Stack>
              </ShadowBox>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <ArrowButton
                type="button"
                onClick={prevStep}
                className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Previous
              </ArrowButton>
            )}
            {currentStep < 4 ? (
              <ArrowButton
                type="button"
                onClick={nextStep}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Next
              </ArrowButton>
            ) : (
              <ArrowButton
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Submit
              </ArrowButton>
            )}
          </div>
        </form>
      </Box>
    </Container>
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
