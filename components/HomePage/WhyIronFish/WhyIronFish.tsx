import {
  Box,
  Container,
  Text,
  StickySideBySideView,
  ShadowBox,
} from "@/lib/ui";
import { ReactNode } from "react";
import { Decentralized } from "./icons/Decentralized";
import { Handshake } from "./icons/Handdhake";
import { Lock } from "./icons/Lock";

const sections = [
  {
    heading: "Privacy Anonymous Chat ",
    description:
      "Join hands with others at DepressionHUB who know what you're going through right now. Together, we create a circle of understanding and support.",
    image: <Lock />,
  },
  {
    heading: "100% Trusted Therapist truly decentralized",
    description:
      "Where therapist Meets Mental Wellness! Our team of 100+ experts is revolutionizing mental health with affordable therapy starting at just 20$ .",
    image: <Decentralized />,
  },
  {
    heading: "A Community",
    description:
      "DepressionHUB Community Where We Come Together, Share Stories, and Grow Anonymously – Your Place for Support and Hope.",
    image: <Handshake />,
  },
];

export function WhyIronFish() {
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
            <Text
              textStyle="h3"
              style={{
                color: "#2C3E50",
                lineHeight: "1.5",
                textAlign: "center",
              }}
            >
              Why Use Dpressionhub?
              <br className="text-35px" />
              <span style={{ fontSize: "28px", color: "#2980B9" }}>
                &quot;You focus on healing, we&apos;ll take care of the
                hope.&quot;
              </span>
              <br />
              <span style={{ fontSize: "20px", color: "#34495E" }}>
                Choose us to support you, prevent suicide, embrace life, and
                know that you are never alone in your struggles.
              </span>
            </Text>
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
        <ShadowBox p={12}>
          <Box
            borderRadius="full"
            bg="purple.500"
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
