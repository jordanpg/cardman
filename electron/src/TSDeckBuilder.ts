import imgur from 'imgur';
import fs from 'fs';
import { promisify } from 'util';

const mergeImg = require('merge-img');
const Jimp = require('jimp');

// Some limited type definitions for Tabletop Simulator saves.
// Generally, only the fields necessary for a custom deck are included.

type TransformState = {
    posX: number,
    posY: number,
    posZ: number,
    rotX: number,
    rotY: number,
    rotZ: number,
    scaleX: number,
    scaleY: number,
    scaleZ: number
}

type ColorDiffuse = {
    r: number,
    g: number,
    b: number
}

type CustomDeckState = {
    FaceURL: string,
    BackURL: string,
    NumWidth?: number,
    NumHeight?: number,
    BackIsHidden: boolean,
    UniqueBack: boolean
}

type ObjectState = {
    Name: string,
    Transform: TransformState,
    Nickname: string,
    Description: string,
    GMNotes: string,
    ColorDiffuse: ColorDiffuse,
    Locked: boolean,
    Grid: boolean,
    Snap: boolean,
    IgnoreFoW: boolean,
    Autoraise: boolean,
    Sticky: boolean,
    Tooltop: boolean,
    GridProjection: boolean,
    HideWhenFaceDown: boolean,
    Hands: boolean,
    CardID?: number,
    SidewaysCard: boolean,
    DeckIDs?: Array<number>,
    CustomDeck: { number: CustomDeckState } | {},
    XmlUI: string,
    LuaScript: string,
    LuaScriptState: string,
    ContainedObjects?: Array<ObjectState>,
    GUID: string
}

type SaveState = {
    SaveName: string,
    GameMode: string,
    Gravity: number,
    PlayArea: number,
    Date: string,
    Table: string,
    Sky: string,
    Note: string,
    Rules: string,
    XmlUI: string,
    LuaScript: string,
    LuaScriptState: string,
    ObjectStates: [ ObjectState ] | [],
    TabStates: object,
    VersionNumber: string
}

export default class TSDeckBuilder
{
    deckId: number
    cardId: number
    tsObj: SaveState
    deck: ObjectState
    activeRequests: number
    individualCards: boolean = false
    cardBuffer: Array<[string, Cardman.Card]>
    customDeck: { number: CustomDeckState } | {}

    static cardBack = "https://cdn.discordapp.com/attachments/751644256195575812/754903314436718622/card_backing.png";
    
    constructor()
    {
        this.cardId = 0;
        this.deckId = 1;
        this.activeRequests = 0;

        this.cardBuffer = new Array<[string, Cardman.Card]>();
        this.customDeck = {}

        // Initialize SaveState
        this.tsObj = {
            SaveName: "",
            GameMode: "",
            Gravity: 0.5,
            PlayArea: 0.5,
            Date: "",
            Table: "",
            Sky: "",
            Note: "",
            Rules: "",
            XmlUI: "",
            LuaScript: "",
            LuaScriptState: "",
            ObjectStates: [this.initDeck()],
            TabStates: {},
            VersionNumber: ""
        }
    }

    initDeck()
    {
        return this.deck = {
            Name: "Deck",
            Transform: TSDeckBuilder.dummyTransform(),
            Nickname: "",
            Description: "",
            GMNotes: "",
            ColorDiffuse: TSDeckBuilder.dummyColor(),
            Locked: false,
            Grid: true,
            Snap: true,
            IgnoreFoW: false,
            Autoraise: true,
            Sticky: true,
            Tooltop: true,
            GridProjection: false,
            HideWhenFaceDown: true,
            Hands: false,
            SidewaysCard: false,
            DeckIDs: [],
            CustomDeck: this.customDeck,
            XmlUI: "",
            LuaScript: "",
            LuaScriptState: "",
            ContainedObjects: [],
            GUID: TSDeckBuilder.generateGUID()
        };
    }

    async pushCard(dataUrl: string, card: Cardman.Card)
    {
        dataUrl = dataUrl.replace('data:image/png;base64,','');
        if(this.individualCards)
        {
            let frontUrl = null;
            this.activeRequests++;

            // Upload card image and wait for a response.
            console.debug(`Pushing ${card.name} to imgur...`);
            await imgur.uploadBase64(dataUrl)
                .then(json => {
                    frontUrl = json.data.link;
                    console.info(`${card.name} uploaded as ${frontUrl}`);
                })
                .catch(err => {
                    console.error(err);
                });
                

            this.activeRequests--;
            if(frontUrl == null)
            {
                console.warn(`Could not add card ${card.name} to Tabletop Simulator object. Upload failed.`);
                return;
            }

            // Actually add the card to the deck
            this.addCard(card, true, frontUrl);
        }
        else
        {
            // Add card to the buffer
            this.cardBuffer.push([dataUrl, card]);

            if(this.cardBuffer.length === 70)
                this.flushCardBuffer();
        }
    }

    async flushCardBuffer()
    {
        let row = [];
        let img = [];

        console.debug(`Flushing ${this.cardBuffer.length} cards from buffer...`);
        
        const handleMerge = async () => {
            console.debug(`Merging row ${img.length}...`);
            const merged = await mergeImg(row)
                .catch(console.error);
            console.debug(`Row ${img.length} merged.`);
            
            const bufferAsync = promisify(merged.getBuffer).bind(merged);

            img.push(await bufferAsync(Jimp.MIME_PNG));
            row = [];

            return Promise.resolve();
        }

        for (const elem of this.cardBuffer)
        {
            console.debug(`Flushing ${elem[1].name}...`);
            row.push(Buffer.from(elem[0], 'base64'));
            this.addCard(elem[1]);

            if(row.length === 10)
            {
                await handleMerge();
            }
        }

        if(row.length > 0)
        {
            await handleMerge();
        }

        // console.debug(img[0]);
        console.debug(`Merging ${img.length} rows...`);
        let final = await mergeImg(img, {direction: true})
            .catch(console.error);

        console.debug(`All rows merged into 10x${img.length} card image.`);

        // console.log(final);
        let frontUrl = null;
        this.activeRequests++;

        const abase64 = promisify(final.getBase64).bind(final);

        // Upload card image and wait for a response.
        console.debug(`Pushing deck image to imgur...`);
        await imgur.uploadBase64((await abase64(Jimp.MIME_PNG)).replace('data:image/png;base64,',''))
            .then(json => {
                frontUrl = json.data.link;
                console.info(`Deck image uploaded as ${frontUrl}`);
            })
            .catch(err => {
                console.error(err);
            });
            

        this.activeRequests--;
        if(frontUrl == null)
        {
            console.warn(`Could not add deck to Tabletop Simulator object. Upload failed.`);
            return Promise.reject(`Could not add deck to Tabletop Simulator object. Upload failed.`);
        }

        this.customDeck[this.deckId] = {
            FaceURL: frontUrl,
            BackURL: TSDeckBuilder.cardBack,
            NumHeight: img.length,
            NumWidth: 10,
            BackIsHidden: true,
            UniqueBack: false
        }

        this.cardId = 0;
        this.deckId++;

        return Promise.resolve();
    }

    async finalizeDeck(): Promise<[string, string]>
    {
        if(!this.individualCards)
            await this.flushCardBuffer();

        let t = this;
        console.info("Waiting for requests to finish...");
        await new Promise((res, rej) => {
            function wait() {
                if(t.activeRequests === 0) return res();
                setTimeout(wait.bind(t, res), 30);
            }
            wait();
        });

        console.info("All cards finished! Attempting to save object...")
        // console.debug(this);
        // if(isPlatform('electron'))
        // {
        //     const ipcRenderer = window.require('electron').ipcRenderer;

        //     ipcRenderer.send('saveTSObject', JSON.stringify(this, null, '\t'), `export${this.deck.GUID}`);
        // }

        return Promise.resolve([JSON.stringify(this.tsObj, null, '\t'), `export${this.deck.GUID}`]);
    }

    private addCard(card: Cardman.Card, individual = false, front?: string, )
    {
        let deckId;

        if(individual)
        {
            deckId = this.deckId * 100;
            this.deckId++;
        }
        else
            deckId = this.deckId * 100 + this.cardId;

        this.deck.DeckIDs.push(deckId);

        let tscard: ObjectState = {
            Name: "Card",
            Transform: TSDeckBuilder.dummyTransform(),
            Nickname: card.name,
            Description: TSDeckBuilder.generateCardDescription(card),
            GMNotes: "",
            ColorDiffuse: TSDeckBuilder.dummyColor(),
            Locked: false,
            Grid: true,
            Snap: true,
            IgnoreFoW: false,
            Autoraise: true,
            Sticky: true,
            Tooltop: true,
            GridProjection: false,
            HideWhenFaceDown: true,
            Hands: true,
            CardID: deckId,
            SidewaysCard: false,
            CustomDeck: {},
            XmlUI: "",
            LuaScriptState: "",
            LuaScript: "",
            GUID: TSDeckBuilder.generateGUID()
        }

        if(individual)
        {
            // Create CustomDeck entry to be used in deck and card.
            let customDeck: CustomDeckState = {
                FaceURL: front,
                BackURL: TSDeckBuilder.cardBack,
                NumHeight: 1,
                NumWidth: 1,
                BackIsHidden: true,
                UniqueBack: false
            }

            // Add CustomDeck to the deck
            this.customDeck[this.cardId] = customDeck;
            tscard.CustomDeck[this.cardId] = customDeck;
        }

        this.deck.ContainedObjects.push(tscard);

        this.cardId++;
    }

    static generateGUID(): string
    {
        return Math.floor(Math.random() * 0xffffff).toString(16);
    }

    static generateCardDescription(card: Cardman.Card): string
    {
        let header = `[b]${card.name}[/b] : ${card.manaCost}`;
        let body =  `\n${card.type + ((card.subtype != null && card.subtype.length > 0) ? " - " + card.subtype : "")}
                     [00aa77]${card.text.trim()}`;
        return header + body;
    }

    static dummyTransform(): TransformState
    {
        return {
            posX: 0.0,
            posY: 2.0,
            posZ: 0.0,
            rotX: 0.0,
            rotY: 180.0,
            rotZ: 180.0,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1
        };
    }

    static dummyColor(): ColorDiffuse
    {
        return {
            r: 0.713235259,
            g: 0.713235259,
            b: 0.713235259
        };
    }
}
