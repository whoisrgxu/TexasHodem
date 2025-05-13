class GameHelper {
    static findBestCards(publicCards, holeCards) {
        const allCards = [...publicCards, ...holeCards];
        const bestHand = this.getBestHand(allCards);
        return bestHand;
    }

    static getCardsNumbers(cards) {
        const cardNumbers = [];
        for (const card of cards) {
            const cardNumber = card.slice(0, -1); // Assuming card is in format "2H", "3D", etc.
            cardNumbers.push(cardNumber);
        }
        cardNumbers.sort((a, b) => a - b); // Sort the ranks numerically
        return cardNumbers;
    }

    static getCardSuits(cards) {
        const cardSuits = [];
        for (const card of cards) {
            const cardSuit = card.slice(-1); // Assuming card is in format "2H", "3D", etc.
            cardSuits.push(cardSuit);
        }
        return cardSuits;
    }

    static determineHandType(cards) {
        const isFlush = this.hasFlush(cards);
        const isStraight = this.hasStraight(cards);
        const isPair = this.hasPair(cards);
        const isThreeOfAKind = this.hasThreeOfAKind(cards);
        const isFourOfAKind = this.hasFourOfAKind(cards);
        const isFullHouse = this.hasFullHouse(cards);
        const isTwoPair = this.hasTwoPair(cards);
        if (isFlush) {
            return "flush";
        } else if (isFourOfAKind) {
            return "fourOfAKind";
        } else if (isFullHouse) {
            return "fullHouse";
        } else if (isStraight) {
            return "straight";
        } else if (isThreeOfAKind) {
            return "threeOfAKind";
        } else if (isTwoPair) {
            return "twoPair";
        } else if (isPair) {
            return "pair";
        } else {
            return "highCard";
        }
    }

    static calculatePoints(cards, type) {
        const cardNumbers = this.getCardsNumbers(cards);
        if (type === "flush") {
            if (type === "straight") {
                return `A${cardNumbers[-1]}`;
            } else
                return `D${cardNumbers[0] * 13000 + cardNumbers[1] * 1300 + cardNumbers[2] * 130 + cardNumbers[3] * 13 + cardNumbers[4]}`;
        } else if (type === "fourOfAKind") {
            const singleCard = cardNumbers[0] === cardNumbers[1] ? cardNumbers[4] : cardNumbers[0];
            return `B${singleCard}`;
        } else if (type === "fullHouse") {
            let threeOfAKindCard, pairCard;
            if (cardNumbers[1] === cardNumbers[2]) {
                threeOfAKindCard = cardNumbers[0];
                pairCard = cardNumbers[3];
            } else {
                threeOfAKindCard = cardNumbers[3];
                pairCard = cardNumbers[0];
            }
            return `C${threeOfAKindCard * 10 + pairCard}`;
        } else if (type === "straight") {
            return `E${cardNumbers[4]}`;
        } else if (type === "threeOfAKind") {
            let threeOfAKindCard;
            if (cardNumbers[1] === cardNumbers[2]) {
                threeOfAKindCard = cardNumbers[0];
            } else {
                threeOfAKindCard = cardNumbers[3];
            }
            return `F${threeOfAKindCard}`;
        } else if (type === "twoPair") {
            let firstPairCard, secondPairCard, singleCard;
            if (cardNumbers[1] === cardNumbers[2]) {
                secondPairCard = cardNumbers[1];
                firstPairCard = cardNumbers[3];
                singleCard = cardNumbers[0];
            } else {
                firstPairCard = cardNumbers[3];
                secondPairCard = cardNumbers[0];
                singleCard = cardNumbers[2] === cardNumbers[3] ? cardNumbers[4] : cardNumbers[2];
            }
            return `G${firstPairCard * 130 + secondPairCard * 13 + singleCard}`;
        } else if (type === "pair") {
            let pairCard;
            if (cardNumbers[1] === cardNumbers[2]) {
                pairCard = cardNumbers[0];
            } else {
                pairCard = cardNumbers[3];
            }
            return `H${pairCard}`;
        } else if (type === "highCard") {
            return `I${cardNumbers[4] * 13000 + cardNumbers[3] * 1300 + cardNumbers[2] * 130 + cardNumbers[1] * 13 + cardNumbers[0]}`;
        }
    }

    static hasFlush(cards) {
        let type = cards[0].slice(-1); // Assuming card is in format "2H", "3D", etc.
        for (const card of cards) {
            if (card.slice(-1) !== type) {
                return false; // Not a flush
            }
        }
        return true; // Found a flush
    }

    static hasStraight(cards) {
        let ranks = [];
        for (const card of cards) {
            const rank = card.slice(0, -1); // Assuming card is in format "2H", "3D", etc.
            ranks.push(rank);
        }
        ranks.sort((a, b) => a - b); // Sort the ranks numerically
        for (let i = 0; i < ranks.length - 1; i++) {
            if (ranks[i] !== ranks[i + 1] - 1) {
                return false; // Not a straight
            }
        }
        return true; // Found a straight
    }

    static hasPair(cards) {
        let pairCard = null;
        for (const card of cards) {
            const rank = card.slice(0, -1); // Assuming card is in format "2H", "3D", etc.
            if (pairCard === null) {
                pairCard = rank;
            } else if (pairCard === rank) {
                return true;
            }
        }
        return false; // No pair found
    }

    static hasThreeOfAKind(cards) {
        const ranks = [];
        for (const card of cards) {
            const rank = card.slice(0, -1); // Assuming card is in format "2H", "3D", etc.
            ranks.push(rank);
        }
        ranks.sort((a, b) => a - b);
        let count;
        ranks.forEach((rank, index) => {
            if (index > 0 && rank === ranks[index - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count === 3) {
                return true; // Found three of a kind
            }
        });
        return false; // No three of a kind found
    }

    static hasTwoPair(cards) {
        const ranks = [];
        for (const card of cards) {
            const rank = card.slice(0, -1); // Assuming card is in format "2H", "3D", etc.
            ranks.push(rank);
        }
        ranks.sort((a, b) => a - b);
        let count = 0;
        ranks.forEach((rank, index) => {
            if (index > 0 && rank === ranks[index - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count === 2) {
                return true; // Found two pair
            }
        });
        return false; // No two pair found
    }

    static hasFourOfAKind(cards) {
        const ranks = [];
        for (const card of cards) {
            const rank = card.slice(0, -1); // Assuming card is in format "2H", "3D", etc.
            ranks.push(rank);
        }
        ranks.sort((a, b) => a - b);
        let count;
        ranks.forEach((rank, index) => {
            if (index > 0 && rank === ranks[index - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count === 4) {
                return true; // Found four of a kind
            }
        });
        return false; // No four of a kind found
    }

    static hasFullHouse(cards) {
        const ranks = {};
        for (const card of cards) {
            const rank = card.slice(0, -1); // Assuming card is in format "2H", "3D", etc.
            if (!ranks[rank]) {
                ranks[rank] = 0;
            }
            ranks[rank]++;
        }
        let hasThree = false;
        let hasPair = false;
        for (const rank in ranks) {
            if (ranks[rank] >= 3) {
                hasThree = true; // Found three of a kind
            }
            if (ranks[rank] >= 2) {
                hasPair = true; // Found a pair
            }
        }
        return hasThree && hasPair; // Full house if both are true
    }

    static comparePoints(point1, point2) {
        const rank1 = point1.charAt(0);
        const rank2 = point2.charAt(0);
        if (rank1 < rank2) {
            return -1; // point1 is better
        } else if (rank1 > rank2) {
            return 1; // point2 is better
        } else {
            const value1 = parseInt(point1.slice(1), 10);
            const value2 = parseInt(point2.slice(1), 10);
            return value2 - value1;
        }
    }

    static getBestHand(cards) {
        let point = "";
        let type = this.determineHandType(cards);
        point = this.calculatePoints(cards, type);

        let max = 0;
        let bestHand = cards.slice(0, 5);
        for (let i = 0; i < cards.length - 1; i++) {
            let tempCards = [...cards];
            tempCards.splice(i, 1);
            for (let j = i + 1; j < cards.length - 1; j++) {
                let tempCards2 = [...tempCards];
                tempCards2.splice(j, 1);
                point = this.calculatePoints(tempCards2);
                if (this.comparePoints(point, max) < 0) {
                    max = point;
                    bestHand = tempCards2;
                }
            }
        }
        return { bestHand, point: max };
    }

    static calculatePotSize(bets) {
        return bets.reduce((total, bet) => total + bet, 0);
    }

    static determineWinner(players) {
        return players[0].name; // Placeholder
    }

    static calculateWinnings(winner, potSize) {
        return potSize; // Placeholder
    }

    static updatePlayerChips(player, winnings) {
        player.chips += winnings;
    }
}

module.exports = GameHelper;
// You can expand upon this by adding more features, such as betting rounds, player actions, and game state management.
// You can also implement the logic to handle player actions, such as betting, folding, and checking.