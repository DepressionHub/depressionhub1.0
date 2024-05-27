import { Container, Text, Heading, Grid, GridItem, Box, Flex } from "@/lib/ui";
import {
  AutoExpandingList,
  useAutoExpandingList,
} from "@/components/AutoExpandingList/AutoExpandingList";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import image1 from "./assets/image-01.svg";
import image2 from "./assets/image-02.svg";
import image3 from "./assets/image-03.svg";
import image4 from "./assets/image-04.svg";
import { CHIP_COLORS } from "../shared/chipColors";

const IMAGE_BY_INDEX = {
  0: <Image alt="" src={image1} />,
  1: <Image alt="" src={image2} />,
  2: <Image alt="" src={image3} />,
  3: <Image alt="" src={image4} />,
};

function ComingSoon() {
  return (
    <Box
      textTransform="uppercase"
      bg="#F3F3F4"
      color="#7F7F7F"
      borderRadius="full"
      fontSize="sm"
      px={3}
    >
      Coming Soon
    </Box>
  );
}

export function FeatureListA() {
  const expandingListProps = useAutoExpandingList();

  return (
    <Container w="100%" maxW="container.xl" py="150px">
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
        }}
        gap={10}
      >
        <GridItem>
          <Text textStyle="h3" mb={2}>
            The perfect app for everyday use
          </Text>
          <AutoExpandingList {...expandingListProps}>
            <AutoExpandingList.Item
              chipColor={CHIP_COLORS.GREEN}
              heading={<Heading fontSize="xl">Anonymous Chat</Heading>}
              body={
                <Box>
                  <Text>
                    Join hands with others at DepressionHUB who know what
                    you&apos;re going through right now. Together, we create a
                    circle of understanding and support.
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
              heading={<Heading fontSize="xl">100% Trusted Therapist</Heading>}
              body={
                <Box>
                  <Text>
                    Where therapist Meets Mental Wellness! Our team of 100+
                    experts is revolutionizing mental health with affordable
                    therapy starting at just 20 rupees.
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
              chipColor={CHIP_COLORS.BLUE}
              heading={<Heading fontSize="xl">Community</Heading>}
              body={
                <Box>
                  <Text>
                    DepressionHUB Community Where We Come Together, Share
                    Stories, and Grow Anonymously – Your Place for Support and
                    Hope.
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
            <AutoExpandingList.Item
              chipColor={CHIP_COLORS.ORANGE}
              heading={
                <Flex
                  flexDirection={{
                    base: "column",
                    md: "row",
                  }}
                  alignItems={{
                    base: "flex-start",
                    md: "center",
                  }}
                  gap={{
                    base: 4,
                    md: 2,
                  }}
                  justifyContent="space-between"
                  w="100%"
                >
                  <Heading fontSize="xl">StoryProfit</Heading>
                  <ComingSoon />
                </Flex>
              }
              body={
                <Box>
                  <Text>
                    Soon you&apos;ll be able to Share your personal stories of
                    overcoming dark phases and inspire others. Earn money when
                    your experiences provide valuable insights and support to
                    those in need.
                  </Text>
                  <Box
                    mt={8}
                    display={{
                      base: "block",
                      md: "none",
                    }}
                  >
                    <Image alt="" src={image4} />
                  </Box>
                </Box>
              }
            />
          </AutoExpandingList>
        </GridItem>
        <GridItem
          display={{
            base: "none",
            md: "flex",
          }}
          justifyContent="flex-end"
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
      </Grid>
    </Container>
  );
}
