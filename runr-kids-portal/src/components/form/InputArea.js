import React from "react";
import { Input } from "@windmill/react-ui";

const InputArea = ({ register, name, type = "text", placeholder, required, defaultValue = "", readOnly, onInputClick, className = "", }) => {
  return (
    <Input
      {...register(name, {
        required: required ? "This field is required" : false,
      })}
      defaultValue={defaultValue}   // ✔ uncontrolled
      type={type}
      placeholder={placeholder}
      name={name}
      readOnly={readOnly}
       onClick={onInputClick}  
      className={`border h-12 text-sm focus:outline-none block w-full 
        bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white 
        dark:focus:bg-gray-800 text-gray-700 dark:text-gray-200 
        focus:border-green-500 dark:focus:border-green-500 rounded-md 
        ${className}`}
    />
  );
};

export default InputArea;
