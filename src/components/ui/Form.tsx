import React, { useState } from "react";

interface FieldConfig {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select inputs
}

interface GeneralizedFormProps {
  fields: FieldConfig[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const Form: React.FC<GeneralizedFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] = initialData ? initialData[field.name] : "";
    });
    return initial;
  });

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                required={field.required}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="mt-1 p-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                required={field.required}
                className="mt-1 p-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData[field.name]}
                onChange={(e) =>
                  handleChange(
                    field.name,
                    field.type === "number"
                      ? parseFloat(e.target.value)
                      : e.target.value
                  )
                }
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
