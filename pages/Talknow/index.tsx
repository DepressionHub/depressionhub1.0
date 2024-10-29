import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaComments, FaInfoCircle } from "react-icons/fa";
import { Box, Container, Text, Grid, GridItem, ShadowBox } from "@/lib/ui";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { useRouter } from "next/router";
import axios from "axios";
import { getSession } from "next-auth/react";
import PartySocket from "partytown/socket";

type AxiosError = any;

interface Therapist {
  id: string;
  fullName: string;
  type: string;
  longBio: string;
  isVerified: boolean;
  imageUrl?: string;
  specializations: { name: string }[];
}

interface TherapySessionRequest {
  id: string;
}

const ChatNow = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getToken = async () => {
    const session = await getSession();
    return session?.accessToken;
  };

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
    return (
      <Box
        minH="100vh"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xl">Loading therapists...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minH="100vh"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="xl" color="red.500">
          {error}
        </Text>
      </Box>
    );
  }

  console.log(therapists);

  const handleStartSession = async (therapistId: string) => {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error("No session available");
      }

      // Create session request in database
      const response = await axios.post<{ id: string }>(
        "/api/therapy-session-requests",
        { therapistId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const requestId = response.data.id;

      // Connect to PartyKit room
      const socket = new PartySocket({
        host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
        room: `therapy-session-${requestId}`,
      });

      socket.addEventListener("open", () => {
        // Join session as user
        socket.send(
          JSON.stringify({
            type: "join_session",
            sessionId: requestId,
            role: "user",
            name: session.user?.name || "User",
          })
        );
      });

      // Redirect to waiting room
      router.push(`/Talknow/Session?sessionId=${requestId}&isTherapist=false`);
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to create session request. Please try again.");
    }
  };

  return (
    <Box minH="100vh" bg="gray.100" py={10} px={4}>
      <div style={{ textAlign: "center", marginBottom: "-2rem" }}>
        <Text
          fontSize="lg"
          display="flex"
          align="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <span> Connect with Our </span>{" "}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginInline: "0.4rem",
            }}
          >
            {" "}
            Verified <MdVerified />
          </span>{" "}
          <span> Therapists</span>
        </Text>
        <p style={{ fontSize: "1.25rem", color: "gray", marginTop: "1rem" }}>
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
              <ShadowBox
                shadowColor="green.400"
                p={6}
                borderRadius="md"
                display="flex"
                flexDirection="column"
              >
                <div
                  className="flex"
                  style={{ alignItems: "center", gap: "1rem" }}
                >
                  <Image
                    src={
                      therapist.imageUrl
                        ? therapist.imageUrl
                        : `https://picsum.photos/seed/${therapist.id}/200/200`
                    }
                    alt={therapist.fullName}
                    width={100}
                    height={100}
                    className="rounded-full mb-4"
                    style={{
                      border: "1px solid #000",
                      boxShadow: "2px 3px 0px black",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "/path/to/fallback/image.jpg";
                    }}
                  />
                  <Text
                    textStyle="h3"
                    marginBottom={1}
                    fontSize="lg"
                    display="flex"
                    flexDirection="column"
                    gap="0.5rem"
                  >
                    <Box display="flex" alignItems="center" gap="1rem">
                      {therapist.fullName}
                      <button
                        onClick={() =>
                          alert(`More info about ${therapist.fullName}`)
                        }
                        style={{
                          backgroundColor: "transparent",
                          color: "#000",
                          fontWeight: "light",
                          fontSize: "1.1rem",
                          borderRadius: "0.5rem",
                          transition: "background-color 0.3s",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FaInfoCircle />
                      </button>
                    </Box>

                    <Text
                      textStyle="h6"
                      className="badge badge-sm badge-secondary"
                    >
                      {therapist.type}
                    </Text>
                  </Text>
                </div>
                <Text textStyle="body2" marginTop={2}>
                  {therapist.specializations
                    .map((spec) => spec.name)
                    .join(", ")}
                </Text>
                <Text textStyle="body1" marginBlock={2}>
                  {therapist.longBio.substring(0, 120)}...
                </Text>
                <Box display="flex" mt="auto" gap="1rem">
                  <button
                    onClick={() =>
                      alert(`Initiating call with ${therapist.fullName}`)
                    }
                    style={{
                      height: "3rem",
                      width: "3rem",
                      backgroundColor: "#df77f3",
                      color: "black",
                      fontWeight: "bold",
                      padding: "0.5rem 1rem",
                      transition: "background-color 0.3s",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "50%",
                      boxShadow: "2px 3px 0px black",
                    }}
                  >
                    <FaPhoneAlt />
                  </button>
                  <button
                    onClick={() =>
                      alert(`Initiating chat with ${therapist.fullName}`)
                    }
                    style={{
                      height: "3rem",
                      width: "3rem",
                      backgroundColor: "#df77f3",
                      color: "black",
                      fontWeight: "bold",
                      padding: "0.5rem 1rem",
                      transition: "background-color 0.3s",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "50%",
                      boxShadow: "2px 3px 0px black",
                    }}
                  >
                    <FaComments />
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
                      display: "none",
                      alignItems: "center",
                    }}
                  >
                    <FaInfoCircle /> Info
                  </button>
                  <button
                    onClick={() => handleStartSession(therapist.id)}
                    style={{
                      backgroundColor: "orange",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      transition: "background-color 0.3s",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Start Session
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
