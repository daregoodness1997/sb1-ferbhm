import React, { FC, memo, useState } from "react";

interface Props {
  options: { value: string; label: string }[];
  label: string;
  required?: boolean;
  value?: string;
  onChange: (e: any) => void;
}

const Select: FC<Props> = ({ options, label, required, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1 p-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(Select);
