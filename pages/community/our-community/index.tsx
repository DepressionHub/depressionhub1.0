import Image from "next/image";
import {
  Box,
  Container,
  Hero,
  HeroImageUtil,
  Text,
  LocalImage,
  Grid,
  GridItem,
  ShadowBox,
  ThickLink,
} from "@/lib/ui";
import earth from "../../../assets/heroImages/community-our/earth.svg";
import apple from "../../../assets/heroImages/community-our/apple.svg";
import octo from "../../../assets/heroImages/community-our/octo.svg";
import WorldMap from "../../../assets/community/map.svg";
import { OurCommunityIs } from "../../../components/Community/OurCommunityIs/OurCommunityIs";
import { Join } from "../../../components/Community/Join/Join";
import { Quotes } from "../../../components/Community/Quotes/Quotes";
import Head from "next/head";

const earthImage = earth as LocalImage;
const appleImage = apple as LocalImage;
const octoImage = octo as LocalImage;

const STATS = [
  {
    metric: "6,000+",
    label: "No. of People Healed",
  },
  {
    metric: "Every",
    label: "Country Represented",
  },
  {
    metric: "25,000+",
    label: "privet Community Members",
  },
  {
    metric: "42,000+",
    label: " free Community Members",
  },
  {
    metric: "13,000+",
    label: "No. of Sessions Given",
  },
];

export default function CommunityHighlights() {
  return (
    <>
      <Head>
        <title>Iron Fish Community | Get Involved in Our Community</title>
      </Head>
      <Box>
        <Hero
          bg="green.400"
          heading="Community"
          subheading="Let's Create a More Private , helpfull & safe World"
          description="One of our core principles is that we help people to be happy in life and to be more productive in their work and get over their depression. We are a community of people who are passionate about privacy-centric cryptocurrency. We are here to help you to get over your depression and to be happy in life. "
          images={
            <>
              <HeroImageUtil
                image={earthImage}
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
                image={appleImage}
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
                image={octoImage}
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
        <Container
          w="100%"
          maxW="container.2xl"
          px={{
            base: 6,
            lg: 10,
            xl: 16,
          }}
        >
          <Text
            textStyle="h5"
            my={{
              base: "50px",
              md: "100px",
              lg: "150px",
            }}
            textAlign="center"
            maxW="container.md"
            mx="auto"
          >
            The{" "}
            <ThickLink underlineColor="green.500">
              DepressionHub is a supportive
            </ThickLink>{" "}
            community dedicated to mental health and self-help. We provide a
            safe space for individuals who are feeling depressed and lonely,
            connecting them with others who understand their struggles. Through
            sharing problems and offering mutual support, our members help each
            other on their journeys to recovery. Join the best community on the
            internet today—absolutely free.
          </Text>
        </Container>
        <Box
          borderTop="1.5px solid black"
          borderBottom="1.5px solid black"
          bg="blue.500"
          py={{
            base: 24,
            md: "128px",
          }}
          overflow="hidden"
        >
          <Box textAlign="center" px={4}>
            <Text textStyle="h3" mb={8}>
              This is DepressionHUB
            </Text>
            <Text textStyle="lg" mb={16} maxW="35ch" mx="auto">
              Our therapy service and community are globally distributed on our
              decentralized network.
            </Text>
          </Box>
          <Box
            mx={{
              base: "-10vw",
              md: "-5vw",
              lg: 0,
            }}
          >
            <Image
              src={WorldMap}
              alt=""
              style={{
                margin: "0 auto",
              }}
            />
          </Box>
        </Box>
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
              base: "100%",
              lg: "repeat(2, 1fr)",
              xl: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {STATS.map((item, i) => {
              return (
                <GridItem key={i} display="flex">
                  <ShadowBox shadowColor="green.400">
                    <Box p={8}>
                      <Text textStyle="h3" marginBottom={1}>
                        {item.metric}
                      </Text>
                      <Text textStyle="h4">{item.label}</Text>
                    </Box>
                  </ShadowBox>
                </GridItem>
              );
            })}
          </Grid>
        </Container>
        <Quotes />
        <OurCommunityIs />
        <Join />
      </Box>
    </>
  );
}
