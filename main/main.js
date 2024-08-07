import { app, BrowserWindow } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fileWatcher from "./file-watcher.js";

let uiFilePath = process.argv[2];
if (uiFilePath === "--remote-debugging-port=9222") uiFilePath = undefined;

const env = uiFilePath ? "production" : "development";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If development environment 
if (env === "development") {
  fileWatcher.watch(path.join(__dirname, ".."));
  console.log("Watching files");
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 900,
    height: 675,
    // show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  // win.maximize();
  // win.show();
  win.setMenu(null);
  win.loadFile(uiFilePath ?? "window/index.html");

  // Listen for console events and open DevTools on error
  win.webContents.on("console-message", (event, level, message, line, sourceId) => {
    if (level >= 2) { // 2 is "warn", 3 is "error"
        win.webContents.openDevTools({ mode: "bottom" });
    }
  });
}

app.whenReady().then(async () => {
  const api = await import("./api.js");
  if (uiFilePath) api.setPath(path.join(process.cwd(), uiFilePath));
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
