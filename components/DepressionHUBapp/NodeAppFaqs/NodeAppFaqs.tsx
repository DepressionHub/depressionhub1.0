import { FaqMoreInfo } from "@/components/FaqMoreInfo/FaqMoreInfo";
import { Container, FAQItem, Text, Box, Link } from "@/lib/ui";
import { CONSTANTS } from "@/shared/constants";

export function NodeAppFaqs() {
  return (
    <Box borderBottom="1.5px solid black">
      <Container w="100%" maxW="container.xl" pt="150px">
        <Text
          id="node-app-faq"
          as="h2"
          textStyle="h3"
          mb={12}
          textAlign="center"
        >
          DepressionHUB FAQ
        </Text>
        {/* <FAQItem title="Why opt in to telemetry?">
          Opting into telemetry allows us to continuously enhance your
          experience by collecting anonymous data. This data includes valuable
          metrics such as node performance, block information, and overall
          health indicators. By enabling telemetry, you contribute to the
          ongoing improvement of our services. You can easily control your
          participation in telemetry by enabling or disabling it at any time
          through the node settings page.
        </FAQItem> */}
        {/* <FAQItem title="Can I run the node app on my mobile device?">
          The node app requires a desktop, as it runs a full node (the most
          secure option).
        </FAQItem> */}
        <FAQItem title="Can I use Community features and read Blog and StoryProfit  in the Basic plan?">
          That functionality is like private Community not yet available in the
          Basic plan. You need to buy premium plan via the DepressionHUB app &
          website , but you can access Blog and StoryProfit and use the one
          Community group features. with Basic plan in the DepressionHUB.
        </FAQItem>
        <FAQItem title="What happens if my session with the therapist ends unexpectedly after I've paid?">
          If your session ends prematurely, simply save your session ID and
          request a refund through our app. We&apos;ll review your request and
          process your refund within 24 hours or ask help{" "}
          <Link
            isExternal
            href={CONSTANTS.SOCIAL_LINKS.discord}
            color="#3344dd"
            _visited={{ color: "#884488" }}
          >
            right here
          </Link>
          .
        </FAQItem>
        <FAQItem title="Where can I ask for help with the DepressionHUB app ?">
          If you have any questions or need additional help, you can talk to us
          on about the DepressionHUB on{" "}
          <Link
            isExternal
            href={CONSTANTS.SOCIAL_LINKS.discord}
            color="#3344dd"
            _visited={{ color: "#884488" }}
          >
            Discord
          </Link>{" "}
          in the #DepressionHUB-Help channel.
        </FAQItem>
        <FaqMoreInfo />
      </Container>
    </Box>
  );
}
