/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Stack, Button } from "@chakra-ui/react";
import { useSession, signOut, signIn } from "next-auth/react";
import { FancyArrowRight } from "@/lib/ui";

export default function Signin() {
  const { data: session } = useSession();
  const [showSignOut, setShowSignOut] = useState(false);

  const toggleSignOut = () => {
    setShowSignOut(!showSignOut);
  };

  const handleSignOut = () => {
    signOut();
    setShowSignOut(false);
  };

  return (
    <div>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        alignItems="center"
      >
        {session ? (
          <div style={{ position: "relative" }}>
            {session.user && (
              <img
                src={session.user.image ?? ""}
                alt="Profile Picture"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={toggleSignOut}
              />
            )}
            {showSignOut && (
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                colorScheme="red"
                style={{
                  position: "absolute",
                  top: "80px",
                  right: "0",
                  borderRadius: "999px",
                }}
              >
                Sign out <FancyArrowRight />
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={() => signIn()}
            variant="outline"
            size="sm"
            colorScheme="blue"
            rightIcon={<FancyArrowRight />}
          >
            Sign in
          </Button>
        )}
      </Stack>
    </div>
  );
}
