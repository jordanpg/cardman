import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonItemDivider, IonInput, IonSelect, IonSelectOption, IonLabel, IonButton, IonItem, IonTextarea, isPlatform, getPlatforms } from '@ionic/react';
import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useParams } from 'react-router';

import PreviewCard from '../components/PreviewCard';

import './CardMaker.css';
// import rasterizeHTML from 'rasterizehtml';
import html2canvas from 'html2canvas';

const CardMaker: React.FC = () => {
    const [name, setName] = useState<string>();
    const [mana, setMana] = useState<string>();
    const [color, setColor] = useState<string>('Colorless');
    const [rarity, setRarity] = useState<string>('Common');
    const [type, setType] = useState<string>('Creature');
    const [subtype, setSubtype] = useState<string>();
    const [artist, setArtist] = useState<string>();
    const [power, setPower] = useState<number>();
    const [health, setHealth] = useState<number>();
    const [text, setText] = useState<string>();
    const [artUrl, setArtUrl] = useState<string>();

    const [previewWidth, setPreviewWidth] = useState<number>();

    const artFile = useRef(null);
    const jsonOpen = useRef(null);
    const previewColumn = useRef(null);

    const cardObj: Cardman.Card = {
      name: name,
      color: color,
      manaCost: mana,
      image: artUrl,
      type: type,
      subtype: subtype,
      rarity: rarity,
      text: text,
      artist: artist,
      power: power,
      health: health
    };

    // Read image file to data URL and store it
    function onSelectFile(event: ChangeEvent<HTMLInputElement>)
    {
        if(event.target.files && event.target.files[0])
        {
          let reader = new FileReader();
          reader.onload = (e) => {
            //@ts-ignore
            setArtUrl(e.target.result);
          };
          reader.readAsDataURL(event.target.files[0])
        }
    }

    function onSelectJSON(event: ChangeEvent<HTMLInputElement>)
    {
      if(event.target.files && event.target.files[0])
      {
        let reader = new FileReader();
        reader.onload = (e) => {
          //@ts-ignore
          let t: Cardman.Card = JSON.parse(e.target?.result);

          console.log(t);

          // Correct old field names
          if(t.type === "Spell") t.type = "Action";
          if(t.type === "Artifact") t.type = "Field";

          if(t.subtype === "") t.subtype = undefined;

          setName(t.name);
          setColor(t.color);
          setMana(t.manaCost);
          setArtUrl(t.image);
          setType(t.type);
          setSubtype(t.subtype);
          setRarity(t.rarity);
          setText(t.text);
          setArtist(t.artist);
          setPower(t.power);
          setHealth(t.health);
        };
        reader.readAsText(event.target.files[0])
      }
    }

    function onSaveButton(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>)
    {
      event.preventDefault();

      var tempDL = document.createElement("a");
      tempDL.style.display = "none";

      // var canvas = document.getElementById('cardCanvas') as HTMLCanvasElement;
      // if(!canvas) return;

      // const style = document.getElementsByTagName('head')[0].outerHTML;
      // const input = style + document.getElementById('cardPreview')?.outerHTML;

      // console.log(input);

      // //@ts-ignore
      // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      
      // rasterizeHTML.drawHTML(input, canvas).then((r) => {
      //   tempDL.href = canvas.toDataURL("image/png");
      //   tempDL.download = cardObj.name + '.png';
      //   tempDL.click();

      //   tempDL.href = "data:application/octet-stream;base64," + btoa(JSON.stringify(cardObj));
      //   tempDL.download = cardObj.name + '.json';
      //   tempDL.click();
      // }).catch((e) => {
      //     console.error(e);
      // });

      var el = document.createElement('div');
      document.body.appendChild(el);

      var target = document.getElementById('cardPreview')?.cloneNode(true);
      //@ts-ignore
      el.appendChild(target);

      //@ts-ignore
      html2canvas(el.firstChild, {backgroundColor: null}).then(canvas => {
        canvas.style.display = 'none';

        tempDL.href = canvas.toDataURL("image/png");
        tempDL.download = cardObj.name + '.png';
        tempDL.click();

        tempDL.href = "data:application/octet-stream;base64," + btoa(JSON.stringify(cardObj));
        tempDL.download = cardObj.name + '.json';
        tempDL.click();

        el.remove();
      });

      tempDL.remove();
    }

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
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Card Maker</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonGrid>
              <IonRow>
                <IonCol size="12" size-md="6">
                    <form>
                      {/* Card Header */}
                        <IonRow>
                            <IonItemDivider>Card Header</IonItemDivider>
                            <IonCol size="6">
                                <IonLabel>Name*</IonLabel>
                                <IonInput required value={name} placeholder="Card Name" onIonChange={e=>setName(e.detail.value!)}></IonInput>
                            </IonCol>
                            <IonCol size="3">
                                <IonLabel>Mana Cost</IonLabel>
                                <IonInput value={mana} placeholder="e.g. {2}{B2}" onIonChange={e=>setMana(e.detail.value!)}></IonInput>
                            </IonCol>
                            <IonCol size="3">
                                <IonLabel>Color</IonLabel>
                                <IonSelect interface="popover" value={color} okText="Okay" cancelText="Dismiss" onIonChange={e=>setColor(e.detail.value!)}>
                                    <IonSelectOption value="Red">Red</IonSelectOption>
                                    <IonSelectOption value="Yellow">Yellow</IonSelectOption>
                                    <IonSelectOption value="Green">Green</IonSelectOption>
                                    <IonSelectOption value="Blue">Blue</IonSelectOption>
                                    <IonSelectOption value="Purple">Purple</IonSelectOption>
                                    <IonSelectOption value="Colorless">Colorless</IonSelectOption>
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                        {/* Type Line */}
                        <IonRow>
                          <IonItemDivider>Type Line</IonItemDivider>
                          <IonCol size="3">
                            <IonLabel>Rarity</IonLabel>
                                  <IonSelect interface="popover" value={rarity} okText="Okay" cancelText="Dismiss" onIonChange={e=>setRarity(e.detail.value!)}>
                                      <IonSelectOption value="Common">Common</IonSelectOption>
                                      <IonSelectOption value="Uncommon">Uncommon</IonSelectOption>
                                      <IonSelectOption value="Rare">Rare</IonSelectOption>
                                      <IonSelectOption value="Legendary">Legendary</IonSelectOption>
                                      <IonSelectOption value="Token">Token</IonSelectOption>
                                </IonSelect>
                          </IonCol>
                          <IonCol size="3">
                            <IonLabel>Type</IonLabel>
                                  <IonSelect interface="popover" value={type} okText="Okay" cancelText="Dismiss" onIonChange={e=>setType(e.detail.value!)}>
                                      <IonSelectOption value="Creature">Creature</IonSelectOption>
                                      <IonSelectOption value="Action">Action</IonSelectOption>
                                      <IonSelectOption value="Field">Field</IonSelectOption>
                                </IonSelect>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel>Subtype</IonLabel>
                            <IonInput value={subtype} placeholder="e.g. Sphinx, Kyten" onIonChange={e=>setSubtype(e.detail.value!)}></IonInput>
                          </IonCol>
                        </IonRow>
                        {/* Creature Stats, Footer*/}
                        <IonRow>
                          <IonItemDivider>Stats and Footer</IonItemDivider>
                          <IonCol size="3">
                            <IonLabel>Power</IonLabel>
                            <IonInput value={power} type="number" placeholder="Card Power" onIonChange={e=>setPower(parseInt(e.detail.value!))}></IonInput>
                          </IonCol>
                          <IonCol size="3">
                            <IonLabel>Health</IonLabel>
                            <IonInput value={health} type="number" placeholder="Card Health" onIonChange={e=>setHealth(parseInt(e.detail.value!))}></IonInput>
                          </IonCol>
                          <IonCol size="6">
                            <IonLabel>Artist</IonLabel>
                            <IonInput value={artist} placeholder="Artist Name" onIonChange={e=>setArtist(e.detail.value!)}></IonInput>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonItemDivider>Card Text</IonItemDivider>
                          <IonCol size="12">
                            <IonTextarea rows={7} placeholder="Card Text" value={text} onIonChange={e=>setText(e.detail.value!)}></IonTextarea>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonItemDivider></IonItemDivider>
                            <IonCol size="12">
                                <>
                                    <input
                                        ref={artFile}
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={onSelectFile}
                                        onClick={() => {}}
                                    />
                                    <IonButton
                                        color="primary"
                                        onClick={() => {
                                            //@ts-ignore
                                            artFile?.current?.click();
                                        }}>
                                        Upload Card Art
                                    </IonButton>
                                </>

                                <IonButton
                                    color="primary"
                                    onClick={e=>setArtUrl(null)}>
                                    Remove Art
                                </IonButton>

                                <>
                                    <input
                                        ref={jsonOpen}
                                        hidden
                                        type="file"
                                        accept="application/json"
                                        onChange={onSelectJSON}
                                        onClick={() => {}}
                                    />
                                    <IonButton
                                        color="primary"
                                        onClick={() => {
                                            //@ts-ignore
                                            jsonOpen?.current?.click();
                                        }}>
                                        Load Card JSON
                                    </IonButton>
                                </>

                                <IonButton
                                    color="primary"
                                    onClick={onSaveButton}>
                                    Save Card
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </form>
                </IonCol>
                <IonCol size="12" size-md="6" ref={previewColumn}>
                  {/* Card Preview */}
                    <PreviewCard cardObj={cardObj} scale={1.5} />
                </IonCol>
              </IonRow>
          </IonGrid>
          {/* <canvas id="cardCanvas" style={{
                      display: 'none',
                      width: 240,
                      height: 336
                    }}></canvas> */}
        </IonContent>
      </IonPage>
    );
  };
  
  export default CardMaker;
  