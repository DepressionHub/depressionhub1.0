import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/db/db";
import { Therapist, TherapistType } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Select from "react-select";
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
  Select as CustomSelect,
} from "@/lib/ui";
import CustomInput from "@/lib/ui/src/components/FormElements/CustomInput";
import CustomTextArea from "@/lib/ui/src/components/FormElements/CustomTextArea";

interface SerializedTherapist extends Omit<Therapist, "dateOfBirth"> {
  dateOfBirth: string | null;
}

interface TherapistApplyProps {
  therapist: SerializedTherapist | null;
}

interface FormData {
  type: TherapistType;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  currentLocation: string;
  languages: { value: string; label: string }[];
  hoursAvailable: string;
  experienceYears: string;
  specializations: { value: string; label: string }[];
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
    grade: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
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
  const [formData, setFormData] = useState<FormData>({
    type: TherapistType.PROFESSIONAL,
    fullName: "",
    dateOfBirth: "",
    gender: "",
    currentLocation: "",
    languages: [],
    hoursAvailable: "",
    experienceYears: "",
    specializations: [],
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

  console.log(formData);

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "mandarin", label: "Mandarin" },
    { value: "hindi", label: "Hindi" },
    { value: "arabic", label: "Arabic" },
  ];

  const specializationOptions = [
    { value: "anxiety", label: "Anxiety" },
    { value: "depression", label: "Depression" },
    { value: "relationship", label: "Relationship Issues" },
    { value: "stress", label: "Stress Management" },
    { value: "trauma", label: "Trauma" },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=4024519736054edd922fe747a4c115c1`
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
                const location = `${data.results[0].components.suburb}, ${data.results[0].components.state_district}, ${data.results[0].components.state}, ${data.results[0].components.country}`;
                setFormData((prev) => ({
                  ...prev,
                  currentLocation: location,
                }));
              })
              .catch((error) => {
                console.error("Error retrieving location:", error);
              });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  const handleChange = (name: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = <T extends keyof FormData>(
    arrayName: T,
    index: number,
    name: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: (prev[arrayName] as any[]).map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      ),
    }));
  };

  const addArrayItem = <T extends keyof FormData>(arrayName: T) => {
    setFormData((prev) => {
      const array = prev[arrayName] as any[];

      const lastItem = array[array.length - 1];
      const isLastItemComplete = Object.values(lastItem).every(
        (value) => value !== "" && value !== undefined && value !== null
      );

      if (!isLastItemComplete) {
        return prev;
      }

      return {
        ...prev,
        [arrayName]: [...array, {}],
      };
    });
  };

  const removeArrayItem = <T extends keyof FormData>(
    arrayName: T,
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: (prev[arrayName] as any[]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const isEmpty = (value: any) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(isEmpty);
      }
      return !value;
    };
    const hasEmptyField = Object.values(formData).some(isEmpty);

    if (hasEmptyField) {
      setError("Please fill in all required fields.");
      return;
    }

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
            <span className="block sm:inline">{error}</span>
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
                    <CustomSelect
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={(e) =>
                        handleChange("type", e.target.value as TherapistType)
                      }
                      className="border rounded-md p-2 w-full"
                      aria-required="true"
                      required
                    >
                      <option value={TherapistType.PROFESSIONAL}>
                        Professional
                      </option>
                      <option value={TherapistType.STUDENT}>Student</option>
                    </CustomSelect>
                  </Box>
                  <Box>
                    <Box>
                      <CustomInput
                        id="fullName"
                        name="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        placeholder="E.g. : John Doe"
                        aria-required="true"
                        required
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Box>
                      <CustomInput
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        label="Date Of Birth"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleChange("dateOfBirth", e.target.value)
                        }
                        placeholder="E.g. : 22-12-1987"
                        aria-required="true"
                        required
                      />
                    </Box>
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
                      onChange={(value) => handleChange("gender", value)}
                      className="flex space-x-4"
                    >
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                      <Radio value="other">Other</Radio>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <CustomInput
                      type="text"
                      id="currentLocation"
                      name="currentLocation"
                      label="Current Location"
                      value={formData.currentLocation}
                      onChange={(e) =>
                        handleChange("currentLocation", e.target.value)
                      }
                      placeholder="E.g. : Pune, Maharashtra"
                      aria-required="true"
                      required
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
                      Languages Spoken
                    </Text>
                    <Select
                      id="languages"
                      name="languages"
                      isMulti
                      options={languageOptions}
                      placeholder="E.g. English, Hindi"
                      value={formData.languages.map((lang) => ({
                        value: lang,
                        label: lang,
                      }))}
                      onChange={(selectedOptions) => {
                        const selectedLanguages = selectedOptions.map(
                          (option) => option.value
                        );
                        handleChange("languages", selectedLanguages);
                      }}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      aria-required="true"
                      required
                    />
                  </Box>
                  <Box>
                    <CustomInput
                      type="number"
                      id="hoursAvailable"
                      name="hoursAvailable"
                      label="Hours Available per Week"
                      value={formData.hoursAvailable}
                      onChange={(e) =>
                        handleChange("hoursAvailable", e.target.value)
                      }
                      placeholder="E.g. : 7 hours"
                      aria-required="true"
                      required
                    />
                  </Box>
                  <Box>
                    <CustomInput
                      type="number"
                      id="experienceYears"
                      name="experienceYears"
                      label="Years of Experience"
                      value={formData.experienceYears}
                      step="0.1"
                      onChange={(e) =>
                        handleChange("experienceYears", e.target.value)
                      }
                      placeholder="E.g. : 2.5 Years"
                      aria-required="true"
                      required
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
                      Specializations
                    </Text>
                    <Select
                      id="specializations"
                      name="specializations"
                      isMulti
                      options={specializationOptions}
                      value={formData.specializations}
                      onChange={(selectedOptions) => {
                        handleChange("specializations", selectedOptions || []);
                      }}
                      placeholder="E.g. Relationship Issues"
                      className="basic-multi-select"
                      classNamePrefix="select"
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
                      <Box
                        key={index}
                        className="mb-4"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.8rem",
                        }}
                      >
                        <CustomInput
                          type="text"
                          id={`education-institution-${index}`}
                          name="institution"
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          placeholder="For e.g. University Name"
                          aria-required="true"
                          required
                        />
                        <Box style={{ display: "flex", gap: "1rem" }}>
                          <CustomInput
                            type="text"
                            id={`education-degree-${index}`}
                            name="degree"
                            label="Degree"
                            value={edu.degree}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            placeholder="For e.g. Bachelor's"
                            aria-required="true"
                            required
                          />
                          <CustomInput
                            type="text"
                            id={`education-fieldOfStudy-${index}`}
                            name="fieldOfStudy"
                            label="Field of Study"
                            value={edu.fieldOfStudy}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "fieldOfStudy",
                                e.target.value
                              )
                            }
                            placeholder="For e.g. Computer Science"
                            aria-required="true"
                            required
                          />
                        </Box>
                        <Box style={{ display: "flex", gap: "1rem" }}>
                          <CustomInput
                            type="date"
                            id={`education-startDate-${index}`}
                            name="startDate"
                            label="Start Date"
                            value={edu.startDate}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            placeholder="For e.g. YYYY-MM-DD"
                            aria-required="true"
                            required
                          />
                          <CustomInput
                            type="date"
                            id={`education-endDate-${index}`}
                            name="endDate"
                            label="End Date"
                            value={edu.endDate}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                            placeholder="For e.g. YYYY-MM-DD"
                            aria-required="true"
                            required
                          />
                        </Box>
                        <CustomInput
                          type="text"
                          id={`education-grade-${index}`}
                          name="grade"
                          label="Grade"
                          value={edu.grade}
                          onChange={(e) =>
                            handleArrayChange(
                              "education",
                              index,
                              "grade",
                              e.target.value
                            )
                          }
                          placeholder="For e.g. A"
                          aria-required="true"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("education", index)}
                          className="text-red-500 mt-2"
                        >
                          Remove Education
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
                      <Box
                        key={index}
                        className="mb-4"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.8rem",
                        }}
                      >
                        <CustomInput
                          type="text"
                          id={`workExperience-company-${index}`}
                          name="company"
                          label="Company"
                          value={exp.company}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          placeholder="For e.g. ABC Corp"
                          aria-required="true"
                          required
                        />
                        <CustomInput
                          type="text"
                          id={`workExperience-position-${index}`}
                          name="position"
                          label="Position"
                          value={exp.position}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "position",
                              e.target.value
                            )
                          }
                          placeholder="For e.g. Software Engineer"
                          aria-required="true"
                          required
                        />
                        <Box style={{ display: "flex", gap: "1rem" }}>
                          <CustomInput
                            type="date"
                            id={`workExperience-startDate-${index}`}
                            name="startDate"
                            label="Start Date"
                            value={exp.startDate}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleArrayChange(
                                "workExperience",
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                            placeholder="For e.g. YYYY-MM-DD"
                            aria-required="true"
                            required
                          />
                          <CustomInput
                            type="date"
                            id={`workExperience-endDate-${index}`}
                            name="endDate"
                            label="End Date"
                            value={exp.endDate}
                            style={{ width: "100%" }}
                            onChange={(e) =>
                              handleArrayChange(
                                "workExperience",
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                            placeholder="For e.g. YYYY-MM-DD"
                            aria-required="true"
                            required
                          />
                        </Box>
                        <CustomTextArea
                          type="text"
                          id={`workExperience-description-${index}`}
                          name="description"
                          label="Description"
                          value={exp.description}
                          onChange={(e) =>
                            handleArrayChange(
                              "workExperience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="For e.g. Managed a team of 5"
                          aria-required="true"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem("workExperience", index)
                          }
                          className="text-red-500 mt-2"
                        >
                          Remove Work Experience
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
                    <CustomInput
                      label="How did you hear about us?"
                      id="heardFrom"
                      name="heardFrom"
                      value={formData.heardFrom}
                      onChange={(e) =>
                        handleChange("heardFrom", e.target.value)
                      }
                      placeholder="For e.g., Referral, Online Search, Colleague"
                      aria-required="true"
                      required
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
                      onChange={(value) =>
                        handleChange("workingElsewhere", value === "true")
                      }
                      className="flex space-x-4"
                    >
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </RadioGroup>
                  </Box>
                  <Box>
                    <CustomTextArea
                      label="Why are you joining our platform?"
                      id="whyJoining"
                      name="whyJoining"
                      value={formData.whyJoining}
                      onChange={(e) =>
                        handleChange("whyJoining", e.target.value)
                      }
                      placeholder="For e.g., To expand my practice, To reach more clients, etc."
                      aria-required="true"
                      required
                    />
                  </Box>
                  <Box>
                    <CustomInput
                      label="LinkedIn Profile"
                      id="linkedinProfile"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={(e) =>
                        handleChange("linkedinProfile", e.target.value)
                      }
                      placeholder="For e.g., https://www.linkedin.com/in/your-profile"
                      aria-required="true"
                      required
                    />
                  </Box>
                  <Box>
                    <CustomInput
                      label="Referred By"
                      id="referredBy"
                      name="referredBy"
                      value={formData.referredBy}
                      onChange={(e) =>
                        handleChange("referredBy", e.target.value)
                      }
                      placeholder="For e.g., Dr. Jane Doe, Colleague, Online Forum"
                      aria-required="true"
                      required
                    />
                  </Box>
                  <Box>
                    <CustomTextArea
                      label="Long Bio"
                      id="longBio"
                      name="longBio"
                      value={formData.longBio}
                      onChange={(e) => handleChange("longBio", e.target.value)}
                      placeholder="For e.g., I am a licensed therapist with 10 years of experience in cognitive behavioral therapy..."
                      aria-required="true"
                      required
                    />
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
                arrowStyle="left"
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
