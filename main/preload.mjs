import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  save: (contents) => ipcRenderer.invoke("save", contents)
});
