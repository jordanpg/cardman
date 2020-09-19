import { app, ipcMain } from "electron";
import { createCapacitorElectronApp } from "@capacitor-community/electron-core";
import glob from 'glob-promise';
import fs from 'fs';
import './TSDeckBuilder';
import TSDeckBuilder from "./TSDeckBuilder";
import { downloadSheets, getSheetNames } from "./SheetImport";

const homedir = require('os').homedir();
const tabletopDir = homedir + "/Documents/My Games/Tabletop Simulator/Saves/Saved Objects/cardman";

type CardmanMainState = {
  cardList: Array<object>,
  deck: TSDeckBuilder | null
}

// The MainWindow object can be accessed via myCapacitorApp.getMainWindow()
const myCapacitorApp = createCapacitorElectronApp({
  mainWindow: {
    windowOptions: {
      webPreferences: {
        nodeIntegration: true
      }
    }
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on("ready", () => {
  myCapacitorApp.init();

  getCards();
  getSheetNames().then(console.log);
  downloadSheets().then(console.log);
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) myCapacitorApp.init();
});

// Define any IPC or other custom functionality below here
let mainState: CardmanMainState = {
  cardList: [],
  deck: null
};

async function getCards()
{
  mainState.cardList = [];
  // Get a list of all card JSON files
  await glob('cards/**/*.json')
    .then(files => {
      // Iterate through the list of files
      return Promise.all(files.map( async file => {
        // Open each file to read
        return fs.promises.readFile(file, 'utf8')
          .then(data => {
            try
            {
              // Parse the card JSON and add it to the list
              mainState.cardList.push(JSON.parse(data));
              return true;
            }
            catch(err) // Handle JSON errors
            {
              console.warn('Error while reading JSON file ' + file + ': ' + err);
              return false;
            }
          })
          .catch(err => {
            console.warn('Error when reading file ' + file + ': ' + err);
            return false;
          });
      }));
    })
    .catch(err => {
      console.error('Error while grabbing card files: ' + err);
      return null;
    });

  return Promise.resolve(mainState.cardList);
}

ipcMain.handle('cardList', async (event) => {
  return await getCards();
});

ipcMain.on('saveImages', (event, list) => {
  if(!fs.existsSync('cards/csvOut'))
    fs.mkdirSync('cards/csvOut', { recursive: true });

  list.forEach(element => {
    let data = element[1].replace(/^data:image\/\w+;base64,/, "");
    let buf = Buffer.from(data, 'base64');
    let dir = 'cards/csvOut/';
    if(element[2] != null && element[2] !== '')
    {
      dir += element[2] + '/';
      if(!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    }
    let name = dir + element[0] + '.png';
    console.log("Writing image " + name);
    fs.writeFile(name, buf, (err) => {
      if(err) console.error(err);
    });

    if(element[3] != null)
    {
      name = dir + element[0] + '.json';
      fs.writeFile(name, JSON.stringify(element[3], null, '\t'), (err) => {
        if(err) console.error(err);
      });
    }
  });
});

ipcMain.on('saveTSObject', (event, json, name) => {
  if(!fs.existsSync(tabletopDir))
    fs.mkdirSync(tabletopDir, { recursive: true });

  console.info(json);
  let file = `${tabletopDir}/${name}.json`;
  fs.writeFile(file, json, e => {
    if(e) console.error(e);
  });
});

ipcMain.handle('deckStart', async event => {
  console.debug("Got deckStart");
  mainState.deck = new TSDeckBuilder();
  return true;
});

ipcMain.on('deckAddCard', (event, dataUrl, card) => {
  if(!mainState.deck) return;
  mainState.deck.pushCard(dataUrl, card);
})

ipcMain.handle('deckFinalize', async event => {
  if(!mainState.deck) return;
  
  let [json, name] = await mainState.deck.finalizeDeck();

  if(!fs.existsSync(tabletopDir))
  fs.mkdirSync(tabletopDir, { recursive: true });

  console.info(json);
  let file = `${tabletopDir}/${name}.json`;
  fs.writeFile(file, json, e => {
    if(e) console.error(e);
    else console.debug(`Wrote deck object to ${file}`);
  });

  return file;
});

ipcMain.handle('getSheets', async event => {
  return await getSheetNames();
});

ipcMain.handle('getSheetCSV', async (event, name) => {
  const sheets = await downloadSheets();

  for(const i of sheets)
    if(i.name === name) return i.data

  return null;
});

ipcMain.handle('getAllSheetCSV', async event => {
  return await downloadSheets();
});