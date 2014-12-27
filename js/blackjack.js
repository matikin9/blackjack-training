var Dealer = {};
var Player = {};
var Deck = [];
var activeStrategy = createStrategy(strat1);
var GameOver = false;

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

        return result.sort(function (a, b) {
            return b - a;
        });
    };

    this.isBlackjack = function () {
        if (this.cards.length != 2) {
            return false;
        } else {
            if ((this.cards[0].faceValue === "A" && this.cards[1].faceValue === "T") ||
            (this.cards[0].faceValue === "T" && this.cards[1].faceValue === "A")) {
                return true;
            } else {
                return false;
            }
        }
    };

    this.isPair = function () {
        if (this.cards.length != 2) {
            return false;
        } else {
            if (this.cards[0].faceValue === this.cards[1].faceValue) {
                return true;
            } else {
                return false;
            }
        }
    };

    this.hasAce = function () {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].faceValue === "A") {
                return i;
            }
        }
        return -1;
    };
}

function endGame(endResult) {
    $("button#hit").prop('disabled', true);
    $("button#stay").prop('disabled', true);
    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);
    $("button#deal").prop('disabled', false);

    showDealerHand(Dealer.hands[0]);
    showPlayerHand(Player.hands[0]);
    $("span#gameResults").html(endResult);
    GameOver = true;
}

function dealGame() {
    Deck = createDeck(1);
    GameOver = false;
    $("span#gameResults").html("");

    var hand1 = [];
    var hand2 = [];

    hand1.push(Deck.shift());
    hand2.push(Deck.shift());
    hand1.push(Deck.shift());
    hand2.push(Deck.shift());

    Dealer = new Entity(new Hand(0, hand1));
    Player = new Entity(new Hand(0, hand2));

    // Only show dealer's first card when dealing:
    $("#dealerHand").html("Dealer's hand: " + Dealer.hands[0].cards[0].suit.toString() + Dealer.hands[0].cards[0].face.toString());
    showPlayerHand(Player.hands[0]);

    if (Dealer.hands[0].isBlackjack()) {
        if (Player.hands[0].isBlackjack()) {
            endGame("Tie!");
        } else {
            endGame("Blackjack! Dealer wins!");
        }
    } else if (Player.hands[0].isBlackjack()) {
        if (Dealer.hands[0].isBlackjack()) {
            endGame("Tie!");
        } else {
            endGame("Blackjack! Player wins!");
        }
    } else {
        $("button#deal").prop('disabled', true);
        $("button#hit").prop('disabled', false);
        $("button#stay").prop('disabled', false);
        $("button#double").prop('disabled', false);
    }

    if (Player.hands[0].isPair()) {
        $("button#split").prop('disabled', false);
    }
}

function hitPlayer(i) {
    Player.hands[i].cards.push(Deck.shift());

    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);

    showPlayerHand(Player.hands[i]);

    var result = Player.hands[i].validSums();

    if (result.length === 0) {
        endGame("Player busts, Dealer wins!");
    } else {
        console.log("Sums: " + result)
    }
}

function showHand(entity) {
    var selector;
    var hand;
    var sum;

    if (entity === "Player") {
        selector = "#playerHand";
        hand = Player.hands[0];
    } else {
        selector = "#dealerHand";
        hand = Dealer.hands[0];
    }

    sum = hand.validSums();
    if (sum.length === 0) {
        sum = "bust";
    } else if (sum.length > 1) {
        sum = sum[0];
    }
    $(selector).html(entity + "'s hand: " + displayFullHand(hand) + "(" + sum + ")");
}

function showDealerHand(hand) {
    showHand("Dealer");
    /*
    var results = displayFullHand(hand);

    $("#dealerHand").html("Dealer's hand: " + results);
    showSum("Dealer");
    */
}

function showPlayerHand(hand) {
    showHand("Player");
    /*
    var results = displayFullHand(hand);

    $("#playerHand").html("Player's hand: " + results);
    showSum("Player");
    */
}

function showValidAction() {
    var validAction;
    validAction = activeStrategy.getValidAction(Dealer.hands[0].cards[0], Player.hands[0]);
    $('#debug').append("<p>" + validAction + "</p>");
}

function showSum(entity) {
    if (entity === "Player") {
        $("#playerHand").append("(sum)");
    } else {
        $("#dealerHand").append("(sum)");
    }
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
        endGame("Dealer busts, Player wins.");
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
                endGame("Player wins!");
                break;
            case "tie":
                endGame("Tie!");
                break;
            case "lose":
                endGame("Dealer wins!");
                break;
            default:
                return;
        }        
    }
}

function playDouble(i) {
    Player.hands[i].cards.push(Deck.shift());
    showPlayerHand(Player.hands[i]);
    endPlayerTurn();

    var result = Player.hands[i].validSums();

    if (result.length == 0) {
        endGame("Player busts, Dealer wins!");
        return;
    } else {
        playDealerHand();
    }
}

function playSplit(i) {
    
}

$(this).keyup(function (e) {
    switch (e.which) {
    case 72:
    alert("Hit");
    break;
    case 83:
    alert("Stay");
    break;
    case 68:
    alert("Double");
    break;
    case 80:
    alert("Split");
    break;
    case 32:
    alert("Deal");
    break;
    default:
    // nothing
    }
});

$("button#deal").click(function () {
    $('#debug').empty();
    dealGame();
    
    if (!GameOver) {
        showValidAction();
    }
});

$("button#hit").click(function () {
    hitPlayer(0); // i = which hand to hit.
    if (!GameOver) {
        showValidAction();
    }
});

$("button#stay").click(function () {
    endPlayerTurn();
    playDealerHand();
});

$("button#double").click(function () {
    playDouble(0); // i = which hand to double
});

$("button#split").click(function () {
    playSplit(0);
});

$("button#chart").click(function () {
    $(".strategy-chart").toggle();
});

$().ready(function () {
    $("button#hit").prop('disabled', true);
    $("button#stay").prop('disabled', true);
    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);

    $("#dealerHand").html("Dealer's hand: ");
    $("#playerHand").html("Player's hand: ");

    displayStrategy(activeStrategy);
    //$(".strategy-chart").hide();

});
