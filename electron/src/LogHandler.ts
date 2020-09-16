import { BrowserWindow } from 'electron';

export default class logger
{
    static log(...args)
    {
        console.log(...args);
        BrowserWindow.getFocusedWindow().webContents.send('console', 'log', ...args);
    }

    static debug(...args)
    {
        console.debug(...args);
        BrowserWindow.getFocusedWindow().webContents.send('console', 'debug', ...args);
    }

    static info(...args)
    {
        console.info(...args);
        BrowserWindow.getFocusedWindow().webContents.send('console', 'info', ...args);
    }

    static error(...args)
    {
        console.error(...args);
        BrowserWindow.getFocusedWindow().webContents.send('console', 'error', ...args);
    }

    static warn(...args)
    {
        console.warn(...args);
        BrowserWindow.getFocusedWindow().webContents.send('console', 'warn', ...args);
    }
}