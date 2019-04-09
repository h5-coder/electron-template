import {
    nativeImage,
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    Tray,
    Menu,
} from "electron"
import fs from "fs"
import path from "path"
// import os from "os"
import { autoUpdater } from "electron-updater"

// const { exec } = require("child_process")
clearCache() //清理缓存。不然很坑爹

if (process.env.NODE_ENV !== "development") {
    global.__static = require("path")
        .join(__dirname, "/static")
        .replace(/\\/g, "\\\\")
}
// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let mainWindow,
    tray = null

const winURL =
        process.env.NODE_ENV === "development"
            ? `http://localhost:9080`
            : `file://${__dirname}/index.html`,
    iconPath =
        process.env.NODE_ENV === "development"
            ? `./static/images/256x256.png`
            : path.join(app.getPath("exe"), "..", "256x256.png")

function createWindow() {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 740,
        minWidth: 1200,
        minHeight: 600,
        icon: iconPath,
        useContentSize: true,
        frame: false, //创建无边框窗口
        resizable: false, //改变窗口size
        webPreferences: {
            webSecurity: false,
        },
        show: false, //优雅地显示窗口
    })

    // 加载应用的 index.html
    mainWindow.loadURL(winURL)

    // 打开开发者工具。
    mainWindow.webContents.openDevTools()

    // 当 window 被关闭，这个事件会被触发。
    mainWindow.on("closed", () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        mainWindow = null
    })

    //所有东西都加载完成时，显示窗口并聚焦在上面提醒用户
    mainWindow.once("ready-to-show", () => {
        mainWindow.show()
        mainWindow.focus()
    })

    tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "打开面板",
            click() {
                mainWindow.show()
            },
        },
        {
            label: "退出",
            role: "quit",
        },
    ])

    tray.setToolTip("Template")
    tray.setContextMenu(contextMenu)
    tray.on("double-click", () => {
        //双击显示
        mainWindow.show()
    })

    //注册开发者工具快捷键
    const retClose = globalShortcut.register("CommandOrControl+B", () => {
        BrowserWindow.getFocusedWindow().webContents.closeDevTools()
    })
    const retOpen = globalShortcut.register("CommandOrControl+N", () => {
        BrowserWindow.getFocusedWindow().webContents.openDevTools({
            mode: "undocked",
        })
    })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })
}
// const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
// 	if(mainWindow) {
// 		if(mainWindow.isMinimized()) {
// 			mainWindow.restore();
// 		}

// 		if(!mainWindow.isVisible()){
// 			mainWindow.show();
// 		}
// 		mainWindow.focus();
// 	}
// })

// if(shouldQuit) {
// 	app.quit();
// }

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on("ready", createWindow)

// 当全部窗口关闭时退出。
app.on("window-all-closed", () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    // 在这文件，你可以续写应用剩下主进程代码。
    // 也可以拆分成几个文件，然后用 require 导入。
    if (mainWindow === null) {
        createWindow()
    }
})

//注册协议
app.setAsDefaultProtocolClient("Template")

//最小化
ipcMain.on("hide-window", () => {
    mainWindow.hide()
})

//最小化
ipcMain.on("minimize-window", () => {
    mainWindow.minimize()
})

function clearCache() {
    let path = app.getPath("appData") + "/Electron/Cache",
        files = []
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path)
        files.forEach(function(file, index) {
            fs.unlinkSync(path + "/" + file)
        })
    }
}

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
})

app.on('ready', () => {
    if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
const log = require("electron-log")
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

if (process.env.NODE_ENV !== "production") {
    autoUpdater.updateConfigPath = path.join(
        __dirname,
        "../../dist/builder-effective-config.yaml",
    )
}

function sendStatusToWindow(text) {
    log.info(text)
    mainWindow.webContents.send("message", text)
}
autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("Checking for update...")
})
autoUpdater.on("update-available", info => {
    sendStatusToWindow("Update available.")
})
autoUpdater.on("update-not-available", info => {
    sendStatusToWindow("Update not available.")
})
autoUpdater.on("error", err => {
    sendStatusToWindow("Error in auto-updater. " + err)
})
autoUpdater.on("download-progress", progressObj => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond
    log_message = log_message + " - Downloaded " + progressObj.percent + "%"
    log_message =
        log_message +
        " (" +
        progressObj.transferred +
        "/" +
        progressObj.total +
        ")"
    sendStatusToWindow(log_message)
})
autoUpdater.on("update-downloaded", info => {
    sendStatusToWindow("Update downloaded")
    autoUpdater.quitAndInstall()
})

app.on("ready", () => {
    autoUpdater.checkForUpdates()
})