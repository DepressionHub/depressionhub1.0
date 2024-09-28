import React from "react";
import { Textarea, TextareaProps, Box } from "@/lib/ui";

interface CustomTextAreaProps extends TextareaProps {
  label?: string;
  style?: React.CSSProperties;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
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
        <Textarea
          {...props}
          className={`border rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 ${
            props.className || ""
          }`}
        />
      </Box>
    </Box>
  );
};

export default CustomTextArea;
