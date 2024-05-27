import { Container, Text, Heading, Grid, GridItem, Box } from "@/lib/ui";
import {
  AutoExpandingList,
  useAutoExpandingList,
} from "@/components/AutoExpandingList/AutoExpandingList";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CHIP_COLORS } from "../shared/chipColors";
import image1 from "./assets/image-01.svg";
import image2 from "./assets/image-02.svg";
import image3 from "./assets/image-03.svg";

const IMAGE_BY_INDEX = {
  0: <Image alt="" src={image1} />,
  1: <Image alt="" src={image2} />,
  2: <Image alt="" src={image3} />,
};

export function FeatureListB() {
  const expandingListProps = useAutoExpandingList();

  return (
    <Box color="white" bg="black" py="150px">
      <Container w="100%" maxW="container.xl">
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          }}
          gap={10}
        >
          <GridItem
            display={{
              base: "none",
              md: "flex",
            }}
            justifyContent="flex-start"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={expandingListProps.activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {expandingListProps.activeIndex in IMAGE_BY_INDEX &&
                  IMAGE_BY_INDEX[
                    expandingListProps.activeIndex as keyof typeof IMAGE_BY_INDEX
                  ]}
              </motion.div>
            </AnimatePresence>
          </GridItem>
          <GridItem>
            <Text textStyle="h3" mb={2}>
              Privacy Needs a Home
            </Text>
            <AutoExpandingList theme="dark" {...expandingListProps}>
              <AutoExpandingList.Item
                chipColor={CHIP_COLORS.GREEN}
                heading={
                  <Heading fontSize="xl">
                    What Kind Of Questions Can I Ask To Online Therapist?
                  </Heading>
                }
                body={
                  <Box>
                    <Text>
                      As long as you approach with respect and authenticity,
                      there&apos;s no limit to the questions you can explore
                      with our therapists at DepressionHUB. From career and
                      relationships to mental health and personal growth, our
                      therapists have addressed a wide array of challenging
                      inquiries, providing profound insights with ease.
                    </Text>
                    <Box
                      mt={8}
                      display={{
                        base: "block",
                        md: "none",
                      }}
                    >
                      <Image alt="" src={image1} />
                    </Box>
                  </Box>
                }
              />
              <AutoExpandingList.Item
                chipColor={CHIP_COLORS.PINK}
                heading={
                  <Heading fontSize="xl">Accessible, safe crypto</Heading>
                }
                body={
                  <Box>
                    <Text>
                      With the DepressionHUB web & app , anyone can use
                      DepressionHUB for fully encrypted transactions, regardless
                      of technical skill. Can create a session with Therapist or
                      chat with anyone with a few clicks.
                    </Text>
                    <Box
                      mt={8}
                      display={{
                        base: "block",
                        md: "none",
                      }}
                    >
                      <Image alt="" src={image2} />
                    </Box>
                  </Box>
                }
              />
              <AutoExpandingList.Item
                chipColor={CHIP_COLORS.ORANGE}
                heading={
                  <Heading fontSize="xl">
                    How much does DepressionHUB cost ?
                  </Heading>
                }
                body={
                  <Box>
                    <Text>
                      DepressionHUB fits your budget with ease. Try our
                      &apos;First Chat Free&apos; feature! Our expert therapists
                      charge between Rs 10 to Rs 250 per minute, ensuring
                      affordable, high-quality care for everyone
                    </Text>
                    <Box
                      mt={8}
                      display={{
                        base: "block",
                        md: "none",
                      }}
                    >
                      <Image alt="" src={image3} />
                    </Box>
                  </Box>
                }
              />
            </AutoExpandingList>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
