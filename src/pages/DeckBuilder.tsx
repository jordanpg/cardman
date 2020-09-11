import React, { Component, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, isPlatform } from '@ionic/react';

import './DeckBuilder.css';

interface DeckBuilderProps {}
type DeckBuilderState = {
    cardList: [ object ] | null
}

class DeckBuilder extends Component<DeckBuilderProps, DeckBuilderState>
{
    constructor(props: DeckBuilderProps)
    {
        super(props);

        this.state = {
            cardList: null
        }

        this.getCards();
    }

    async getCards()
    {
        if(isPlatform('electron'))
        {
            const ipcRenderer = window.require('electron').ipcRenderer;

            var list: [ object ] = await ipcRenderer.invoke('cardList');
            console.log(list);

            this.setState({ cardList: list })
        }
    }

    render()
    {
        const { cardList } = this.state;

        return (
            <IonPage>
                <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                    <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Card Maker</IonTitle>
                </IonToolbar>
                </IonHeader>
    
                <IonContent fullscreen>
                </IonContent>
            </IonPage>
        );
    }
}

export default DeckBuilder;