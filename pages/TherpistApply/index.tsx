import {
  ArrowButton,
  Box,
  Container,
  Input,
  Radio,
  RadioGroup,
  ShadowBox,
  Stack,
  Text,
} from "@/lib/ui";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
import React, { useState } from "react";

export default function Index() {
  const [value, setValue] = useState("1");
  return (
    <div className="flex justify-center">
      <Box
        pl={{
          base: 0,
          md: 8,
          lg: 3,
          xl: 20,
        }}
      >
        <Container
          maxW={"container.2xl"}
          py={{
            base: "4rem",
            md: "8rem",
            lg: "9rem",
          }}
        >
          <Box mb={8}>
            <Box
              maxW={{
                base: "100%",
                md: "450px",
              }}
            >
              <ShadowBox p={12}>
                <Box mb={15}>
                  <Image
                    src={Logo}
                    className="mb-15"
                    alt="depressionhub"
                    width={400}
                    height={100}
                  />
                  <form action={""}>
                    <Text className="">Please enter your Name</Text>
                    <Input
                      name="Name"
                      type="string"
                      required
                      size={"sm"}
                      className="w-full"
                      variant="flushed"
                    />

                    <Text className="mt-4">Please choose your profession</Text>
                    <RadioGroup onChange={setValue} value={value}>
                      <Stack direction="column">
                        <Radio value="1" size={"sm"}>
                          Student
                        </Radio>
                        <Radio value="2" size={"sm"}>
                          Therapist
                        </Radio>
                      </Stack>
                    </RadioGroup>
                    <Text className="mt-4">Enter Captcha Code</Text>
                    <Input
                      name="captcha"
                      value={""}
                      type="string"
                      required
                      size={"sm"}
                      className="w-full"
                      variant="flushed"
                    />
                    <div className="pt-5">
                      <ShadowBox p={5}>
                        <Box mb={10}>
                          <Text
                            size={"lg"}
                            className="font-strong flex text-center"
                          >
                            Captch Code
                          </Text>
                        </Box>
                      </ShadowBox>
                    </div>
                    <div className="flex justify-center">
                      <ArrowButton
                        className="mt-10 flex justify-center"
                        size="sm"
                        type="submit"
                      >
                        Register
                      </ArrowButton>
                    </div>
                  </form>
                </Box>
              </ShadowBox>
            </Box>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
