import {
  Box,
  Grid,
  GridItem,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const dashboard = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Earnings",
        data: [450, 650, 800, 1200, 1000, 1400],
        fill: false,
        borderColor: "#4A90E2",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div>
      <Box className="p-6 bg-gray-50 min-h-screen">
        <VStack spacing={8} align="stretch">
          <HStack
            justify="space-between"
            className="w-full bg-beige-200 p-6 rounded-md"
          >
            <Box>
              <Text fontSize="3xl" fontWeight="bold">
                Welcome back, Therapist
              </Text>
              <Badge colorScheme="green">Online</Badge>
            </Box>
            <Button colorScheme="blue">Withdraw Money</Button>
            <Button colorScheme="red">Logout</Button>
          </HStack>

          <HStack spacing={8} align="stretch">
            <Box className="w-1/2 bg-white shadow-md rounded-md p-6 flex flex-col items-center">
              <Avatar size="2xl" mb={4} />
              <Text fontSize="xl">Therapist</Text>
              <Text>Licensed Therapist</Text>
              <Button variant="link" colorScheme="blue" mt={2}>
                Edit Profile
              </Button>
            </Box>
            <Box className="w-1/2 bg-white shadow-md rounded-md p-6">
              <Text fontSize="2xl" mb={4}>
                Earnings Overview
              </Text>
              <Line data={data} options={options} />
            </Box>
          </HStack>

          <Box className="bg-white shadow-md rounded-md p-6">
            <Text fontSize="2xl" mb={4}>
              Feedback
            </Text>
            <Box className="mb-4">
              <Text fontWeight="bold">Alice</Text>
              <Text>Very helpful and understanding.</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Bob</Text>
              <Text>Helped me through a tough time, highly recommend.</Text>
            </Box>
          </Box>

          <Box className="bg-white shadow-md rounded-md p-6">
            <Text fontSize="2xl" mb={4}>
              Upcoming Sessions
            </Text>
            <Box className="mb-4 p-4 bg-gray-100 rounded-md">
              <HStack justifyContent="space-between" mb={2}>
                <Box>
                  <Text>Date: 2024-03-01 at 10:00 AM</Text>
                  <Text>Client: Alice Johnson</Text>
                  <Text>Session Type: Chat</Text>
                </Box>
                <HStack>
                  <Button colorScheme="green">Accept Order</Button>
                  <Button colorScheme="red">Cancel Session</Button>
                </HStack>
              </HStack>
            </Box>
            <Box className="p-4 bg-gray-100 rounded-md">
              <HStack justifyContent="space-between" mb={2}>
                <Box>
                  <Text>Date: 2024-03-02 at 02:00 PM</Text>
                  <Text>Client: Bob Smith</Text>
                  <Text>Session Type: Call</Text>
                </Box>
                <HStack>
                  <Button colorScheme="green">Accept Order</Button>
                  <Button colorScheme="red">Cancel Session</Button>
                </HStack>
              </HStack>
            </Box>
          </Box>
        </VStack>
      </Box>
    </div>
  );
};

export default dashboard;
