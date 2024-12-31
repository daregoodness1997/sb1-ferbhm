import { X } from "lucide-react";
import React, { FC, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  handleClose: (e: any) => void;
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
}

const Modal: FC<Props> = ({ handleClose, children, title, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(Modal);
