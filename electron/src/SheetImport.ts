import bent from 'bent';
import fs from 'fs';

const api = require('./google.json');

const APIURL = {
    getSheets:  `https://sheets.googleapis.com/v4/spreadsheets/${api.sheetID}?&fields=sheets.properties&key=${api.apiKey}`,
    getCSV:     `https://docs.google.com/spreadsheets/d/${api.sheetID}/gviz/tq?tqx=out:csv&sheet=`
}

const sheetsOut = "cards/sheets/";

const getJSON = bent('json', 'GET');
const getText = bent('string', 'GET');

// Get sheets as returned by Google API
export async function getSheets()
{
    let resp = await getJSON(APIURL.getSheets);

    return resp;
}

// Get only the names of teach sheet
export async function getSheetNames(): Promise<Array<string>>
{
    const sheets = await getSheets();

    return Promise.resolve(sheets['sheets'].map(e => { return e['properties']['title']; }));
}

export async function downloadSheet(name: string)
{
    console.debug(`Fetching sheet ${name}...`);
    try
    {
        const csv = await getText(APIURL.getCSV + name);

        return fs.promises.writeFile(`${sheetsOut}${name}.csv`, csv)
            .then(_ => {
                return {name: name, data: csv};
            })
            .catch((err) => {
                console.error(`Error while writing out CSV for ${name}: ${err}`);
                return null;
            });
    }
    catch(err)
    {
        console.error(`Error while fetching CSV for ${name}: ${err}`);
        return Promise.reject(null);
    }
}

// Fetch CSV files for each sheet and download them.
// Saves them to the sheetsOut directory and returns a list of objects with CSV data in the form of:
// {
//  name: <sheetName: string>,
//  data: <csvData: string>
// }
export async function downloadSheets()
{
    if(!fs.existsSync(sheetsOut))
        fs.mkdirSync(sheetsOut, { recursive: true });

    const sheets = await getSheetNames();

    return Promise.all(sheets.map(async name => {
        return downloadSheet(name);
    }));
}