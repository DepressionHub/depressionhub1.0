export const ECOSYSTEM_TYPES = [
  "Meditation",
  "Self-care",
  "Growth",
  "Anxiety",
  "Therapy",
  "Habits",
] as const;

type Ecosystem = (typeof ECOSYSTEM_TYPES)[number];

export const ECOSYSTEM: Array<{
  type: Ecosystem;
  name: string;
  link: string;
  image: string;
  highlight?: string;
}> = [
  {
    type: "Growth",
    name: "how to be a good person",
    link: "https://www.verywellmind.com/how-to-be-a-better-person-4167628",
    image: "/images/ecosystem/orescriptions.png",
    highlight: "/learn/blog/2023-08-22-orya",
  },

 
];
