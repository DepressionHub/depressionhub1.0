import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaComments, FaInfoCircle } from "react-icons/fa";
import { Box, Container, Text, Grid, GridItem, ShadowBox } from "@/lib/ui";
import Image from "next/image";

interface Therapist {
  id: string;
  fullName: string;
  type: string;
  longBio: string;
  isVerified: boolean;
  imageUrl?: string;
  specializations: { name: string }[];
}

const ChatNow = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch("/api/therapists");
        if (!response.ok) {
          throw new Error("Failed to fetch therapists");
        }
        const data = await response.json();
        const verifiedTherapists = data.filter(
          (therapist: Therapist) => therapist.isVerified
        );
        setTherapists(verifiedTherapists);
      } catch (err) {
        setError("Failed to load therapists. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) {
    return <div>Loading therapists...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          Connect with Our Verified Therapists
        </h1>
        <p style={{ fontSize: "1.25rem", color: "gray" }}>
          Experience high-quality, tailored therapy sessions with our verified
          professionals.
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
                {therapist.imageUrl && (
                  <Image
                    src={therapist.imageUrl}
                    alt={therapist.fullName}
                    width={100}
                    height={100}
                    className="rounded-full mb-4"
                  />
                )}
                <Text textStyle="h3" marginBottom={1}>
                  {therapist.fullName}
                </Text>
                <Text textStyle="h4">{therapist.type}</Text>
                <Text textStyle="body2" marginTop={2}>
                  Specializations:{" "}
                  {therapist.specializations
                    .map((spec) => spec.name)
                    .join(", ")}
                </Text>
                <Text textStyle="body1" marginTop={2}>
                  {therapist.longBio.substring(0, 150)}...
                </Text>
                <Box display="flex" mt={4} justifyContent="space-between">
                  <button
                    onClick={() =>
                      alert(`Initiating call with ${therapist.fullName}`)
                    }
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
                  >
                    <FaPhoneAlt style={{ marginRight: "0.5rem" }} /> Call
                  </button>
                  <button
                    onClick={() =>
                      alert(`Initiating chat with ${therapist.fullName}`)
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
                  >
                    <FaComments style={{ marginRight: "0.5rem" }} /> Chat
                  </button>
                  <button
                    onClick={() =>
                      alert(`More info about ${therapist.fullName}`)
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
    </Box>
  );
};

export default ChatNow;
