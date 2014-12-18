var Dealer = {};
var Player = {};
var Deck = [];

function Entity(hand) {
    this.hands = [];
    this.hands.push(hand);
}

function Hand(bet, cards) {
    this.cards = cards;
    this.bet = bet;

    this.validSums = function () {
        var result = [0];

        this.cards.forEach(function (card) {
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
    };

    this.isBlackjack = function () {
        if (this.cards.length != 2) {
            return false;
        } else {
            switch (this.cards[0].face) {
                case "A":
                    switch (this.cards[1].face) {
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
                    if (this.cards[1].face === "A") {
                        return true;
                    } else {
                        return false;
                    }
                default:
                    return false;
            }
        }
    };

    this.isPair = function () {
        if (this.cards.length != 2) {
            return false;
        } else {
            switch (this.cards[0].face) {
                case "T":
                case "J":
                case "Q":
                case "K":
                    switch (this.cards[1].face) {
                        case "T":
                        case "J":
                        case "Q":
                        case "K":
                            return true;
                        default:
                            return false;
                    }
                default:
                    if (this.cards[0].face === this.cards[1].face) {
                        return true;
                    } else {
                        return false;
                    }
            }
        }
    };
}

function dealGame() {
    Deck = createDeck(1);

    var hand1 = [];
    var hand2 = [];

    hand1.push(Deck.shift());
    hand2.push(Deck.shift());
    hand1.push(Deck.shift());
    hand2.push(Deck.shift());

    Dealer = new Entity(new Hand(0, hand1));
    Player = new Entity(new Hand(0, hand2));

    showDealerHand(Dealer.hands[0]);
    showPlayerHand(Player.hands[0]);

    if (Dealer.hands[0].isBlackjack()) {
        $("span#gameResults").html("Blackjack! Dealer wins!");

    } else if (Player.hands[0].isBlackjack()) {
        $("span#gameResults").html("Blackjack! Player wins!");

    } else {
        $("button#deal").prop('disabled', true);
        $("button#hit").prop('disabled', false);
        $("button#stay").prop('disabled', false);
        $("button#double").prop('disabled', false);
        $("span#gameResults").html("");
    }

    if (Player.hands[0].isPair()) {
        $("button#split").prop('disabled', false);
        $("span#gameResults").html("");
    }
}

function hitPlayer(i) {
    Player.hands[i].cards.push(Deck.shift());

    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);

    showPlayerHand(Player.hands[i]);

    var result = Player.hands[i].validSums();

    if (result.length === 0) {
        $("span#gameResults").html("Player busts, Dealer wins!");
        $("button#deal").prop('disabled', false);
        $("button#hit").prop('disabled', true);
        $("button#stay").prop('disabled', true);
    } else {
        console.log("Sums: " + result)
    }
}

function showDealerHand(hand) {
    var results = displayFullHand(hand);

    $("#dealerHand").html("Dealer's hand: " + results);
}

function showPlayerHand(hand) {
    var results = displayFullHand(hand);

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
    var dealerValidSums = Dealer.hands[0].validSums();
    var dealerDone = false;
    // if any valid sum is 17 or greater, stay.

    while (!dealerDone) {
        if (dealerValidSums.length == 0) {
            dealerDone = true;
        } else {
            dealerValidSums.forEach(function (value) {
                if (value >= 17) {
                    dealerDone = true;
                }
            });
        }

        if (dealerDone) {
            break;
        } else {
            Dealer.hands[0].cards.push(Deck.shift());
            dealerValidSums = Dealer.hands[0].validSums();
            showDealerHand(Dealer.hands[0]);
        }
    }
    
    if (dealerValidSums.length == 0) {
        $("span#gameResults").html("Dealer busts, Player wins.");
    } else {
        var playerSums = Player.hands[0].validSums(); // ONLY COMPARES THE FIRST HAND
        var dealerSums = Dealer.hands[0].validSums();
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

function playDouble(i) {
    Player.hands[i].cards.push(Deck.shift());
    showPlayerHand(Player.hands[i]);

    var result = Player.hands[i].validSums();

    if (result.length == 0) {
        $("span#gameResults").html("Player busts, Dealer wins!");
        return;
    } else {
        playDealerHand();
    }
}

function playSplit(i) {
    
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
        hitPlayer(0); // i = which hand to hit.
    });

    $("button#stay").click(function () {
        endPlayerTurn();
        playDealerHand();
    });

    $("button#double").click(function () {
        playDouble(0); // i = which hand to double
        endPlayerTurn();
    });

    $("button#split").click(function () {
        playSplit(0);
    });

    $("#dealerHand").html("Dealer's hand: ");
    $("#playerHand").html("Player's hand: ");
});