import React from "react";
import { Input, InputProps, Box } from "@/lib/ui";

interface CustomInputProps extends InputProps {
  label?: string;
  style?: React.CSSProperties;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  style,
  ...props
}) => {
  return (
    <Box style={style}>
      {label && (
        <label
          htmlFor={props.id}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <Box className="chakra-text__wrapper">
        <Input
          {...props}
          className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 ${
            props.className || ""
          }`}
        />
      </Box>
    </Box>
  );
};

export default CustomInput;
