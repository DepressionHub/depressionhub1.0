import { Box } from "@chakra-ui/react";
import React from "react";

const dashboard = () => {
  return (
    <div>
      <Box minH="100vh" bg="gray.100" py={10} px={4}>
        <h1 className="text-3xl font-bold text-slate-950">
          Welcome back, Therapist
        </h1>
        <div className="flex justify-between">
          <div>online</div>
          <button
            style={{
              backgroundColor: "green",
              color: "white",
              fontWeight: "bold",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              transition: "background-color 0.3s",
              display: "flex",
              alignItems: "center",
            }}
          >
            withdraw Money
          </button>
          <button
            style={{
              backgroundColor: "purple",
              color: "white",
              fontWeight: "bold",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              transition: "background-color 0.3s",
              display: "flex",
              alignItems: "center",
            }}
          >
            log out
          </button>
        </div>
      </Box>
    </div>
  );
};

export default dashboard;
