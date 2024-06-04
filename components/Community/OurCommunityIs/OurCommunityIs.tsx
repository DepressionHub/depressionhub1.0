import {
  Box,
  Container,
  Text,
  StickySideBySideView,
  ShadowBox,
} from "@/lib/ui";
import { ReactNode } from "react";
import { Book } from "./icons/Book";
import { Lightning } from "./icons/Lightning";
import { Chat } from "./icons/Chat";

const sections = [
  {
    heading: "A Place to Learn and Grow",
    description:
      "DepressionHub is a diverse community where individuals learn about mental health and self-help. Whether you're new or experienced, our forums, discussions, and Knowledge Base offer valuable resources and support.",
    image: <Book />,
  },
  {
    heading: "A Place to Connect and Share",
    description:
      "We believe in the power of connection. At DepressionHub, members share personal stories, advice, and mental health resources. Join private groups to engage with others who understand and support you.",
    image: <Lightning />,
  },
  {
    heading: "A Place to Engage and Support",
    description:
      "What are your mental health needs and interests? We want to know! Through private groups, forums, and social media, DepressionHub fosters open conversation and active participation to improve mental well-being for all.",
    image: <Chat />,
  },
];

export function OurCommunityIs() {
  return (
    <Box
      pl={{
        base: 0,
        md: 8,
        lg: 3,
        xl: 20,
      }}
    >
      <Container
        maxW="container.2xl"
        py={{
          base: "4rem",
          md: "8rem",
          lg: "9rem",
        }}
      >
        <StickySideBySideView>
          <StickySideBySideView.Item>
            <Text textStyle="h3">Our Community Is</Text>
          </StickySideBySideView.Item>
          <StickySideBySideView.Item>
            {sections.map((section, i, arr) => (
              <Section
                key={i}
                heading={section.heading}
                description={section.description}
                image={section.image}
                number={i + 1}
                totalItems={arr.length}
              />
            ))}
          </StickySideBySideView.Item>
        </StickySideBySideView>
      </Container>
    </Box>
  );
}

type SectionProps = {
  heading: string;
  description: string;
  image: ReactNode;
  number: number;
  totalItems: number;
};

function Section({
  heading,
  description,
  image,
  number,
  totalItems,
}: SectionProps) {
  return (
    <Box mb={8}>
      <Box
        maxW={{
          base: "100%",
          md: "450px",
        }}
      >
        <ShadowBox p={12} shadowColor="green.500">
          <Box
            borderRadius="full"
            bg="green.500"
            display="inline-block"
            px={3}
            py={1}
            mb={32}
          >
            <Text fontSize="xs" color="black">
              {number} / {totalItems}
            </Text>
          </Box>
          <Box mb={10}>{image}</Box>
          <Text textStyle="h4" mb={5}>
            {heading}
          </Text>
          <Text>{description}</Text>
        </ShadowBox>
      </Box>
    </Box>
  );
}
