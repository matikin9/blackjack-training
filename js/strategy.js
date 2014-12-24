var dealerCards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "A"];
var playerHard = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
var playerSoft = [13, 14, 15, 16, 17, 18, 19, 20, 21];
var playerPair = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "A"];

function buildTable(s, player) {
    var rows = s.split(";");
    var obj = {};

    for (var i = 0; i < rows.length; i++) {
        var values = rows[i].split(",");
        obj[player[i]] = {};

        for (var j = 0; j < values.length; j++) {
            var value = values[j];
            obj[player[i]][dealerCards[j]] = value;
        }
    }

    return obj;
}

function createStrategy(stratsource) {
    var strat = new Object();

    // tables are objects[player][dealer]
    strat.hardTable = buildTable(stratsource.hard, playerHard);
    strat.softTable = buildTable(stratsource.soft, playerSoft);
    strat.pairTable = buildTable(stratsource.pair, playerPair);

    strat.getValidAction = function (dealerCard, playerHand) {
        var result;
        var dealerCardValue;
        var playerHandValue1;
        var playerHandValue2;

        if (dealerCard.face === "J" || dealerCard.face === "Q" || dealerCard.face === "K") {
            dealerCardValue = "T";
        } else {
            dealerCardValue = dealerCard.face;
        }

        


        if (playerHand.isPair()) {
            // use Pair table
            result = strat.pairTable[playerHand.cards[0].face][dealerCardValue];
        } else {
            var ace = playerHand.hasAce();
            if (ace >= 0) {
                // use Soft table
                result = strat.softTable[playerHand.cards[0].face][dealerCardValue];
            } else {
                // use Hard table
                result = strat.HardTable[playerHand.cards[0].face][dealerCardValue];
            }
        }

        return result;
    };

    return strat;
}

