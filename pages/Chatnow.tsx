import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Container,
  Hero,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  useColorModeValue,
} from "@/lib/ui";
import Head from "next/head";
import Image from "next/image";
import { NextPage } from "next";
import chatBackground from "@/public/assets/heroImages/chatBackground.svg"; // Adjust according to your actual path

interface Message {
  text: string;
  from: "user" | "system";
}

const ChatNow: NextPage = () => {
  const [interest, setInterest] = useState<string>("");
  const [inChat, setInChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);

  useEffect(() => {
    if (inChat && !ws) {
      const websocket = new WebSocket("ws://localhost:3001"); // Adjust to your server address
      const userId = uuidv4();
      websocket.onopen = () => {
        websocket.send(
          JSON.stringify({ type: "register", id: userId, interest })
        );
      };
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "match") {
          setMatchId(data.id);
        } else if (data.type === "message") {
          const receivedMessage: Message = { text: data.text, from: "system" };
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        } else if (data.type === "system") {
          const systemMessage: Message = { text: data.text, from: "system" };
          setMessages((prevMessages) => [...prevMessages, systemMessage]);
        }
      };
      websocket.onclose = () =>
        console.log("Disconnected from WebSocket server");
      setWs(websocket);
    }
  }, [inChat, ws, interest]);

  const handleStartChat = () => {
    setInChat(true);
    setMessages([
      {
        text: "Looking for someone to chat about " + interest + "...",
        from: "system",
      },
    ]);
  };

  const handleMessageSend = () => {
    if (message.trim() !== "" && matchId) {
      const userMessage: Message = { text: message, from: "user" };
      setMessages([...messages, userMessage]);
      ws?.send(JSON.stringify({ type: "message", to: matchId, text: message }));
      setMessage(""); // Clear input after send
    }
  };

  const handleEndChat = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "end" }));
      setMessages([{ text: "Looking for a new match...", from: "system" }]);
    }
  };

  const bgUser = useColorModeValue("blue.100", "blue.900");
  const bgSystem = useColorModeValue("gray.200", "gray.700");

  return (
    <>
      <Head>
        <title>ChatNow - Connect Instantly</title>
      </Head>
      <Hero
        bg="blue.500"
        heading="Welcome to ChatNow!"
        subheading="Instant connections."
        description="Start chatting about your interests."
      />
      <Container maxW="100%" centerContent px={0}>
        {!inChat ? (
          <Box
            w="100%"
            p={8}
            shadow="lg"
            borderRadius="lg"
            bg="white"
            mt={10}
            mb={10}
          >
            <Text mb={4} fontSize="lg">
              Enter Your Interest
            </Text>
            <Input
              placeholder="What are you interested in?"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              mb={6}
            />
            <Button colorScheme="blue" onClick={handleStartChat}>
              Start Chatting
            </Button>
          </Box>
        ) : (
          <VStack
            spacing={4}
            w="100%"
            p={8}
            shadow="lg"
            borderRadius="lg"
            bg="white"
            align="stretch"
            mt={10}
            mb={10}
            minH="80vh"
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                alignSelf={msg.from === "user" ? "flex-end" : "flex-start"}
                bg={msg.from === "user" ? bgUser : bgSystem}
                p={3}
                borderRadius="lg"
                maxW="70%"
              >
                <Text textAlign={msg.from === "user" ? "right" : "left"}>
                  {msg.text}
                </Text>
              </Box>
            ))}
            <HStack w="100%">
              <Input
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleMessageSend();
                  }
                }}
                size="sm"
                flexGrow={1}
                h="36px" // Reduced height of the input box
              />
              <Button onClick={handleMessageSend} colorScheme="blue">
                Send
              </Button>
              <Button onClick={handleEndChat} colorScheme="red">
                End Chat
              </Button>
            </HStack>
          </VStack>
        )}
      </Container>
    </>
  );
};

export default ChatNow;
