var Suits = [ "S", "H", "C", "D" ];
var Faces = [ "A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K" ];
var Deck = [];
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
    card.face = face;
    card.number = num;
    return card;
}

function IsBlackjack(hand) {
    if (hand.length != 2) {
        return false;
    } else {
        switch (hand[0].face) {
            case "A":
                switch (hand[1].face) {
                    case "T":
                    case "J":
                    case "Q":
                    case "K":
                        return true;
                    default:
                        return false;
                }
            case "T":
            case "J":
            case "Q":
            case "K":
                if (hand[1].face === "A") {
                    return true;
                } else {
                    return false;
                }
            default:
                return false;
        }
    }
}

function IsPair(hand) {
    if (hand.length != 2) {
        return false;
    } else {
        switch (hand[0].face) {
            case "T":
            case "J":
            case "Q":
            case "K":
                switch (hand[1].face) {
                    case "T":
                    case "J":
                    case "Q":
                    case "K":
                        return true;
                    default:
                        return false;
                }
            default:
                if (hand[0].face === hand[1].face) {
                    return true;
                } else {
                    return false;
                }
        }
    }
}

function ValidSums(hand) {
    var result = [0];

    hand.forEach(function (card) {
        var newResult = [];
        switch (card.face) {
            case "A":
                result.forEach(function (value) {
                    if (value + 1 <= 21) {
                        newResult.push(value + 1);

                        if (value + 11 <= 21) {
                            newResult.push(value + 11);
                        }
                    }
                    
                });
                break;
            case "T":
            case "J":
            case "Q":
            case "K":
                result.forEach(function (value) {
                    if (value + 10 <= 21) {
                        newResult.push(value + 10);
                    }
                });
                break;
            default:
                result.forEach(function (value) {
                    if (value + Number(card.face) <= 21) {
                        newResult.push(value + Number(card.face));
                    }
                });

        }
        result = newResult;
    });

    return result;
}

function createDeck() {
    Deck = [];
    DealerHand = [];
    PlayerHand = [];

    Suits.forEach(function (suit) {
        Faces.forEach(function (face) {
            Deck.push(createCard(suit, face, Math.random()));
        });
    });

    Deck.sort(SortByNum);
}

function dealGame() {
    createDeck();

    DealerHand.push(Deck.shift());
    PlayerHand.push(Deck.shift());

    DealerHand.push(Deck.shift());
    PlayerHand.push(Deck.shift());
    
    showDealerHand();
    showPlayerHand();

    if (IsBlackjack(DealerHand)) {
        $("span#gameResults").html("Blackjack! Dealer wins!");
    } else if (IsBlackjack(PlayerHand)) {
        $("span#gameResults").html("Blackjack! Player wins!");
    } else {
        $("button#deal").prop('disabled', true);
        $("button#hit").prop('disabled', false);
        $("button#stay").prop('disabled', false);
        $("button#double").prop('disabled', false);
        $("span#gameResults").html("");
    }

    if (IsPair(PlayerHand)) {
        $("button#split").prop('disabled', false);
        $("span#gameResults").html("");
    }
    
    console.log(ValidSums(PlayerHand));
}

function hitPlayer() {
    PlayerHand.push(Deck.shift());

    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);

    showDealerHand();
    showPlayerHand();

    var result = ValidSums(PlayerHand);
    if (result.length === 0) {
        $("span#gameResults").html("Player busts, Dealer wins!");
        $("button#deal").prop('disabled', false);
        $("button#hit").prop('disabled', true);
        $("button#stay").prop('disabled', true);
    } else {
        console.log("Sums: " + result)
    }
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

function endPlayerTurn() {
    $("button#hit").prop('disabled', true);
    $("button#stay").prop('disabled', true);
    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);
    $("button#deal").prop('disabled', false);
}

function playDealerHand() {
    var sums = ValidSums(DealerHand);
    var dealerDone = false;
    // if any valid sum is 17 or greater, stay.

    while (!dealerDone) {
        if (sums.length == 0) {
            dealerDone = true;
        } else {
            sums.forEach(function (value) {
                if (value >= 17) {
                    dealerDone = true;
                }
            });
        }

        if (dealerDone) {
            break;
        } else {
            DealerHand.push(Deck.shift());
            sums = ValidSums(DealerHand);
            showDealerHand()
        }
    }
    
    if (sums.length == 0) {
        $("span#gameResults").html("Dealer busts, Player wins.");
    } else {
        var playerSums = ValidSums(PlayerHand);
        var dealerSums = ValidSums(DealerHand);
        var playerResults = "win";

        playerSums.forEach(function (v1) {
            dealerSums.forEach(function (v2) {
                if (v2 > v1) {
                    playerResults = "lose";
                } else if (v2 === v1) {
                    playerResults = "tie";
                }
            });
        });

        switch (playerResults) {
            case "win":
                $("span#gameResults").html("Player wins!");
                break;
            case "tie":
                $("span#gameResults").html("Tie!");
                break;
            case "lose":
                $("span#gameResults").html("Dealer wins!");
                break;
            default:
                return;
        }        
    }
}

$().ready(function () {
    $("button#hit").prop('disabled', true);
    $("button#stay").prop('disabled', true);
    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);

    $("button#deal").click(function () {
        dealGame();
    });

    $("button#hit").click(function () {
        hitPlayer();
    });

    $("button#stay").click(function () {
        endPlayerTurn();
        playDealerHand();
    });

    $("button#double").click(function () {

    });

    $("button#split").click(function () {

    });

    $("#dealerHand").html("Dealer's hand: " + DealerHand);
    $("#playerHand").html("Player's hand: " + PlayerHand);
});
