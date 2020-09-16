namespace Cardman {
    type Card =  {
        name: string | undefined,
        color: string,
        manaCost: string | undefined,
        image: string | undefined,
        type: string,
        subtype: string | undefined,
        rarity: string,
        text: string | undefined,
        lore: string | undefined,
        series: string | undefined,
        artist: string | undefined,
        power: number | undefined,
        health: number | undefined,
        seriesId: number | undefined,
        seriesTotal: number | undefined,
        amount?: number | undefined
      };

    type Collection = [ Card ];
}