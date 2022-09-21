///<reference path="../../node_modules/electron/electron.d.ts" />
// 引入electron并创建一个Browserwindow
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
// 保持window对象的全局引用,避免JavaScript对象被垃圾回收时,窗口被自动关闭.
let mainWindow;
class AppWindow extends BrowserWindow {
  constructor(config, urlLocation) {
    const basicConfig = {
      width: 800, // 打开窗口的宽度
      height: 600, // 打开窗口的高度
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true,
        enableRemoteModule: true,
        nodeIntegrationInWorker: true,
        preload: path.join(__dirname, 'preload.js')
      },
      show: false,
      backgroundColor: '#efefef'
    };
    Menu.setApplicationMenu(null);
    const finalConfig = { ...basicConfig, ...config };
    super(finalConfig);
    this.loadURL(urlLocation);
    this.once('ready-to-show', () => {
      this.show();
    });
  }
}
// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.on('ready', () => {
  const mainWindowConfig = {
    width: 1440,
    height: 768
  };
  const urlLocation = isDev ? 'http://localhost:3000' : `file://${__dirname}/build/index.html`;
  // 加载应用----适用于 react 项目
  mainWindow = new AppWindow(mainWindowConfig, urlLocation);
  // 打开开发者工具，默认不打开
  isDev && mainWindow.webContents.openDevTools();
  // 关闭window时触发下列事件.
  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});
