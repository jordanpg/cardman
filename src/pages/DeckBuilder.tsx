import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, isPlatform, IonGrid, IonRow, IonCol, IonInput, IonSearchbar, IonItemDivider, IonList, IonItem, IonLabel, IonBadge, IonButton, IonIcon } from '@ionic/react';

import './DeckBuilder.css';
import PreviewCardNew from '../components/PreviewCardNew';
import { refreshSharp } from 'ionicons/icons';

let ipcRenderer = null;

if(isPlatform('electron'))
    ipcRenderer = window.require('electron').ipcRenderer;

interface DeckBuilderProps {}
type DeckBuilderState = {
    cardList: Array<Cardman.Card>,
    deckList: { [ key: string ]: number; },
    page: number,
    search: string
}

const RarityRestriction = {
    Common: 4,
    Uncommon: 3,
    Rare: 2,
    Legendary: 1,
    Token: 0
}

class DeckBuilder extends Component<DeckBuilderProps, DeckBuilderState>
{
    numPerPage = 12;

    constructor(props: DeckBuilderProps)
    {
        super(props);

        this.state = {
            cardList: require('../res/testList.json'),
            deckList: {},
            page: 0,
            search: null
        }

        this.getCards();
    }

    async getCards()
    {
        if(isPlatform('electron'))
        {
            var list: Array<Cardman.Card> = await ipcRenderer.invoke('cardList');
            console.log(list);

            this.setState({ cardList: list })
        }
    }

    async constructCardsFromSheets()
    {
        if(!isPlatform('electron'))
            return;
    }

    addToDeck(card: Cardman.Card)
    {
        let { deckList } = this.state;

        if(!(card.name in deckList))
            deckList[card.name] = 1;
        else
            deckList[card.name] = Math.min(deckList[card.name] + 1, RarityRestriction[card.rarity]);

        console.debug(deckList);

        this.setState({ deckList: deckList });
    }

    removeFromDeck(name: string)
    {
        let { deckList } = this.state;

        if(!(name in deckList))
            return;
        else
            deckList[name] = Math.max(deckList[name] - 1, 0);

        if(deckList[name] === 0)
            delete deckList[name];

        console.debug(deckList);

        this.setState({ deckList: deckList });
    }

    searchFilter(card: Cardman.Card)
    {
        let { search } = this.state;

        if(search == null || search === '')
            return true;

        const manaRegex = /mana:([0-9RYGBP]+)/gmi;
        let match = Array.from(search.matchAll(manaRegex));
        // console.log(match, card.manaCost);
        if(match.length > 0)
        {
            for (const i of match)
            {
                if(card.manaCost.toLowerCase() !== i[1].toLowerCase()) return false;
                search = search.replace(i[0], '');
            }
        }

        let isearch = search.toLowerCase();

        if(search !== '' && !card.name.toLowerCase().includes(isearch) && !card.text.toLowerCase().includes(isearch))
            return false;

        return true;
    }

    render()
    {
        const { cardList, deckList, search } = this.state;

        const filteredList = cardList.sort((a,b) => a.name.localeCompare(b.name)).filter(this.searchFilter.bind(this));

        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                        <IonMenuButton />
                        <IonButton fill='clear' onClick={e=>{e.preventDefault(); this.getCards();}}>
                            <IonIcon slot="icon-only" icon={refreshSharp} />
                        </IonButton>
                        </IonButtons>
                        <IonTitle>Card Maker</IonTitle>
                    </IonToolbar>
                    <IonToolbar>
                        <IonSearchbar value={search} onIonChange={e => this.setState({ search: e.detail.value! })} />
                    </IonToolbar>
                </IonHeader>
    
                <IonContent fullscreen>
                    <IonGrid slot="fixed">
                        <IonRow id="builder">
                            <IonCol id="gridContainer" size="9">
                                <div id="cardGrid">
                                    {
                                        filteredList?.map(card => {
                                            return (
                                                <PreviewCardNew cardObj={card as Cardman.Card} scale={0.31} onMouseDown={e=>{
                                                    if(e.button === 2) this.removeFromDeck(card.name);
                                                    else this.addToDeck(card);
                                                    e.preventDefault();
                                                }} onContextMenu={e=>{e.preventDefault()}} />
                                            )
                                        })
                                    }
                                </div>
                            </IonCol>
                            <IonCol id="decklistContainer" size="3">
                                <IonList hidden={Object.keys(deckList).length < 1}>
                                    {
                                        Object.keys(deckList).map(name => {
                                            return (
                                                <IonItem button onClick={e => {
                                                    e.preventDefault();
                                                    this.removeFromDeck(name);
                                                }}
                                                onContextMenu={e=>e.preventDefault()}>
                                                    <IonLabel>{name}</IonLabel>
                                                    <IonBadge color="tertiary" slot="end">{deckList[name]}</IonBadge>
                                                </IonItem>
                                            );
                                        })
                                    }
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        );
    }
}

export default DeckBuilder;