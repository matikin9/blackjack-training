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
    var total = [0, 0];
    for (var c in DealerHand) {
        if (DealerHand[c].value.length === 2) {
            total[0] += DealerHand[c].value[0];
            total[1] += DealerHand[c].value[1];
        } else {
            total[0] += DealerHand[c].value[0];

            if (total[1] != 0) {
                total[1] += DealerHand[c].value[0];
            }
        }
    }

    var result = "";
    for (var v in total) {
        if (total[v] != 0) {
            result += total[v].toString() + " ";
        }
    }
    $("#dealerSum").html(result);
}

function showPlayerSum() {
    var total = [0, 0];
    for (var c in PlayerHand) {
        if (PlayerHand[c].value.length === 2) {
            total[0] += PlayerHand[c].value[0];
            total[1] += PlayerHand[c].value[1];
        } else {
            total[0] += PlayerHand[c].value[0];

            if (total[1] != 0) {
                total[1] += PlayerHand[c].value[0];
            }
        }
    }

    var result = "";
    for (var v in total) {
        if (total[v] != 0) {
            result += total[v].toString() + " ";
        }
    }
    $("#playerSum").html(result);
}

function CheckActions() {
    // if dealer has blackjack, end game
    // if player has blackjack, end game
    // if player has over 21, end game

}

function Ones(value) {
    return value + 1;
}

function Elevens(value) {
    return value + 11;
}

function GetPossibleSums(hand) {
    // return valid sums based on current hand
    var result = [0];

    hand.forEach(function (card) {
        var newResult = [];

        switch (card.face) {
            case "A":
                var ones = result.map(Ones);
                var elevens = result.map(Elevens);

                ones.forEach(function (value) {
                    if (value <= 21) {
                        newResult.push(value);
                    }
                });
                elevens.forEach(function (value) {
                    if (value <= 21) {
                        newResult.push(value);
                    }
                })

                break;
            case "T":
            case "J":
            case "Q":
            case "K":
                result.forEach(function (n) {
                    newResult.push(n + 10);
                });
                break;
            default:
                result.forEach(function (n) {
                    newResult.push(n + Number(card.face))
                })

        };

        result = newResult;
    });

    return result;
}

$().ready(function () {
    createDeck();
    debugShowNextTwoCards();

    $("button#deal").click(function () {
        dealGame();
        showDealerSum();
        showPlayerSum();
    });

    $("button#hit").click(function () {
        hitPlayer();
        showDealerSum();
        showPlayerSum();
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
