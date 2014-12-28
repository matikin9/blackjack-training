var Suits = [ "S", "H", "C", "D" ];
var Faces = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ];
var Deck = [];
var SpriteArray;
var SpriteImagePath = "assets/playingCards.png";
var SpriteXMLPath = "assets/playingCards.xml";

function sortByNum(a, b) {
    var aNum = a.sortNumber;
    var bNum = b.sortNumber;
    return ((aNum < bNum) ? -1 : (aNum > bNum) ? 1 : 0);
}

function createCard(suit, face, sortNumber) {
    var card = new Object();
    card.suit = suit;
    card.face = face;
    card.sortNumber = sortNumber;

    switch (face) {
        case "J":
        case "Q":
        case "K":
            card.faceValue = "T";
            break;
        default:
            card.faceValue = card.face;
    }

    return card;
}

function displayFullHand(hand) {
    var $hand = $('<div></div>');

    hand.cards.forEach(function (card) {
        var $wrapper = $('<div class="clipWrapper"></div>')
        var $cardImg = $('<img src="' + SpriteImagePath + '" class="clip" />');
        var cardLabel = card.suit.toString() + card.face.toString();
        var cardSprite = SpriteArray[cardLabel];
        var top = parseInt(cardSprite.y);
        var bottom = parseInt(cardSprite.y) + parseInt(cardSprite.height);
        var left = parseInt(cardSprite.x);
        var right = parseInt(cardSprite.x) + parseInt(cardSprite.width);
        $cardImg.css('clip', 'rect(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px)');
        $cardImg.css('left', -1 * left);
        $cardImg.css('top', -1 * top);
        $wrapper.append($cardImg);
        $hand.append($wrapper);
    });

    return $hand;
}

function handleCardSprite(obj, name) {
    SpriteArray[name] = obj;
}

function createDeck(num) {
    var results = [];

    while (num > 0) {
        Suits.forEach(function (suit) {
            Faces.forEach(function (face) {
                var card = createCard(suit, face, Math.random());
                results.push(card);
            });
        });
        num--;
    }

    results.sort(sortByNum);
    return results;
}