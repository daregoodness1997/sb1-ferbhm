import { ipcMain } from "electron";
import ThermalPrinter from "node-thermal-printer";
import PrinterTypes from "node-thermal-printer";

const printer = new ThermalPrinter.printer({
  type: PrinterTypes.EPSON, // Change according to your printer
  interface: "printer:THERMAL_PRINTER_NAME", // Update with your printer name
  options: {
    timeout: 1000,
  },
});

ipcMain.handle("print-receipt", async (_, data) => {
  try {
    await printer.init();

    printer.alignCenter();
    printer.bold(true);
    printer.println("SALES RECEIPT");
    printer.bold(false);
    printer.println(new Date().toLocaleString());
    printer.drawLine();

    data.items.forEach((item: any) => {
      printer.alignLeft();
      printer.print(`${item.name} x${item.quantity}`);
      printer.alignRight();
      printer.println(`₦${(item.price * item.quantity).toFixed(2)}`);
    });

    printer.drawLine();
    printer.alignLeft();
    printer.bold(true);
    printer.print("TOTAL: ");
    printer.alignRight();
    printer.println(`₦${data.total.toFixed(2)}`);

    printer.cut();
    await printer.execute();
    return true;
  } catch (error) {
    console.error("Printing failed:", error);
    throw error;
  }
});
