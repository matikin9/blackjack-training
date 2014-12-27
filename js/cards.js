var Suits = [ "S", "H", "C", "D" ];
var Faces = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ];
var Deck = [];

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
    var result = "";

    hand.cards.forEach(function (card) {
        result += card.suit.toString() + card.face.toString() + " ";
    });

    return result;
}

function createDeck(num) {
    var results = [];

    while (num > 0) {
        Suits.forEach(function (suit) {
            Faces.forEach(function (face) {
                results.push(createCard(suit, face, Math.random()));
            });
        });
        num--;
    }

    results.sort(sortByNum);
    return results;
}