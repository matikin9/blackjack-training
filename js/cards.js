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
var deck = [];

var DealerHand = [];
var PlayerHand = [];

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
    for (var i = 0; i < suits.length; i++) {
        for (var j = 0; j < faces.length; j++) {
            deck.push(createCard(suits[i], faces[j], Math.random()));
        }
    }
    deck.sort(SortByNum);
}

function dealGame() {
    DealerHand = [];
    DealerHand.push(deck.shift());

    PlayerHand = [];
    PlayerHand.push(deck.shift());

    debugShowNextTwoCards();

    showDealerHand();
    showPlayerHand();
}

function hitPlayer() {
    PlayerHand.push(deck.shift());
    debugShowNextTwoCards();

    showDealerHand();
    showPlayerHand();
}

function showDealerHand() {
    var results = "";

    for (var c in DealerHand) {
        results += DealerHand[c].suit.toString() + DealerHand[c].face.toString() + " ";
    }

    $("#dealerHand").html("Dealer's hand: " + results);
}

function showPlayerHand() {
    var results = "";

    for (var c in PlayerHand) {
        results += PlayerHand[c].suit.toString() + PlayerHand[c].face.toString() + " ";
    }

    $("#playerHand").html("Player's hand: " + results);
}

function debugShowNextTwoCards() {
    $("#debug").html(deck[0].suit + deck[0].face + " " + deck[1].suit + deck[1].face);
}

function showDealerSum() {
    
}

function showPlayerSum() {
    
}

$().ready(function () {
    createDeck();
    debugShowNextTwoCards();

    $("button#deal").click(function () {
        dealGame();
    });

    $("button#hit").click(function () {
        hitPlayer();
    });

    $("button#stay").click(function () {

    });

    $("button#double").click(function () {

    });

    $("button#split").click(function () {

    });

    $("#dealerHand").html("Dealer's hand: " + DealerHand);
    $("#playerHand").html("Player's hand: " + PlayerHand);
});
