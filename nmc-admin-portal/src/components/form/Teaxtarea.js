import React from "react";
import { Input } from "@windmill/react-ui";

const InputTextarea = ({
  register,
  name,
  label = "",
  type = "textarea",
  placeholder = "",
  defaultValue = "",
  required = true,
}) => {
  return (
    <Input
      {...register(name, {
        required: required ? `${label} is required!` : false,
      })}
      defaultValue={defaultValue}
      type={type}
      placeholder={placeholder}
      name={name}
      className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-800 text-gray-700 dark:text-gray-200 focus:border-red-800 dark:focus:border-red-700 rounded-md"
    />
  );
};

export default InputTextarea;