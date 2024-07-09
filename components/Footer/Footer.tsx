import {
  Box,
  Flex,
  HStack,
  List,
  ListItem,
  Text,
  GridItem,
  chakra,
} from "@/lib/ui";
import Link from "next/link";
import Image from "next/image";
import { NewsletterSignUp } from "../NewsletterSignUp/NewsletterSignUp";
import { useNavLinks } from "../../shared/navLinks/useNavLinks";
import Circle from "./assets/circle.png";
import Logo from "./assets/logowhite.png";
import { BsTwitter, BsLinkedin, BsGithub, BsInstagram } from "react-icons/bs";
import { defineMessages, useIntl } from "react-intl";
import { CONSTANTS } from "../../shared/constants";
import { CategoryNavItem } from "@/lib/ui";

const messages = defineMessages({
  newsletter: {
    id: "footer.newsletter",
    defaultMessage:
      "Join our newsletter and stay up to date with depressionhub new  features.",
  },
  blogLink: {
    id: "footer.blogPrefix",
    defaultMessage:
      "Discover our impactful presence — <blogLink>read our blog.</blogLink>",
  },
});

function blogLink(value: unknown) {
  if (!Array.isArray(value)) return null;

  return (
    <chakra.span
      as={Link}
      href="/learn/blog"
      color="pink.500"
      _hover={{
        textDecoration: "underline",
      }}
    >
      {value}
    </chakra.span>
  );
}

export function Footer() {
  const links = useNavLinks();
  const { formatMessage } = useIntl();
  return (
    <Box
      bg="black"
      color="white"
      py={24}
      px={{
        base: 8,
        md: 16,
      }}
    >
      <Box mb={15}>
        <Image
          src={Logo}
          className="mb-15"
          alt="depressionhub"
          width={400}
          height={100}
        />
      </Box>
      <Text
        fontSize={{
          base: "24px",
          md: "36px",
        }}
        maxW="25ch"
        mb={8}
        fontFamily="FavoritExtendedIf"
      >
        {formatMessage(messages.newsletter)}
      </Text>
      <Box
        mb={24}
        display="flex"
        flexDirection="column"
        w="100%"
        justifyContent="flex-start"
      >
        <NewsletterSignUp />
        <Text fontSize="lg" mt={8}>
          {formatMessage(messages.blogLink, {
            blogLink,
          })}
        </Text>
      </Box>
      <Box
        display={{
          base: "grid",
          lg: "flex",
        }}
        mb={24}
        justifyContent="space-between"
        gridTemplateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: undefined,
        }}
      >
        {links
          .filter((link): link is CategoryNavItem => "items" in link)
          .map((category, i, arr) => {
            const categoryColor = `${category.color}.500`;
            return (
              <GridItem
                key={i}
                mb={{
                  base: 16,
                  lg: 0,
                }}
                mr={
                  arr.length === i + 1
                    ? {
                        base: 0,
                        lg: "3vw",
                      }
                    : undefined
                }
              >
                <Text color={categoryColor} fontStyle="sm" mb={3}>
                  {category.label}
                </Text>
                <List>
                  {category.items.map((item, i) => {
                    return (
                      <ListItem key={i} mb={3}>
                        <Text
                          as={Link}
                          href={item.href}
                          fontStyle="sm"
                          color="rgba(255, 255, 255, 0.7)"
                          _hover={{
                            color: categoryColor,
                            transition: "color 0.2s",
                            opacity: 1,
                          }}
                        >
                          {item.title}
                        </Text>
                      </ListItem>
                    );
                  })}
                </List>
              </GridItem>
            );
          })}
      </Box>
      <Flex
        alignItems={{
          base: "flex-start",
          lg: "center",
        }}
        w="100%"
        flexDirection={{
          base: "column",
          lg: "row",
        }}
      >
        <Flex
          alignItems="center"
          w="100%"
          mb={{
            base: 16,
            lg: 0,
          }}
        >
          <Image
            src={Circle}
            className=" mb-15"
            alt="depressionhub"
            width={40}
            height={10}
          />
          <Flex
            ml={4}
            alignItems={{
              base: "flex-start",
              md: "center",
            }}
            flexDirection={{
              base: "column",
              md: "row",
            }}
          >
            <Text
              as={Link}
              href="/privacy-policy"
              _hover={{
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </Text>
            <Text
              mx={2}
              display={{
                base: "none",
                md: "block",
              }}
            >
              |
            </Text>
            <Text>Copyright {new Date().getFullYear()} DepresionHUB.</Text>
          </Flex>
        </Flex>
        <HStack
          alignItems="center"
          flexGrow={1}
          justifyContent={{
            base: "space-between",
            lg: "flex-end",
          }}
          w={{
            base: "100%",
            lg: "auto",
          }}
          gap={{
            base: 4,
            md: 16,
          }}
        >
          <Link
            href={CONSTANTS.SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noreferrer"
          >
            <BsTwitter size={30} />
          </Link>
          <Link
            href={CONSTANTS.SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <BsLinkedin size={30} />
          </Link>
          <Link
            href={CONSTANTS.SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
          >
            <BsGithub size={30} />
          </Link>
          <Link
            href={CONSTANTS.SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <BsInstagram size={30} />
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}
