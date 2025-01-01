"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.handle("print-receipt", async (event, receiptData) => {
  try {
    let printer = new ThermalPrinter({
      type: Types.EPSON,
      interface: "printer:auto"
    });
    printer.alignCenter();
    printer.println("My Store");
    printer.println("123 Main St, City, State 12345");
    printer.println("Tel: (123) 456-7890");
    printer.println("-----------------------------");
    printer.alignLeft();
    receiptData.items.forEach((item) => {
      printer.tableCustom([
        { text: item.name, align: "LEFT", width: 0.5 },
        { text: `${item.quantity}x`, align: "RIGHT", width: 0.2 },
        { text: `$${item.price.toFixed(2)}`, align: "RIGHT", width: 0.3 }
      ]);
    });
    printer.println("-----------------------------");
    printer.alignRight();
    printer.println(`TOTAL: $${receiptData.total.toFixed(2)}`);
    printer.println(`CASH: $${receiptData.cash.toFixed(2)}`);
    printer.println(`CHANGE: $${receiptData.change.toFixed(2)}`);
    printer.alignCenter();
    printer.println("Thank you for your purchase!");
    printer.cut();
    await printer.execute();
    return { success: true, message: "Receipt printed successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
