import { Box, Flex, Button, Text, Avatar, VStack } from "@chakra-ui/react";

export default function UserDashboard() {
  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Flex
        direction="column"
        align="center"
        bg="white"
        p={5}
        boxShadow="md"
        w="20%"
        minH="100vh"
      >
        <Avatar size="xl" mb={4} />
        <Text fontSize="xl" fontWeight="bold">
          Tanmay Dhobale
        </Text>
        <Text mb={6}>+91 9617947604</Text>
      </Flex>

      {/* Main Content */}
      <Box flex="1" p={5}>
        <Box bg="white" p={6} rounded="md" boxShadow="md">
          <Text fontSize="2xl" mb={4}>
            Welcome back, User
          </Text>

          <Box mb={6}>
            <Text fontSize="lg" mb={2}>
              Feedback
            </Text>
            <Box p={4} shadow="md" borderWidth="1px" rounded="md" bg="gray.50">
              <Text>
                <strong>Alice:</strong> Very helpful and understanding.
              </Text>
              <Text mt={2}>
                <strong>Bob:</strong> Helped me through a tough time, highly
                recommend.
              </Text>
            </Box>
          </Box>

          <Box>
            <Text fontSize="lg" mb={2}>
              Upcoming Sessions
            </Text>
            <Box
              p={4}
              shadow="md"
              borderWidth="1px"
              rounded="md"
              bg="gray.50"
              mb={4}
            >
              <Flex justify="space-between">
                <Box>
                  <Text>
                    <strong>Date:</strong> 2024-03-01 at 10:00 AM
                  </Text>
                  <Text>
                    <strong>Client:</strong> Alice Johnson
                  </Text>
                  <Text>
                    <strong>Session Type:</strong> Chat
                  </Text>
                </Box>
                <VStack spacing={2}>
                  <Button colorScheme="yellow" variant="outline" size="sm">
                    pending
                  </Button>
                </VStack>
              </Flex>
            </Box>
            <Box p={4} shadow="md" borderWidth="1px" rounded="md" bg="gray.50">
              <Flex justify="space-between">
                <Box>
                  <Text>
                    <strong>Date:</strong> 2024-03-02 at 02:00 PM
                  </Text>
                  <Text>
                    <strong>Client:</strong> Bob Smith
                  </Text>
                  <Text>
                    <strong>Session Type:</strong> Call
                  </Text>
                </Box>
                <VStack spacing={2}>
                  <Button colorScheme="yellow" variant="outline" size="sm">
                    Pending
                  </Button>
                </VStack>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
