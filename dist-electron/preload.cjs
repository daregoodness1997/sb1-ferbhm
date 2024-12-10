const { contextBridge, ipcRenderer } = require("electron");
const path = require("path");

contextBridge.exposeInMainWorld("electron", {
  path: {
    join: (...args) => path.join(...args),
  },
  ipcRenderer: {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  },
});
