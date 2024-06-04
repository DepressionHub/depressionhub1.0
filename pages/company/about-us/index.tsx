import {
  Box,
  Container,
  Hero,
  HeroImageUtil,
  Text,
  LocalImage,
  ThickLink,
} from "@/lib/ui";
import flower from "../../../assets/heroImages/about-us/flower.svg";
import submarine from "../../../assets/heroImages/about-us/submarine.svg";
import judge from "../../../assets/heroImages/about-us/judge.svg";
import { FancyLinkSection } from "../../../components/FancyLinkSection/FancyLinkSection";
import { Backers } from "../../../components/Company/Backers/Backers";
import Head from "next/head";

const flowerImage = flower as LocalImage;
const submarineImage = submarine as LocalImage;
const judgeImage = judge as LocalImage;

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>DepressionHUB | About Us</title>
      </Head>
      <Box>
        <Hero
          bg="purple.500"
          heading="About Us"
          subheading="Secure Support for Everyone"
          description="We're creating a space and a movement for private, accessible mental health support. Interested in joining us?"
          images={
            <>
              <HeroImageUtil
                image={flowerImage}
                top={{
                  md: "-150px",
                  xl: "-30px",
                }}
                left={{
                  md: "-120px",
                  xl: "30px",
                  "2xl": `calc(50vw - 700px)`,
                }}
              />
              <HeroImageUtil
                image={submarineImage}
                bottom={{
                  md: "-80px",
                  xl: "15px",
                }}
                left={{
                  md: "-50px",
                  xl: "-20px",
                  "2xl": `calc(50vw - 850px)`,
                }}
              />
              <HeroImageUtil
                image={judgeImage}
                top={{
                  md: "20px",
                  xl: "85px",
                }}
                right={{
                  md: "-120px",
                  xl: "-20px",
                  "2xl": `calc(50vw - 700px)`,
                }}
              />
            </>
          }
        />
        <Container w="100%" maxW="container.md">
          <Text
            textStyle="h5"
            my={{
              base: "50px",
              md: "100px",
              lg: "150px",
            }}
            textAlign="center"
          >
            DepressionHub is building a decentralized{" "}
            <ThickLink underlineColor="pink.400">
              inclusive environment
            </ThickLink>{" "}
            for mental health support. Our Principles:
          </Text>
        </Container>
        <FancyLinkSection
          heading="Privacy is the Cornerstone of Mental Health Support"
          description={[
            "Privacy is a fundamental right, yet many people inadvertently compromise their own personal information every day.",
            "At DepressionHub, we empower our users to protect their privacy. Every interaction within our community is shielded through robust encryption and anonymization techniques. We adhere to the highest standards of confidentiality without compromise, ensuring a safe and secure environment for everyone to share and heal.",
          ]}
          ctaText="Learn more"
          ctaLink="/learn/whitepaper"
          imageUrl="/images/about-us/encryption-fish.svg"
          containerProps={{
            maxW: {
              base: "704px",
              lg: "1600px",
            },
            w: "100%",
            mb: {
              base: 24,
              md: 32,
              xl: "150px",
            },
            pl: {
              lg: "40px",
              xl: "64px",
              "2xl": "128px",
            },
          }}
        />
        <Box bg="black" py="150px">
          <FancyLinkSection
            reverse
            heading="Building Together, Healing Together"
            description={`As a supportive, member-focused network, DepressionHub thrives on the active engagement of its community to foster a nurturing environment and promote mental health awareness. Our community is the foundation of our platform, each member contributing to the collective healing and growth.`}
            ctaText="Join our movement"
            ctaLink="https://discord.com/invite/Jw66mWdR"
            imageUrl="/images/about-us/movement-fish.svg"
            ctaColor="green.400"
            containerProps={{
              maxW: {
                base: "704px",
                lg: "1600px",
              },
              w: "100%",
              pr: {
                lg: "40px",
                xl: "64px",
                "2xl": "128px",
              },
              sx: {
                color: "white",
                p: {
                  color: "#CCC",
                },
              },
            }}
          />
        </Box>
        <Box py="150px">
          <FancyLinkSection
            heading="Balanced Confidentiality"
            description={`To date, mental health platforms have struggled to provide privacy while adhering to regulatory standards. DepressionHub addresses this challenge by integrating robust encryption with sensible compliance measures. Our platform ensures that while member privacy is upheld, all operations remain within the bounds of legal and ethical guidelines.`}
            ctaText="Learn more"
            ctaLink="/learn/whitepaper"
            imageUrl="/images/about-us/common-sense-fish.svg"
            containerProps={{
              maxW: {
                base: "704px",
                lg: "1600px",
              },
              w: "100%",
              pl: {
                lg: "40px",
                xl: "64px",
                "2xl": "128px",
              },
            }}
          />
        </Box>
        {/* <Backers /> */}
      </Box>
    </>
  );
}
