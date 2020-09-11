import React from 'react';
import ReactMarkdown from 'react-markdown';

import './PreviewCard.css';

interface PreviewCardProps {
    cardObj: Cardman.Card,
    scale?: number
}

const PreviewCard: React.FC<PreviewCardProps> = ({ cardObj, scale }) => {
    return (
        <div style={{
            margin: "auto",
            transform: "scale(" + (scale ? scale : 1) + ")",
            transformOrigin: "top"
        }}>
            <div id="cardPreview" className={"card " + cardObj.color.toLowerCase()}>
                <div className="card-header" style={{
                    position: "relative"
                }}>
                    <div id="cardPreviewName" style={{
                        float: "left",
                        width: "70%",
                        textAlign: "left"
                    }}>{cardObj.name}</div>
                    <div id="cardPreviewMana" style={{
                        position: "absolute",
                        // width: "30%",
                        textAlign: "right",
                        right: "1mm"
                    }}>{cardObj.manaCost}</div>
                </div>
                <img id="cardPreviewImage" alt="" src={ (cardObj.image !== null) ? cardObj.image : "../res/nothing.png" } />
                <div className="card-type">
                    <div id="cardPreviewType" style={{
                        float: "left",
                        width: "50%",
                        textAlign: "left"
                    }}>{cardObj.type + ((cardObj.subtype != null && cardObj.subtype.length > 0) ? " - " + cardObj.subtype : "")}</div>
                    <div id="cardPreviewRarity" style={{
                        float: "right",
                        width: "50%",
                        textAlign: "right"
                    }}>{cardObj.rarity}</div>
                </div>
                <div id="cardPreviewText" className="card-text flow-text">
                    <ReactMarkdown escapeHtml={false} source={cardObj.text} />
                </div>
                <div id="cardPreviewArtist" className="card-artist">{cardObj.artist}</div>
                <div id="cardPreviewStats" style={{
                    display: (cardObj.power != null && cardObj.health != null && !isNaN(cardObj.power) && !isNaN(cardObj.health)) ? "initial" : "none"
                }} className="card-stats">{cardObj.power + "/" + cardObj.health}</div>
            </div>
        </div>
    );
};

export default PreviewCard;