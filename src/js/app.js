const rastHTML = require('rasterizehtml');

const cardExample = {
    name: "Kirby",
    color: "red",
    manaCost: "2RR",
    image: "https://s.pacn.ws/640/yi/kirbys-dream-land-all-star-collection-plush-kirby-suyasuya-s-621021.1.jpg?q59xm2",
    type: "Creature",
    subtype: "Baby",
    rarity: "Mythic",
    text: "When this creature enters into play, pet him softly. You will give him treats and treat him right. You will not mistreat this creature. This creature is indestructible and hexproof."
};

var card = {
    name: $('#cardName').val(),
    color: $('#cardColor').val(),
    manaCost: $('#cardMana').val(),
    image: null,
    type: $('#cardType').val(),
    subtype: $('#cardSubtype').val(),
    rarity: $('#cardRarity').val(),
    text: $('#cardText').val(),
    artist: $('#cardArtist').val(),
    power: $('#cardPower').val(),
    health: $('#cardHealth').val()
};

function previewCard(cardObj)
{
    $('#cardPreviewName').html(cardObj.name);
    $('#cardPreview').attr('class', 'card ' + cardObj.color);
    // TODO: Add icons for mana
    $('#cardPreviewMana').html(cardObj.manaCost);
    $('#cardPreviewType').html(cardObj.type + (cardObj.subtype ? " - " + cardObj.subtype : ""));
    $('#cardPreviewRarity').html(cardObj.rarity);
    $('#cardPreviewText').text(cardObj.text);
    $('#cardPreviewImage').attr('src', (cardObj.image ? cardObj.image : "./res/nothing.png"));
    $('#cardPreviewArtist').text(cardObj.artist);
    if(cardObj.power && cardObj.health)
        $('#cardPreviewStats').attr('style','').text(cardObj.power + ' / ' + cardObj.health);
    else
        $('#cardPreviewStats').attr('style','display:none;').text('');
}

function renderCard()
{
    var canvas = document.getElementById("cardCanvas");
    var head = $('head').prop('outerHTML');
    var input = head + $('#cardPreview').prop('outerHTML');

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    rastHTML.drawHTML(input, canvas).then((r) => {
        let button = document.createElement("a");
        button.href = canvas.toDataURL("image/png");
        button.download = card.name + '.png';
        button.click();
    }).catch((e) => {
        console.error(e);
    });
}

function buildCard()
{
    card = {
        name: $('#cardName').val(),
        color: $('#cardColor').val(),
        manaCost: $('#cardMana').val(),
        image: null,
        type: $('#cardType').val() || "",
        subtype: $('#cardSubtype').val(),
        rarity: $('#cardRarity').val() || "",
        text: $('#cardText').val(),
        artist: $('#cardArtist').val(),
        power: $('#cardPower').val(),
        health: $('#cardHealth').val()
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
}

$(document).ready(function () {
    // Access the DOM elements here...

    $('select').formSelect();

    $('#cardSave').click(() => {
        renderCard();
    });

    // $('#cardGenerate').click(buildCard);

    $('input').on('change', buildCard).on('keyup', buildCard);
    $('textarea').on('keyup', buildCard);
    $('select').change(buildCard);
});