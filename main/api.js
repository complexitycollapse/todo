import { ipcMain } from "electron";
import * as fs from 'fs';
import * as path from 'path';
import * as fileWatcher from "./file-watcher.js";

let uiFilePath;

export function setPath(uiFilePathArg) {
  uiFilePath = uiFilePathArg;
}

ipcMain.handle('save', (event, contents) => {
  return new Promise((resolve, reject) => {
    try {
      if (!uiFilePath) {
        resolve(undefined);
        return;
      }
      fileWatcher.suspendWatch();
      
      fs.writeFileSync(uiFilePath, contents, { flush: true});
      resolve(undefined);
    }
    catch (err) {
      reject(err);
    }
    finally {
      fileWatcher.resumeWatch();
    }
  });
});
