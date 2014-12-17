var suits = [ "S", "H", "C", "D" ];
var faces = [
["A", [1, 11]],
["2",[2]],
["3",[3]],
["4",[4]],
["5",[5]],
["6",[6]],
["7",[7]],
["8",[8]],
["9",[9]],
["T",[10]],
["J",[10]],
["Q",[10]],
["K",[10]]
];

function SortByNum(a, b) {
    var aNum = a.number;
    var bNum = b.number;
    return ((aNum < bNum) ? -1 : (aNum > bNum) ? 1 : 0);
}

function createCard(suit, face, num) {
    var card = new Object();
    card.suit = suit;
    card.face = face[0];
    card.value = face[1];
    card.number = num;
    return card;
}

function createDeck() {
    var cards = [];
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < faces.length; j++) {
            cards.push(createCard(suits[i], faces[j], Math.random()));
        }
    }
    cards.sort(SortByNum);
    return cards;
}



$().ready(function () {
    var deck = createDeck();
    $("#debug").html("first card: " + deck[0].suit + deck[0].face);
});
