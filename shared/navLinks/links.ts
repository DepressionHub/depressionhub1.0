import { messages } from "./messages";

export const links = [
  {
    label: messages.learn,
    color: "blue",
    items: [
      {
        title: messages.faqTitle,
        description: messages.faqDescription,
        href: "/TherapistApply",
        image: "/images/nav/learn-mag-glass.svg",
      },
      {
        title: messages.whitepaperTitle,
        description: messages.whitepaperDescription,
        href: "/learn/whitepaper",
        image: "/images/nav/learn-whitepaper.svg",
      },
    ],
  },
  {
    label: messages.use,
    color: "orange",
    items: [
      {
        title: messages.getStartedTitle,
        description: messages.getStartedDescription,
        href: "/use/get-started",
        image: "/images/nav/use-book-fish.svg",
      },
      {
        title: messages.nodeAppTitle,
        description: messages.nodeAppDescription,
        href: "/use/DepressionHUB-app",
        image: "/images/nav/use-key-fish.svg",
      },
      {
        title: messages.ecosystemTitle,
        description: messages.ecosystemDescription,
        href: "/use/ecosystem",
        image: "/images/nav/use-ecosystem.svg",
      },
    ],
  },
  {
    label: messages.community,
    color: "green",
    items: [
      // {
      //   title: messages.foundationTitle,
      //   description: messages.foundationDescription,
      //   href: "/community/foundation",
      //   image: "/images/nav/community-foundation.svg",
      // },
      {
        title: messages.communityTitle,
        description: messages.communityDescription,
        href: "/community/our-community",
        image: "/images/nav/community-earth.svg",
      },
    ],
  },
  {
    label: messages.company,
    color: "pink",
    items: [
      {
        title: messages.aboutUsTitle,
        description: messages.aboutUsDescription,
        href: "/company/about-us",
        image: "/images/nav/company-submarine.svg",
      },
      {
        title: messages.contactUsTitle,
        description: messages.contactUsDescription,
        href: "mailto:contact@ironfish.network",
        image: "/images/nav/company-jellyfish.svg",
      },
    ],
  },
  {
    label: messages.blogTitle,
    href: "/learn/blog",
  },
] as const;
