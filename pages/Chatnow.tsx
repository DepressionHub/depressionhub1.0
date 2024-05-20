import React, { useState } from "react";
import { FaPhoneAlt, FaComments, FaInfoCircle } from "react-icons/fa";
import { Box, Container, Text, Grid, GridItem, ShadowBox } from "@/lib/ui";
import Image from "next/image";

const therapists = [
  {
    id: 2,
    name: "Dr. Martin Seligman",
    speciality: "Counseling Psychologist",
    contact: "+1234567891",
    premium: false,
    bio: "Specializing in adolescent therapy...",
    imageUrl:
      "https://www.daisakuikeda.org/assets/images/audio-visual/podcasts/pod-martin-seligman.jpg",
  },
  {
    id: 3,
    name: "Dr. Daniel Kahneman",
    speciality: "Counseling Psychologist",
    contact: "+1234567892",
    premium: false,
    bio: "Focused on cognitive behavioral therapy...",
    imageUrl:
      "https://play-lh.googleusercontent.com/UaMM1YtGYrO7SFNFxy0ODsaIV0fpyiYLHdxmT6NqlpeXCaGtELG3uO8N-avqp8MSjw=w3840-h2160-rw",
  },
  {
    id: 4,
    name: "Dr. Steven Pinker",
    speciality: "Clinical Psychologist",
    contact: "+1234567890",
    premium: true,
    bio: "I have over 10 years of experience...",
    imageUrl:
      "https://humanists.international/wp-content/uploads/2020/03/Steven-Pinker-scaled.jpg",
  },
  {
    id: 5,
    name: "Dr. Dipti Yadav",
    speciality: "Counseling Psychologist",
    contact: "+1234567891",
    premium: false,
    bio: "Specializing in adolescent therapy...",
    imageUrl:
      "https://www.mentalwellnesscentre.com/wp-content/uploads/2021/12/Dr-Dipti-Yadav-1.jpeg",
  },
  {
    id: 6,
    name: "Dr. Jonathan Haidt",
    speciality: "Counseling Psychologist",
    contact: "+1234567892",
    premium: false,
    bio: "Focused on cognitive behavioral therapy...",
    imageUrl:
      "https://yt3.googleusercontent.com/3rkbva7zLAMoymEqQfvsCQ8UFROFgDQrr8MnacbzL5wxhX3kxkwHJizIZBqNRVt8al4V6LlmzA=s900-c-k-c0x00ffffff-no-rj",
  },
];

const ChatNow = () => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  return (
    <Box minH="100vh" bg="gray.100" py={10} px={4}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1
          style={{
            background: "linear-gradient(to right, #0057D9, #007BFF, #0057D9)",
            padding: "20px",
            borderRadius: "8px",
            color: "#FFF",
          }}
        >
          Connect with Our Esteemed Therapists
        </h1>
        <p style={{ fontSize: "1.25rem", color: "gray" }}>
          Experience high-quality, tailored therapy sessions.
        </p>
      </div>

      <Container
        w="100%"
        maxW="container.2xl"
        px={{
          base: 6,
          lg: 10,
          xl: 16,
        }}
        py={{
          base: 24,
          md: "128px",
        }}
      >
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {therapists.map((therapist) => (
            <GridItem key={therapist.id} display="flex">
              <ShadowBox shadowColor="green.400" p={6} borderRadius="md">
                <Image
                  src={therapist.imageUrl}
                  alt={therapist.name}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
                <Text textStyle="h3" marginBottom={1}>
                  {therapist.name}
                </Text>
                <Text textStyle="h4">{therapist.speciality}</Text>
                <Text textStyle="body1" marginTop={2}>
                  {therapist.bio}
                </Text>
                <Box display="flex" mt={4} justifyContent="space-between">
                  <a
                    href={`tel:${therapist.contact}`}
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      transition: "background-color 0.3s",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "darkblue")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "blue")
                    }
                  >
                    <FaPhoneAlt style={{ marginRight: "0.5rem" }} /> Call
                  </a>
                  <button
                    onClick={() =>
                      alert(`Initiating chat with ${therapist.name}`)
                    }
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      transition: "background-color 0.3s",
                      display: "flex",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "darkgreen")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "green")
                    }
                  >
                    <FaComments style={{ marginRight: "0.5rem" }} /> Chat
                  </button>
                  <button
                    onClick={() =>
                      alert(
                        `All the updates will be available soon about ${therapist.name}`
                      )
                    }
                    style={{
                      backgroundColor: "purple",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      transition: "background-color 0.3s",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaInfoCircle style={{ marginRight: "0.5rem" }} /> Info
                  </button>
                </Box>
              </ShadowBox>
            </GridItem>
          ))}
        </Grid>
      </Container>

      {selectedTherapist && (
        <div>
          {/* Render modal or detailed view of selected therapist here */}
        </div>
      )}
    </Box>
  );
};

export default ChatNow;
