import React, { memo, FC } from "react";

interface Item {
  id: string;
  [key: string]: any;
}

interface Props {
  selectedItem: Item[];
}

const DetailedView: FC<Props> = ({ selectedItem }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {selectedItem &&
        Object.entries(selectedItem)
          .filter(
            ([key]) =>
              !["id", "stockChangeHistory"].includes(key) &&
              selectedItem[key] !== undefined
          )
          .map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <div className="mt-1 text-sm text-gray-900">
                {key.toLowerCase().includes("date")
                  ? new Date(value as string).toLocaleString()
                  : typeof value === "boolean"
                  ? value
                    ? "Yes"
                    : "No"
                  : String(value)}
              </div>
            </div>
          ))}
    </div>
  );
};

export default memo(DetailedView);
