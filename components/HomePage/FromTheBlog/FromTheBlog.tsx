import { BlogListing } from "@/components/BlogListing/BlogListing";
import { BlogItem } from "@/components/FilteredBlogsList/FilteredBlogsList";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Text,
  ArrowButton,
  Flex,
} from "@/lib/ui";
import Link from "next/link";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  heading: {
    id: "fromTheBlog.heading",
    defaultMessage: "What Kind Of Questions Can I Ask To Online Therapist?",
  },
  description: {
    id: "fromTheBlog.description",
    defaultMessage:
      "As long as you approach with respect and authenticity, there's no limit to the questions you can explore with our therapists at DepressionHUB. From career and relationships to mental health and personal growth, our therapists have addressed  a wide array of challenging inquiries, providing profound insights with ease.",
  },
  viewAll: {
    id: "fromTheBlog.viewAll",
    defaultMessage: "View All",
  },
});

type Props = {
  blogItems: BlogItem[];
};

export function FromTheBlog({ blogItems }: Props) {
  const { formatMessage } = useIntl();
  return (
    <Box
      bg="purple.500"
      pt={{
        base: "6rem",
        md: "8rem",
        lg: "150px",
      }}
      pb={{
        base: "8rem",
        md: "8rem",
        lg: "200px",
      }}
      borderTop="1.5px solid black"
    >
      <Container maxW="container.xl">
        <Text as="h2" textAlign="center" textStyle="h3" mb={8}>
          {formatMessage(messages.heading)}
        </Text>
        <Text
          as="h2"
          textAlign="center"
          textStyle="lg"
          maxW="40ch"
          mx="auto"
          mb={16}
        >
          {formatMessage(messages.description)}
        </Text>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          mx="auto"
          gap={5}
        >
          {blogItems.map((blogItem, i) => {
            const position = i % 3;
            return (
              <GridItem
                key={blogItem.href}
                display={{
                  base: position === 0 ? "flex" : "none",
                  md: position !== 2 ? "flex" : "none",
                  lg: "flex",
                }}
                alignItems="stretch"
              >
                <BlogListing
                  href={blogItem.href}
                  img={blogItem.image ?? ""}
                  date={blogItem.date}
                  title={blogItem.title}
                  headingLevel="h3"
                />
              </GridItem>
            );
          })}
        </Grid>
        <Flex justifyContent="center" mt={16}>
          <ArrowButton
            as={Link}
            href="/learn/blog"
            size="sm"
            colorScheme="white"
          >
            {formatMessage(messages.viewAll)}
          </ArrowButton>
        </Flex>
      </Container>
    </Box>
  );
}
