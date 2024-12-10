import { ipcRenderer } from "electron";

interface ReceiptProps {
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  timestamp: Date;
}

export const printReceipt = async (data: ReceiptProps) => {
  try {
    await ipcRenderer.invoke("print-receipt", data);
  } catch (error) {
    console.error("Failed to print receipt:", error);
    // Fallback to browser printing
    printBrowserReceipt(data);
  }
};

// Keep the browser printing as fallback
const printBrowserReceipt = ({ items, total, timestamp }: ReceiptProps) => {
  const receipt = document.createElement("div");
  receipt.innerHTML = `
    <div style="font-family: monospace; width: 300px; padding: 10px;">
      <div style="text-align: center; margin-bottom: 10px;">
        <h3>SALES RECEIPT</h3>
        <p>${timestamp.toLocaleString()}</p>
      </div>
      <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
      ${items
        .map(
          (item) => `
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>${item.name} x${item.quantity}</span>
          <span>₦${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `
        )
        .join("")}
      <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
      <div style="display: flex; justify-content: space-between; font-weight: bold;">
        <span>TOTAL</span>
        <span>₦${total.toFixed(2)}</span>
      </div>
    </div>
  `;

  const printWindow = window.open("", "", "width=600,height=600");
  printWindow?.document.write(receipt.innerHTML);
  printWindow?.print();
  printWindow?.close();
};
