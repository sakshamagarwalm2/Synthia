"use client";
import React from "react";
import { Button } from "../../components/ui/button";
import { X } from "lucide-react";

function CreditPopup({ onClose, onBuy }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-accent dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-red-500" />
        </button>

        <div className="p-6">
          <h2 className="text-4xl font-extrabold text-emerald-700 uppercase mb-2">Insufficient Credits</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don’t have enough credits to perform this action.
          </p>

          <div className="dark:bg-gray-700 p-4 rounded-lg text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Get More Credits</h3>
            <p className="text-3xl font-bold text-primary dark:text-yellow-400">
              $50
            </p>
            <p className="text-sm text-black dark:text-gray-400">for 10,000 credits</p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Each search or research query costs 1,000 credits.
          </p>

          <div className="flex justify-end gap-3">
            <Button onClick={onBuy} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">Buy Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreditPopup;