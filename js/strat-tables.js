/*

Parameters:
1. Number of decks      integer
2. Stay on Soft 17      true/false
3. Double After Split   true/false
4. Surrender            true/false
5. Dealer Peeks         true/false
6. Which Table          "hard"/"soft"/"pair"

Table values:
H   Hit
S   Stand
P   Split
DH  Double/Hit
DS  Double/Stay
RH  Surrender/Hit

*/

/*
1. Number of decks      1
2. Stay on Soft 17      true
3. Double After Split   true
4. Surrender            false
5. Dealer Peeks         true
*/
var strat1 = {
    hard: "H,H,H,H,H,H,H,H,H,H;H,H,H,H,H,H,H,H,H,H;H,H,H,H,H,H,H,H,H,H;H,H,H,DH,DH,H,H,H,H,H;DH,DH,DH,DH,DH,H,H,H,H,H;DH,DH,DH,DH,DH,DH,DH,DH,H,H;DH,DH,DH,DH,DH,DH,DH,DH,DH,DH;H,H,S,S,S,H,H,H,H,H;S,S,S,S,S,H,H,H,H,H;S,S,S,S,S,H,H,H,H,H;S,S,S,S,S,H,H,H,H,H;S,S,S,S,S,H,H,H,H,H;S,S,S,S,S,S,S,S,S,S;S,S,S,S,S,S,S,S,S,S;S,S,S,S,S,S,S,S,S,S;S,S,S,S,S,S,S,S,S,S;S,S,S,S,S,S,S,S,S,S",
    soft: "H,H,DH,DH,DH,H,H,H,H,H;H,H,DH,DH,DH,H,H,H,H,H;H,H,DH,DH,DH,H,H,H,H,H;H,H,DH,DH,DH,H,H,H,H,H;DH,DH,DH,DH,DH,H,H,H,H,H;S,DS,DS,DS,DS,S,S,H,H,S;S,S,S,S,DS,S,S,S,S,S;S,S,S,S,S,S,S,S,S,S;S,S,S,S,S,S,S,S,S,S",
    pair: "P,P,P,P,P,P,H,H,H,H;P,P,P,P,P,P,P,H,H,H;H,H,P,P,P,H,H,H,H,H;DH,DH,DH,DH,DH,DH,DH,DH,H,H;P,P,P,P,P,P,H,H,H,H;P,P,P,P,P,P,P,H,S,H;P,P,P,P,P,P,P,P,P,P;P,P,P,P,P,S,P,P,S,S;S,S,S,S,S,S,S,S,S,S;P,P,P,P,P,P,P,P,P,P"
};
