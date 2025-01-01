import React, { FC, memo } from "react";

interface Props {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const AppLayout: FC<Props> = ({ title, description, children, actions }) => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <div>{actions}</div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default memo(AppLayout);
