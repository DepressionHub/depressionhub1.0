import { FancyArrowRight } from "@/lib/ui";
import { Stack, Button, Box } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function signin() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session } = useSession();

  return (
    <div>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <Button onClick={() => (session ? signOut() : signIn())}>
          {session ? "Sign out" : "Sign in"}
          <FancyArrowRight />
        </Button>
      </Stack>
    </div>
  );
}
