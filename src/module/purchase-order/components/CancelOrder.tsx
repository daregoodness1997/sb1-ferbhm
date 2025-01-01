import React, { MouseEvent, FC } from "react";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}

const CancelOrder: FC<Props> = ({ onClick, onClose }) => {
  return (
    <div className="w-full p-4">
      <div>
        <p>Are you sure you want to cancel this order</p>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onClick}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Cancel Order
        </button>
      </div>
    </div>
  );
};

export default CancelOrder;
