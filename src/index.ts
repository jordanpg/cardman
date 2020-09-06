import { app, BrowserWindow } from 'electron';

function main() {
    const mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWin.loadFile('../index.html');
}

app.whenReady().then( ()  => {
    main();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length == 0) main();
    });
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
});