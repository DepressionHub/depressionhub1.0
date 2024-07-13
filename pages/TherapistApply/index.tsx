import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import prisma from "@/db/db";
import { Therapist } from "@prisma/client";
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
} from "@/lib/ui";

interface SerializedTherapist extends Omit<Therapist, "dateOfBirth"> {
  dateOfBirth: string | null;
}

interface TherapistApplyProps {
  therapist: SerializedTherapist | null;
}

export default function TherapistApply({ therapist }: TherapistApplyProps) {
  const { data: session, status } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEducationChange = (
    index: number,
    name: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [name]: value } : edu
      ),
    }));
  };

  const handleWorkExperienceChange = (
    index: number,
    name: string,
    value: string
  ) => {
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
        setIsSubmitted(true);
        router.push("/TherapistDashboard");
      } else {
        console.error("Failed to register therapist:", response.statusText);
      }
    } catch (error) {
      console.error("Error registering therapist:", error);
    }
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
    <Container maxWidth="800px" margin="0 auto">
      <Box padding="2rem">
        <Text as="h1" fontSize="2xl" fontWeight="bold" marginBottom="2rem">
          Apply as a Therapist
        </Text>
        <form onSubmit={handleSubmit}>
          <ShadowBox marginBottom="2rem">
            <Text as="h2" fontSize="xl" fontWeight="bold" marginBottom="1rem">
              Basic Information
            </Text>
            <Stack spacing="1rem">
              <Box>
                <Text
                  as="label"
                  htmlFor="type"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Type:
                </Text>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  required
                  className="border rounded p-2"
                >
                  <option value="">Select</option>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="STUDENT">Student</option>
                </select>
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="fullName"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Full Name
                </Text>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="dateOfBirth"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Date of Birth
                </Text>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="gender"
                  marginBottom="0.5rem"
                  display="block"
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
                  htmlFor="languages"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Languages Spoken
                </Text>
                <Input
                  id="languages"
                  name="languages"
                  value={formData.languages}
                  onChange={(e) => handleChange("languages", e.target.value)}
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="hoursAvailable"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Hours Available
                </Text>
                <Input
                  id="hoursAvailable"
                  name="hoursAvailable"
                  type="number"
                  onChange={(e) =>
                    handleChange("hoursAvailable", e.target.value)
                  }
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="experienceYears"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Experience (Years)
                </Text>
                <Input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) =>
                    handleChange("experienceYears", e.target.value)
                  }
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="specializations"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Specializations (comma separated)
                </Text>
                <Input
                  id="specializations"
                  name="specializations"
                  value={formData.specializations}
                  onChange={(e) =>
                    handleChange("specializations", e.target.value)
                  }
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="heardFrom"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Heard From
                </Text>
                <Input
                  id="heardFrom"
                  name="heardFrom"
                  value={formData.heardFrom}
                  onChange={(e) => handleChange("heardFrom", e.target.value)}
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="workingElsewhere"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Working Elsewhere:
                </Text>
                <select
                  id="workingElsewhere"
                  name="workingElsewhere"
                  value={formData.workingElsewhere}
                  onChange={(e) =>
                    handleChange("workingElsewhere", e.target.value)
                  }
                  required
                  className="border rounded p-2"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="whyJoining"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Why Joining?
                </Text>
                <Textarea
                  id="whyJoining"
                  name="whyJoining"
                  value={formData.whyJoining}
                  onChange={(e) => handleChange("whyJoining", e.target.value)}
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="linkedinProfile"
                  marginBottom="0.5rem"
                  display="block"
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
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="referredBy"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Referred By
                </Text>
                <Input
                  id="referredBy"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={(e) => handleChange("referredBy", e.target.value)}
                  required
                  className="border rounded p-2"
                />
              </Box>
              <Box>
                <Text
                  as="label"
                  htmlFor="longBio"
                  marginBottom="0.5rem"
                  display="block"
                >
                  Long Bio
                </Text>
                <Textarea
                  id="longBio"
                  name="longBio"
                  value={formData.longBio}
                  onChange={(e) => handleChange("longBio", e.target.value)}
                  required
                  className="border rounded p-2"
                />
              </Box>
            </Stack>
          </ShadowBox>
          <ShadowBox marginBottom="2rem">
            <Text as="h2" fontSize="xl" fontWeight="bold" marginBottom="1rem">
              Education
            </Text>
            {formData.education.map((education, index) => (
              <Stack spacing="1rem" key={index}>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`institution-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Institution
                  </Text>
                  <Input
                    id={`institution-${index}`}
                    name={`institution-${index}`}
                    value={education.institution}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`degree-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Degree
                  </Text>
                  <Input
                    id={`degree-${index}`}
                    name={`degree-${index}`}
                    value={education.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`fieldOfStudy-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Field of Study
                  </Text>
                  <Input
                    id={`fieldOfStudy-${index}`}
                    name={`fieldOfStudy-${index}`}
                    value={education.fieldOfStudy}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "fieldOfStudy",
                        e.target.value
                      )
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`startDate-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Start Date
                  </Text>
                  <Input
                    id={`startDate-${index}`}
                    name={`startDate-${index}`}
                    type="date"
                    value={education.startDate}
                    onChange={(e) =>
                      handleEducationChange(index, "startDate", e.target.value)
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`endDate-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    End Date
                  </Text>
                  <Input
                    id={`endDate-${index}`}
                    name={`endDate-${index}`}
                    type="date"
                    value={education.endDate}
                    onChange={(e) =>
                      handleEducationChange(index, "endDate", e.target.value)
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`grade-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Grade
                  </Text>
                  <Input
                    id={`grade-${index}`}
                    name={`grade-${index}`}
                    value={education.grade}
                    onChange={(e) =>
                      handleEducationChange(index, "grade", e.target.value)
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
              </Stack>
            ))}
          </ShadowBox>
          <ShadowBox marginBottom="2rem">
            <Text as="h2" fontSize="xl" fontWeight="bold" marginBottom="1rem">
              Work Experience
            </Text>
            {formData.workExperience.map((work, index) => (
              <Stack spacing="1rem" key={index}>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`company-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Company
                  </Text>
                  <Input
                    id={`company-${index}`}
                    name={`company-${index}`}
                    value={work.company}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "company",
                        e.target.value
                      )
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`position-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Position
                  </Text>
                  <Input
                    id={`position-${index}`}
                    name={`position-${index}`}
                    value={work.position}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "position",
                        e.target.value
                      )
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`startDate-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Start Date
                  </Text>
                  <Input
                    id={`startDate-${index}`}
                    name={`startDate-${index}`}
                    type="date"
                    value={work.startDate}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "startDate",
                        e.target.value
                      )
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`endDate-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    End Date
                  </Text>
                  <Input
                    id={`endDate-${index}`}
                    name={`endDate-${index}`}
                    type="date"
                    value={work.endDate}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "endDate",
                        e.target.value
                      )
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
                <Box>
                  <Text
                    as="label"
                    htmlFor={`description-${index}`}
                    marginBottom="0.5rem"
                    display="block"
                  >
                    Description
                  </Text>
                  <Textarea
                    id={`description-${index}`}
                    name={`description-${index}`}
                    value={work.description}
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    required
                    className="border rounded p-2"
                  />
                </Box>
              </Stack>
            ))}
          </ShadowBox>
          <ArrowButton type="submit" className="bg-blue-500 text-white">
            Submit
          </ArrowButton>
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
