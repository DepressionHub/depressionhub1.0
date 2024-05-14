import { FancyLinkSection } from "../../FancyLinkSection/FancyLinkSection";

export function Whitepaper() {
  return (
    <FancyLinkSection
      heading="EXPERIENCE HEALING AT NO COST YOUR FIRST THERAPY
SESSION IS 100% FREE!"
      description={`Choose us to support you, prevent suicide, embracing life, and knowing that you are never alone in your struggles."`}
      ctaText="Read our Whitepaper"
      ctaLink="/learn/whitepaper"
      imageUrl="/images/home/balloon-fish.svg"
      containerProps={{
        maxW: {
          base: "704px",
          lg: "1600px",
        },
        w: "100%",
        mb: {
          base: 24,
          md: 32,
          xl: "150px",
        },
        pl: {
          lg: "40px",
          xl: "64px",
          "2xl": "128px",
        },
      }}
    />
  );
}
