let cardExample = {
    name: "Kirby",
    color: "red",
    manaCost: "2RR",
    image: "https://s.pacn.ws/640/yi/kirbys-dream-land-all-star-collection-plush-kirby-suyasuya-s-621021.1.jpg?q59xm2",
    type: "Creature",
    subtype: "Baby",
    rarity: "Mythic",
    text: "When this creature enters into play, pet him softly. You will give him treats and treat him right. You will not mistreat this creature. This creature is indestructible and hexproof."
};

function previewCard(card)
{
    $('#cardPreviewName').html(card.name);
    $('#cardPreview').attr('class', 'card ' + card.color);
    // TODO: Add icons for mana
    $('#cardPreviewMana').html(card.manaCost);
    $('#cardPreviewType').html(card.type + (card.subtype ? " - " + card.subtype : ""));
    $('#cardPreviewRarity').html(card.rarity);
    $('#cardPreviewText').html(card.text);
    $('#cardPreviewImage').attr('src', (card.image ? card.image : "./res/nothing.png"));
}

$(document).ready(function () {
    // Access the DOM elements here...

    $('select').formSelect();

    $('#cardGenerate').click(() => {
        console.log("Generating Card");

        var card = {
            name: $('#cardName').val(),
            color: $('#cardColor').val(),
            manaCost: $('#cardMana').val(),
            image: null,
            type: $('#cardType').val(),
            subtype: $('#cardSubtype').val(),
            rarity: $('#cardRarity').val(),
            text: $('#cardText').val()
        };

        var input = $('#cardImage');
        if(input.prop('files') && input.prop('files')[0])
        {
            var reader = new FileReader();

            reader.onload = (e) => {
                card.image = e.target.result;

                previewCard(card);
            };

            reader.readAsDataURL(input.prop('files')[0]);
        }

        previewCard(card);
    });
});