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
        var dealerCardValue = dealerCard.faceValue;
        var playerHandValue;
        var playerHandValues = playerHand.validSums();

        playerHandValue = playerHandValues[0]; // Takes highest value

        if (playerHand.isPair()) {
            // use Pair table
            result = this.pairTable[playerHand.cards[0].faceValue][dealerCardValue];
        } else {
            var ace = playerHand.hasAce();
            if (ace >= 0) {
                // use Soft table
                result = this.softTable[playerHandValue][dealerCardValue];
            } else {
                // use Hard table
                result = this.hardTable[playerHandValue][dealerCardValue];
            }
        }

        return result;
    };

    return strat;
}

function displayStrategy(stratObject) {
    displayStrategyTable(stratObject.hardTable, 'hard');
    displayStrategyTable(stratObject.softTable, 'soft');
    displayStrategyTable(stratObject.pairTable, 'pair');

    /*
    $chart_section = $('#strategy-charts');
    
    // Hard table
    $chart_section.append('<table class="table table-condensed strategy-chart hard"></table>');
    var $hard_table = $chart_section.find('table.hard');

    $hard_table.append('<thead><tr></tr></thead>');
    $hard_table.find('thead tr').append('<th scope="col">Hard</th>');
    dealerCards.forEach(function (n) {
        $chart_section.find('thead tr').append('<th scope="col">' + n + '</th>');
    });
    
    $hard_table.append('<tbody></tbody>');
    var $hard_table_body = $hard_table.find('tbody');
    playerHard.forEach(function (playerCard) {
        var rowString = '';
        dealerCards.forEach(function (dealerCard) {
            rowString += '<td>' + stratObject.hardTable[playerCard][dealerCard] + '</td>';
        });
        rowString = '<tr><th scope="row">' + playerCard + '</th>' + rowString + '</tr>'

        $hard_table_body.append(rowString);
    });
    */

}

function displayStrategyTable(stratObjectTable, tableType) {
    var playerCards;
    switch(tableType) {
        case "hard":
            playerCards = playerHard;
            break;
        case "soft":
            playerCards = playerSoft;
            break;
        case "pair":
            playerCards = playerPair;
            break;
        default:
            return;
    }

    $('#strategy-charts').append('<table class="table table-condensed strategy-chart ' + tableType + '-table"></table>');
    var $curr_table = $('#strategy-charts').find('.' + tableType + '-table');

    $curr_table.append('<thead><tr></tr></thead>');
    $curr_table.find('thead tr').append('<th scope="col" class="col-md-1">' + tableType[0].toUpperCase() + tableType.substr(1) + '</th>');
    dealerCards.forEach(function (n) {
        $curr_table.find('thead tr').append('<th scope="col" class="col-md-1">' + n + '</th>');
    });
    
    $curr_table.append('<tbody></tbody>');
    var $curr_table_body = $curr_table.find('tbody');
    playerCards.forEach(function (playerCard) {
        var rowString = '';
        dealerCards.forEach(function (dealerCard) {
            rowString += '<td>' + stratObjectTable[playerCard][dealerCard] + '</td>';
        });

        if (tableType === "pair") {
            rowString = '<tr><th scope="row">' + playerCard + ',' + playerCard + '</th>' + rowString + '</tr>'
        } else {
            rowString = '<tr><th scope="row">' + playerCard + '</th>' + rowString + '</tr>'
        }
        $curr_table_body.append(rowString);
    });
}