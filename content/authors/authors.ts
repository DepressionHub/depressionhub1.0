export type Author = {
  name: string;
  title: string;
  url: string;
  image_url: string;
  description: string;
};

export const authors: Record<string, Author> = {
  elena: {
    name: "tanmay dhobale",
    title: "CEO & Founder @ DepressionHUB",
    url: "https://x.com/tanmayy4l",
    image_url: "/images/blog/tanmaypfp.png",
    description: `tanmay is the CEO & Founder of DepressionHUB `,
  },
  meg: {
    name: "Meg Blanchette",
    title: "Director of Marketing",
    url: "https://twitter.com/mlblanchette",
    image_url: "/images/blog/meg.png",
    description: `Meg is Director of Marketing at Iron Fish, previously at Manifold, Dataquest.io, and O'Reilly Media.`,
  },
  neil: {
    name: "Neil Doshi",
    title: "Content Marketing Manager at Iron Fish",
    url: "https://twitter.com/n_doshi_",
    image_url: "/images/blog/Neil.png",
    description: "Neil is a Content Marketing Manager at Iron Fish",
  },
  lawrence: {
    name: "Lawrence Wisne",
    title: "Engineering Manager",
    url: "https://twitter.com/lwisne",
    image_url: "/images/blog/lawrence.png",
    description:
      "As Engineering Manager at Iron Fish, Lawrence takes charge of guiding development of the Iron Fish protocol, shipping code, and connecting our technical team with the community.",
  },
  sanjey: {
    name: "Sanjey Sivanesan",
    title: "Head of Operations @ Iron Fish",
    url: "https://twitter.com/sanjeysivanesan",
    image_url: "/images/blog/sanjey.png",
    description:
      "Sanjey is the Head of Operations at Iron Fish, previously at Nuna and Google.",
  },
  craig: {
    name: "Craig Timm",
    title: "General Counsel @ Iron Fish",
    url: "https://twitter.com/craigmtimm",
    image_url: "/images/blog/craig.jpeg",
    description:
      "Craig is the General Counsel of Iron Fish, previously at Bank of America and Department of Justice.",
  },
  iflabs: {
    name: "tanmay",
    title: "Building a Safe, Encrypted Tomorrow",
    url: "https://twitter.com/tanmayy4l",
    image_url: "/images/blog/iflabs.jpeg",
    description: ``,
  },
} as const;
