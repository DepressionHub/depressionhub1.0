import {
  Box,
  Button,
  Container,
  FancyArrowRight,
  useBreakpointValue,
  Text,
  HStack,
  Flex,
} from "@/lib/ui";
import { useCallback, useState } from "react";

const QUOTES = [
  {
    quote:
      "I can't thank DepressionHUB enough. The community here is incredibly supportive, and the therapists are top-notch. It's not just an app; it's a beacon of hope for those facing mental health challenges.",
    author: "Herman Jensen",
    title: "DpressionHUB Community Member",
  },
  {
    quote:
      "DepressionHUB has been a lifeline for me. The therapists are compassionate and understanding, and the anonymous chat feature allowed me to open up like never before. This platform truly cares about its users' mental well-being",
    author: "Anonymous",
    title: "DpressionHUB Community Member",
  },
  {
    quote: `DepressionHUB is more than an app; it's a lifesaver. The anonymous chats allowed me to reach out when I needed it most, and the therapists are true professionals. This platform is making a real difference.`,
    author: "Anonymous",
    title: "DpressionHUB Community Member",
  },
];

// A react component that takes an array of quotes and cycles through them, with forward and back buttons

export function Quotes() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const buttonSize = useBreakpointValue({ base: "48px", md: "67px" });

  const onNextClick = useCallback(() => {
    setQuoteIndex((index) => (index + 1) % QUOTES.length);
  }, []);

  const onBackClick = useCallback(() => {
    setQuoteIndex((index) => (index - 1 + QUOTES.length) % QUOTES.length);
  }, []);

  return (
    <Box bg="green.500" borderY="1.5px solid black">
      <Container
        maxW="container.2xl"
        py={{
          base: "4rem",
          md: "8rem",
          lg: "9rem",
        }}
      >
        <Box>
          <Text textStyle="h5" mb={8}>
            &ldquo;{QUOTES[quoteIndex].quote}&rdquo;
          </Text>
          <Text textStyle="lg">{QUOTES[quoteIndex].author}</Text>
          <Text textStyle="md">{QUOTES[quoteIndex].title}</Text>
        </Box>
        <Flex mt={16} justifyContent="center">
          <Button
            height={buttonSize}
            width={buttonSize}
            minWidth={buttonSize}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            p={0}
            onClick={onBackClick}
          >
            <Box position="absolute" transform="rotate(180deg)">
              <FancyArrowRight />
            </Box>
          </Button>
          <HStack
            mx={{
              base: 6,
              md: 10,
            }}
            gap={2}
          >
            {Array.from({ length: QUOTES.length }).map((_, index) => (
              <Indicator key={index} active={index === quoteIndex} />
            ))}
          </HStack>
          <Button
            height={buttonSize}
            width={buttonSize}
            minWidth={buttonSize}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            p={0}
            onClick={onNextClick}
          >
            <Box position="absolute">
              <FancyArrowRight />
            </Box>
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}

function Indicator({ active }: { active?: boolean }) {
  return (
    <Box
      border="1.5px solid black"
      borderRadius="full"
      height="24px"
      width="24px"
      bg={active ? "black" : "transparent"}
    />
  );
}
