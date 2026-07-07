"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.off(channel, listener);
  },
  send(...args) {
    const [channel, ...rest] = args;
    return electron.ipcRenderer.send(channel, ...rest);
  },
  invoke(...args) {
    const [channel, ...rest] = args;
    return electron.ipcRenderer.invoke(channel, ...rest);
  }
});
electron.contextBridge.exposeInMainWorld("db", {
  getSources: () => electron.ipcRenderer.invoke("db:source:list"),
  addSource: (name, url) => electron.ipcRenderer.invoke("db:source:add", name, url),
  deleteSource: (id) => electron.ipcRenderer.invoke("db:source:delete", id),
  getUnreadArticles: () => electron.ipcRenderer.invoke("db:article:list")
});
electron.contextBridge.exposeInMainWorld("scraper", {
  sync: () => electron.ipcRenderer.invoke("scraper:sync")
});
