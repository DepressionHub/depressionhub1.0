import { Box, Text, Container, ArrowButton, Flex } from "@/lib/ui";
import { defineMessages, useIntl } from "react-intl";
import { CONSTANTS } from "../../../shared/constants";

const messages = defineMessages({
  heading: {
    id: "community.heading",
    defaultMessage: "How much doesDepressionHUB cost ?",
  },
  description: {
    id: "community.description",
    defaultMessage:
      "Yo, peeps! Check out DepressionHUB – where therapy fits your wallet like a glove. Score your first chat on the house! Our therapists hook you up from just Rs 10 to Rs 250 per minute. And just 'cause it's cheap doesn't mean it's whack. Some start low 'cause they're newbies, others just want to spread the love. But trust, all our therapists are top-notch, vetted AF before they join the fam at DepressionHUB",
  },
});

export function Community() {
  const { formatMessage } = useIntl();
  return (
    <Box
      borderTop="1.5px solid black"
      bg="green.500"
      py={{
        base: 24,
        lg: 32,
        xl: "150px",
      }}
      px={{
        base: 4,
      }}
    >
      <Container
        maxW="68ch"
        mb={8}
        textAlign={{
          base: "left",
          md: "center",
        }}
      >
        <Text as="h2" textStyle="h3" mb={8}>
          {formatMessage(messages.heading)}
        </Text>
        <Text textStyle="lg">{formatMessage(messages.description)}</Text>
      </Container>
      <Flex
        alignItems={{
          base: "stretch",
          sm: "center",
        }}
        flexDirection={{
          base: "column",
          sm: "row",
        }}
        justifyContent="center"
        gap={{
          base: 6,
          sm: 8,
        }}
      >
        <ArrowButton
          as="a"
          href={CONSTANTS.SOCIAL_LINKS.discord}
          target="_blank"
          rel="noreferrer"
          size="sm"
          colorScheme="white"
        >
          Join Our Community
        </ArrowButton>
      </Flex>
    </Box>
  );
}
