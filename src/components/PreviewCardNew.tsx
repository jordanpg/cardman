import React, { useRef, Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { Text } from '@vx/text';

import './PreviewCardNew.css';
import { card } from 'ionicons/icons';


interface PreviewCardProps {
    cardObj: Cardman.Card,
    scale?: number
}

class PreviewCardNew extends Component<PreviewCardProps> {
    textRef: React.RefObject<SVGTextElement>
    loreRef: React.RefObject<SVGTextElement>

    constructor(props: PreviewCardProps)
    {
        super(props);

        this.textRef = React.createRef();
        this.loreRef = React.createRef();
    }

    render()
    {
        const cardObj = this.props.cardObj;
        const scale = this.props.scale;

        let seriesLine =  (isNaN(cardObj.seriesId) ? 0 : cardObj.seriesId).toString().padStart(3, '0') + '/' +
                            (isNaN(cardObj.seriesTotal) ? 0 : cardObj.seriesTotal).toString().padStart(3, '0')

        if(seriesLine === '000/000') seriesLine = '';

        return (
            <div id="cardPreview" style={{
                margin: "auto",
                transform: "scale(" + (scale ? scale : 1) + ")",
                transformOrigin: "top"
            }}>
                <svg overflow="visible" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="750" height="1050" viewBox="0 0 750 1050" fill="none">
                    <g id="card 4">
                        <rect x="9.375" y="9.375" width="731.25" height="1031.25" rx="28.125" fill={'url(#paint_' + cardObj.color} />
                        <g id="textContainer">
                            <path id="description bg" fillRule="evenodd" clipRule="evenodd" d="M690 609C690 606.791 688.209 605 686 605H64C61.7909 605 60 606.791 60 609V945C60 947.209 61.7909 949 64 949H263.627C265.462 949 267.062 950.249 267.507 952.03L274.243 978.97C274.688 980.751 276.288 982 278.123 982H471.877C473.712 982 475.312 980.751 475.757 978.97L482.493 952.03C482.938 950.249 484.538 949 486.373 949H686C688.209 949 690 947.209 690 945V609Z" fill="#F2F2F2" />
                            <g id="stats" clipPath="url(#clip0)" display={(cardObj.power != null && cardObj.health != null && !isNaN(cardObj.power) && !isNaN(cardObj.health)) ? "initial" : "none"}>
                                <text id="health" fill="black" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="32" fontWeight="bold" letterSpacing="0em"><tspan x="394.171" y="956.938">{(!isNaN(cardObj.health) && cardObj.health != null) ? cardObj.health.toString() : ''}</tspan></text>
                                <text id="|" fill="black" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="44" fontWeight="bold" letterSpacing="0em"><tspan x="369.436" y="958.039">|</tspan></text>
                                <text id="power" fill="black" xmlSpace="preserve" textAnchor="end" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="32" fontWeight="bold" letterSpacing="0em"><tspan x="352.071" y="956.938">{(!isNaN(cardObj.health) && cardObj.power != null) ? cardObj.power.toString() : ''}</tspan></text>
                            </g>
                            <foreignObject x={76} y={621} width={598} height={216}>
                                <style dangerouslySetInnerHTML={{__html: 'p { margin:0;}'}} />
                                <p style={{
                                    margin: 0,
                                    fill: "black",
                                    color: "black",
                                    whiteSpace: "pre-wrap",
                                    fontFamily: "Roboto",
                                    fontSize: 30,
                                    letterSpacing: "0em"
                                }}><ReactMarkdown escapeHtml={false} source={cardObj.text} /></p>
                            </foreignObject>
                            <foreignObject x={76} y={837} width={598} height={79}>
                                <p style={{
                                    margin: 0,
                                    color: "#525868",
                                    fill: "#525868",
                                    whiteSpace: "pre-wrap",
                                    fontFamily: "Roboto",
                                    fontSize: 30,
                                    fontStyle: "italic",
                                    letterSpacing: "0em"
                                }}>{cardObj.lore}</p>
                            </foreignObject>
                            <text id="copyright" fill="#F2F2F2" xmlSpace="preserve" textAnchor="end" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="24" letterSpacing="0em"><tspan x="690" y="1014.2">Mochi Games 2020</tspan></text>
                            <text id="seriesName" fill="#F2F2F2" xmlSpace="preserve" textAnchor="end" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="24" letterSpacing="0em"><tspan x="690" y="986.203">{cardObj.series}</tspan></text>
                            <text id="illustrator" fill="#F2F2F2" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="24" fontStyle="italic" letterSpacing="0em"><tspan x="60" y="1014.2">{'Illus. ' + (cardObj.artist ? cardObj.artist : 'anonymous')}</tspan></text>
                            <text id="seriesNumber" fill="#F2F2F2" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="24" letterSpacing="0em"><tspan x="60" y="986.203">{seriesLine}</tspan></text>
                        </g>
                        <g id="typeContainer">
                            <rect width="630" height="60" rx="4" transform="matrix(1 0 0 -1 60 590)" fill="#F2F2F2" />
                            <text id="rarity" fill="black" textAnchor="end" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="30" letterSpacing="0em"><tspan x="674" y="570.254">{cardObj.rarity}</tspan></text>
                            <text id="type" fill="black" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="30" fontStyle="italic" letterSpacing="0em"><tspan x="76" y="570.254">{cardObj.type + ((cardObj.subtype != null && cardObj.subtype.length > 0) ? " - " + cardObj.subtype : "")}</tspan></text>
                        </g>
                        <g id="imageContainer">
                            <mask id="path-15-inside-1" fill="white">
                                <rect x="60" y="135" width="630" height="380" rx="4" />
                            </mask>
                            <rect x="60" y="135" width="630" height="380" rx="4" fill="#F2F2F2" />
                            <rect id="image" x="60" y="135" width="630" height="380" fill="url(#pattern0)" />
                            <rect x="60" y="135" width="630" height="380" rx="4" stroke="#F2F2F2" strokeWidth="9.38" mask="url(#path-15-inside-1)" />
                        </g>
                        <g id="nameContainer">
                            <rect width="630" height="60" rx="4" transform="matrix(1 0 0 -1 60 120)" fill="#F2F2F2" />
                            <text id="manaCost" textAnchor="end"  fill="black" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="36" letterSpacing="0em"><tspan x="674" y="102.305">{cardObj.manaCost}</tspan></text>
                            <text id="name" fill="black" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Roboto" fontSize="36" fontWeight="bold" letterSpacing="0em"><tspan x="76" y="102.305">{cardObj.name}</tspan></text>
                        </g>
                        <rect x="9.375" y="9.375" width="731.25" height="1031.25" rx="28.125" stroke="black" strokeWidth="18.75" />
                    </g>
                    <defs>
                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlinkHref="#image0" transform="translate(0 -0.324447) scale(0.00108578 0.0018001)" />
                        </pattern>
                        <linearGradient id="paint_Colorless" x1="4585" y1="0" x2="4585" y2="1050" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#C6CEDA"/>
                            <stop offset="1" stopColor="#7D7F91"/>
                        </linearGradient>
                        <linearGradient id="paint_Green" x1="3743" y1="0" x2="3743" y2="1050" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#83D75C"/>
                            <stop offset="1" stopColor="#2D8A31"/>
                        </linearGradient>
                        <linearGradient id="paint_Blue" x1="2901" y1="0" x2="2901" y2="1050" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#3BA0FD"/>
                            <stop offset="1" stopColor="#3B42F4"/>
                        </linearGradient>
                        <linearGradient id="paint_Red" x1="2059" y1="0" x2="2059" y2="1050" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FC7C34"/>
                            <stop offset="1" stopColor="#DD342F"/>
                        </linearGradient>
                        <linearGradient id="paint_Yellow" x1="1217" y1="0" x2="1217" y2="1050" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F9D65B"/>
                            <stop offset="1" stopColor="#FC7C34"/>
                        </linearGradient>
                        <linearGradient id="paint_Purple" x1="375" y1="0" x2="375" y2="1050" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#9145CD" />
                            <stop offset="1" stopColor="#5435AD" />
                        </linearGradient>
                        <clipPath id="clip0">
                            <rect width="194" height="60" fill="white" transform="matrix(1 0 0 -1 278 976)" />
                        </clipPath>
                        <image id="image0" width="921" height="916" xlinkHref={ (cardObj.image !== null) ? cardObj.image : "../res/nothing.png" } />
                    </defs>
                </svg>
            </div>
        );
    }
}

export default PreviewCardNew;