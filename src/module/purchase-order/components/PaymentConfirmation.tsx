import { Input } from "@/components/ui/Input";
import React, { MouseEvent, FC, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}

const PaymentConfirmation: FC<Props> = ({ onClick, onClose }) => {
  const [collapseOne, setCollapseOne] = useState(true);
  const [collapseTwo, setCollapseTwo] = useState(false);

  return (
    <div className="w-full p-4">
      <div>
        <p>Select a Payment Method</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="cash">
          <AccordionTrigger>Pay with Cash</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 px-4">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <Input type="number" placeholder="Amount" />
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Change
              </label>
              <Input type="number" placeholder="Change" />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="reference">
          <AccordionTrigger>Record Transaction Referrence</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 px-4">
              <label className="block text-sm font-medium text-gray-700">
                Transaction Reference{" "}
              </label>
              <Input type="text" placeholder="Transaction Reference" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-50"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onClick}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
