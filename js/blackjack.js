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

function endGame(result) {
    var resultString = "";

    if (result.indexOf("tie") >= 0) {
        resultString += "* Tie!";
    } else if (result.indexOf("blackjack") >= 0) {
        resultString += "* Blackjack! ";
    } else if (result.indexOf("bust") >= 0){
        resultString += "* Bust! ";
    }

    if (result.indexOf("player") >= 0) {
        resultString += "* Player wins!";
        $('#panel-player').addClass('panel-success');
        $('#panel-player .panel-heading').append(' - WIN!');
        $('#panel-dealer').addClass('panel-danger');
    } else {
        resultString += "* Dealer wins!";
        $('#panel-dealer').addClass('panel-success');
        $('#panel-dealer .panel-heading').append(' - WIN!');
        $('#panel-player').addClass('panel-danger');
    }

    $("button#hit").prop('disabled', true);
    $("button#stay").prop('disabled', true);
    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);
    $("button#deal").prop('disabled', false);

    showDealerHand(Dealer.hands[0], false);
    showPlayerHand(Player.hands[0]);
    // resultString relegated to console since color/panel-heading implementation.
    //$("span#gameResults").html(resultString);
    console.log(resultString);
    GameOver = true;
}

function dealGame() {
    Deck = createDeck(1);
    GameOver = false;
    $("span#gameResults").html("");
    $("#panel-dealer").removeClass("panel-success");
    $("#panel-dealer").removeClass("panel-danger");
    $("#panel-dealer .panel-heading").text("Dealer");
    
    $("#panel-player").removeClass("panel-success");
    $("#panel-player").removeClass("panel-danger");
    $("#panel-player .panel-heading").text("Player");

    var hand1 = [];
    var hand2 = [];

    hand1.push(Deck.shift());
    hand2.push(Deck.shift());
    hand1.push(Deck.shift());
    hand2.push(Deck.shift());

    Dealer = new Entity(new Hand(0, hand1));
    Player = new Entity(new Hand(0, hand2));

    // Only show dealer's first card when dealing:
    //$("#dealerHand").html("Dealer's hand: " + Dealer.hands[0].cards[0].suit.toString() + Dealer.hands[0].cards[0].face.toString());
    
    $("#dealerHand").empty();
    $("#dealerHand").append(displayFirstCard(Dealer.hands[0]));
    
    showPlayerHand(Player.hands[0]);

    if (Dealer.hands[0].isBlackjack()) {
        if (Player.hands[0].isBlackjack()) {
            endGame(["tie"]);
        } else {
            endGame(["blackjack", "dealer"]);
        }
    } else if (Player.hands[0].isBlackjack()) {
        if (Dealer.hands[0].isBlackjack()) {
            endGame(["tie"]);
        } else {
            endGame(["blackjack", "player"]);
        }
    } else {
        $("button#deal").prop('disabled', true);
        $("button#hit").prop('disabled', false);
        $("button#stay").prop('disabled', false);
        $("button#double").prop('disabled', false);
        $("button#split").prop('disabled', true);
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
        endGame(["bust", "dealer"]);
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
    $(selector).empty();
    $(selector).append(displayFullHand(hand));
}

function showDealerHand(hand, first) {
    if (first) {
        
    } else {
        showHand("Dealer");
    }
}

function showPlayerHand(hand) {
    showHand("Player");
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
    showDealerHand(Dealer.hands[0], false);
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
            showDealerHand(Dealer.hands[0], false);
        }
    }
    
    if (dealerValidSums.length == 0) {
        endGame(["bust", "player"]);
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
                endGame(["player"]);
                break;
            case "tie":
                endGame(["tie"]);
                break;
            case "lose":
                endGame(["dealer"]);
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
        endGame(["bust", "dealer"]);
        return;
    } else {
        playDealerHand();
    }
}

function playSplit(i) {
    
}

$(this).keyup(function (e) {
    var $buttonToActivate;

    switch (e.which) {
        case 72:
            $buttonToActivate = $('button#hit');
            break;
        case 83:
            $buttonToActivate = $('button#stay');
            break;
        case 68:
            $buttonToActivate = $('button#double');
            break;
        case 80:
            $buttonToActivate = $('button#split');
            break;
        case 78:
            $buttonToActivate = $('button#deal');
            break;
        default:
            return;
    }

    if (!$buttonToActivate.is(':disabled')) {
        $buttonToActivate.trigger('click');
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
    $("button#deal").hide();
    SpriteArray = new Object();

    $.get(SpriteXMLPath, function (data) {
        $(data).find('SubTexture').each(function () {
            var spriteObj = new Object();
            spriteObj.x = $(this).attr('x');
            spriteObj.y = $(this).attr('y');
            spriteObj.width = $(this).attr('width');
            spriteObj.height = $(this).attr('height');
            handleCardSprite(spriteObj, $(this).attr('name'));
        });
        $("button#deal").show();
    });

    $("button#hit").prop('disabled', true);
    $("button#stay").prop('disabled', true);
    $("button#double").prop('disabled', true);
    $("button#split").prop('disabled', true);

    $("#dealerHand").html("Dealer's hand: ");
    $("#playerHand").html("Player's hand: ");

    displayStrategy(activeStrategy);
    $(".strategy-chart").hide();

});
