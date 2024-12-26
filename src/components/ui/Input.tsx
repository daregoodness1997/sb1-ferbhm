import React, { FC, memo, useState } from "react";

interface Props {
  type?: string;
  required?: boolean;
  value?: string;
  onChange: (e: any) => void;
  label: string;
}

const Input: FC<Props> = ({
  type = "text",
  required,
  value,
  onChange,
  label,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        required={required}
        className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default memo(Input);
