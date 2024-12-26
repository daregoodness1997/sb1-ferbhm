import React from "react";

interface TableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
}

export function Table<T>({ data, columns }: DataGridProps<T>) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key as string}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((column) => (
              <td
                key={column.key as string}
                className="px-6 py-4 whitespace-nowrap"
              >
                {column.render ? column.render(item) : item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
