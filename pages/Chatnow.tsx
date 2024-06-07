import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";

interface Message {
  text: string;
  from: "user" | "system";
}

const ChatNow = () => {
  const [interests, setInterests] = useState<string[]>([""]);
  const [inChat, setInChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inChat && !ws) {
      const websocket = new WebSocket("ws://localhost:8080/ws"); // Adjust to your Go server address

      const userId = uuidv4();
      websocket.onopen = () => {
        websocket.send(
          JSON.stringify({ type: "register", id: userId, interests })
        );
        setLoading(true);
      };
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "match") {
          setMatchId(data.id);
          setLoading(false);
          setMessages([
            { text: "You've been matched! Start chatting.", from: "system" },
          ]);
        } else if (data.type === "message") {
          const receivedMessage: Message = { text: data.text, from: "system" };
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }
      };
      websocket.onclose = () => {
        console.log("Disconnected from WebSocket server");
        setLoading(false);
        setInChat(false);
      };
      setWs(websocket);
    }
  }, [inChat, ws, interests]);

  const handleStartChat = () => {
    if (interests.some((interest) => interest.trim() !== "")) {
      setInChat(true);
      setLoading(true);
    }
  };

  const handleMessageSend = () => {
    if (message.trim() !== "" && matchId && ws) {
      const userMessage: Message = { text: message, from: "user" };
      setMessages([...messages, userMessage]);
      ws.send(JSON.stringify({ type: "message", to: matchId, text: message }));
      setMessage("");
    }
  };

  const handleEndChat = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "end" }));
      ws.close();
      setWs(null);
      setMatchId(null);
      setLoading(false);
      setInChat(false);
      setMessages([]);
    }
  };

  const addInterest = () => {
    if (interests.length < 10) {
      setInterests([...interests, ""]);
    }
  };

  const removeInterest = (index: number) => {
    if (interests.length > 1) {
      const updatedInterests = interests.filter((_, i) => i !== index);
      setInterests(updatedInterests);
    }
  };

  return (
    <Container centerContent>
      <Box width="100%" p={4} borderRadius="lg" bg="gray.100" mt={10} mb={10}>
        {!inChat ? (
          // UI to enter interests
          <VStack spacing={4}>
            {interests.map((interest, index) => (
              <HStack key={index} width="100%">
                <Input
                  value={interest}
                  onChange={(e) => {
                    let newInterests = [...interests];
                    newInterests[index] = e.target.value;
                    setInterests(newInterests);
                  }}
                  placeholder="Enter interest"
                />
                <IconButton
                  aria-label="Remove interest"
                  icon={<CloseIcon />}
                  onClick={() => removeInterest(index)}
                />
              </HStack>
            ))}
            {interests.length < 10 && (
              <Button leftIcon={<AddIcon />} onClick={addInterest} size="sm">
                Add Interest
              </Button>
            )}
            <Button onClick={handleStartChat}>Start Chatting</Button>
          </VStack>
        ) : loading ? (
          // Loading message
          <Text>Loading, searching for a match...</Text>
        ) : (
          // Chat interface
          <VStack spacing={4}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                bg={msg.from === "user" ? "blue.100" : "green.100"}
                p={3}
                borderRadius="md"
                alignSelf={msg.from === "user" ? "end" : "start"}
              >
                <Text>{msg.text}</Text>
              </Box>
            ))}
            <HStack width="100%">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                flex="1"
              />
              <Button onClick={handleMessageSend}>Send</Button>
              <Button onClick={handleEndChat} colorScheme="red">
                End Chat
              </Button>
            </HStack>
          </VStack>
        )}
      </Box>
    </Container>
  );
};

export default ChatNow;
