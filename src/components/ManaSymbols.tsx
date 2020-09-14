import React, { Component } from 'react';

import './ManaSymbols.css';

import SvgManaGeneric from './Mana/Generic';
import SvgFire from './Mana/Fire';
import SvgWater from './Mana/Water';
import SvgGrass from './Mana/Grass';
import SvgLight from './Mana/Light';
import SvgVoid from './Mana/Void';

export enum ManaSymbolsMode {
    Normal = 0,
    Numbers,
    GenericNumbersOnly
}

interface ManaSymbolsProps {
    cost: string,
    x: number,
    y: number,
    symbolSize: number,
    useNumbersMode?: ManaSymbolsMode
}


type Mana = 'C' | 'R' | 'B' | 'G' | 'Y' | 'P';

export default class ManaSymbols extends Component<ManaSymbolsProps> {
    x: number

    static symbolRegex = /([RGBYP]?)(\d*)/gm;

    static symbolMap: { [S in Mana]: string } = {
        'C': 'assets/symbols/manaGeneric.svg',
        // 'R': 'assets/symbols/manaR.svg',
        // 'B': 'assets/symbols/manaB.svg',
        // 'G': 'assets/symbols/manaG.svg',
        // 'Y': 'assets/symbols/manaY.svg',
        // 'P': 'assets/symbols/manaP.svg'
        'R': 'assets/symbols/fire.svg',
        'B': 'assets/symbols/water.svg',
        'G': 'assets/symbols/grass.svg',
        'Y': 'assets/symbols/light.svg',
        'P': 'assets/symbols/void.svg'
    }

    static symbol2Component: { [S in Mana]: ((props: any) => JSX.Element)} = {
        'C': SvgManaGeneric,
        'R': SvgFire,
        'B': SvgWater,
        'G': SvgGrass,
        'Y': SvgLight,
        'P': SvgVoid
    }

    constructor(props: ManaSymbolsProps)
    {
        super(props)

        this.x = this.props.x - this.props.symbolSize;
    }

    /// Takes in a "fragment" in the format of [full, symbol, count]
    /// and returns an img element containing the appropriate symbol.
    /// For example, ["R2", "R", "2"]
    getSymbolElementFromFragment(fragment: [string, Mana, string | number]): JSX.Element
    {
        // console.log(ManaSymbols.symbolMap[fragment[1]]);

        if(typeof fragment[2] === 'string') fragment[2] = parseInt(fragment[2]);
        if(isNaN(fragment[2])) fragment[2] = 1;

        fragment[2] = Math.max(fragment[2], 1);

        // console.log(fragment[2]);

        if((fragment[1] as string) === '' || fragment[1] == null) fragment[1] = "C";

        if( (this.props.useNumbersMode === ManaSymbolsMode.GenericNumbersOnly && fragment[1] === "C")
            || this.props.useNumbersMode === ManaSymbolsMode.Numbers)
        {
            const textSize = this.props.symbolSize * 0.75;
            return (
                <>
                    {/* <image x={this.x} y={this.props.y} width={this.props.symbolSize} height={this.props.symbolSize} className="manaSymbol" href={ManaSymbols.symbolMap[fragment[1]]} /> */}
                    {ManaSymbols.symbol2Component[fragment[1]]({
                        x: this.x,
                        y: this.props.y,
                        width: this.props.symbolSize,
                        height: this.props.symbolSize,
                        className: "manaSymbol"
                    })}
                    <text fill="black" xmlSpace="preserve" style={{whiteSpace: 'pre'}}  fontFamily="Roboto" fontSize={textSize} fontWeight="bold" letterSpacing="0em">
                        <tspan textAnchor="middle" x={this.x + this.props.symbolSize / 2} y={this.props.y + textSize} textLength={textSize}>{fragment[2]}</tspan>
                    </text>
                    {this.x -= this.props.symbolSize}
                </>
            )
        }

        return (
            <>
                { fragment[1].repeat(fragment[2]).split('').map(symbol => { const a = ManaSymbols.symbol2Component[symbol as Mana]({
                        x: this.x,
                        y: this.props.y,
                        width: this.props.symbolSize,
                        height: this.props.symbolSize,
                        className: "manaSymbol"
                    })
                    
                    // <image x={this.x} y={this.props.y} width={this.props.symbolSize} height={this.props.symbolSize} className="manaSymbol" href={ManaSymbols.symbolMap[symbol as Mana]} />);
                    // console.log(a);
                    this.x -= this.props.symbolSize;
                    return a;
                })}
            </>
        );
    }

    render()
    {
        const str: string = this.props.cost;

        if(str == null) return null;

        const fragments = Array.from(str.toUpperCase().matchAll(ManaSymbols.symbolRegex));
        fragments.pop();

        this.x = this.props.x - this.props.symbolSize;

        return (
            <g className="manaSymbols">
                {fragments.reverse().map(frag => {
                    const r = this.getSymbolElementFromFragment(frag as [string, Mana, number]);
                    // console.log(r);
                    return r;
                })}
            </g>
        );
    }
}