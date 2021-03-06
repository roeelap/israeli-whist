import {
  removeAllProgressionLabels,
  removeGameModeLabel,
  updateRoundNumber,
  updateScoreList,
  updateTurnGlow,
} from '../dynamicUIChanges/mainBoard.js';
import { displayGameOverModal } from '../dynamicUIChanges/modals.js';
import Deck from './Deck.js';

export default class Game {
  constructor(players, rounds) {
    this.players = players;
    this.deck;
    this.round = 0;
    this.highestBid = 5;
    this.trumpSuit = 0;
    this.totalBids = 0;
    this.roundMode = 0;
    this.turn = 1;
    this.thrownCards = [];
    this.lastThrownCards = [];
    this.bidCount = 0;
    this.passCount = 0;
    this.trickBidsMade = 0;
    this.firstPlayerToPlay = 0;
    this.totalRounds = rounds;
  }

  determineFirstPlayer(isAllPassed) {
    // in case all the players passed, don't pass the turn to next player
    if (isAllPassed) {
      return this.turn;
    }
    if (this.firstPlayerToPlay === 4) {
      return 1;
    }
    return this.firstPlayerToPlay + 1;
  }

  calculateRemainingCards() {
    for (const player of this.players) {
      let remainingCards = [];
      for (let i = 1; i <= 4; i++) {
        if (player.index !== i) {
          remainingCards.push(...this.players[i - 1].cards);
        }
      }
      player.remainingCards = remainingCards;
    }
  }

  newRound(isAllPassed) {
    this.highestBid = 5;
    this.trumpSuit = 0;
    this.totalBids = 0;
    this.roundMode = 0;
    this.lastThrownCards = [];
    this.thrownCards = [];
    this.bidCount = 0;
    this.passCount = 0;
    this.trickBidsMade = 0;
    this.firstPlayerToPlay = this.determineFirstPlayer(isAllPassed);

    if (!isAllPassed) {
      this.round++;
    }

    // resetting the stats of each player
    this.players.forEach((player) => {
      player.resetStats();
    });

    updateScoreList(this.players, this.getWinningPlayersIndexes());

    // check if the game is over
    if (this.round > this.totalRounds) {
      return displayGameOverModal();
    }

    //creating a new deck
    this.deck = new Deck();
    this.deck.shuffle();
    this.dealCards();

    // UI updating
    updateScoreList(this.players, this.getWinningPlayersIndexes());
    updateRoundNumber(this.round, this.totalRounds);
    updateTurnGlow(this.firstPlayerToPlay);
    removeAllProgressionLabels();
    removeGameModeLabel();
  }

  dealCards() {
    while (this.deck.cards.length > 0) {
      this.players.forEach((player) => {
        player.cards.push(this.deck.cards.pop());
        player.sortCards();
      });
    }
  }

  // checks if the trump suit bid is valid
  isTrumpSuitBidValid(bidAmount, bidSuit) {
    // if the player passes - the pass button is the sixth button
    if (bidSuit === 6) {
      return 'pass';
    }

    //if the player tries to bid
    if (bidAmount < this.highestBid) {
      return false;
    }

    if (bidAmount === this.highestBid && bidSuit <= this.trumpSuit) {
      return false;
    }

    return true;
  }

  isTrickBidValid(bid) {
    if (this.trickBidsMade === 0 && bid < this.highestBid) {
      return false;
    }
    if (this.trickBidsMade === 3 && this.totalBids + bid === 13) {
      return false;
    }
    return true;
  }

  isCardValid(player, card) {
    // first player card is always valid
    if (this.thrownCards.length === 0) {
      return true;
    }

    // the suit of the first card played
    const playedCard = this.thrownCards[0];
    const playedSuit = playedCard.card.suit;

    // valid if the suits are identical
    if (card.suit === playedSuit) {
      return true;
    }

    // checking if the player has cards of the same suit
    for (let card of player.cards) {
      if (card.suit === playedSuit) {
        return false;
      }
    }
    // all other cases
    return true;
  }

  // over or under
  getRoundMode() {
    this.roundMode = this.totalBids - 13;
    if (this.roundMode > 0) {
      return `Over ${this.roundMode}`;
    }
    return `Under ${13 - this.totalBids}`;
  }

  nextTurn() {
    if (this.turn === 4) {
      this.turn = 1;
    } else {
      this.turn++;
    }
  }

  determineTrickWinner() {
    this.lastThrownCards = this.thrownCards;
    const firstCard = this.thrownCards[0].card;

    // removing all the cards that don't match the played suit or the trump suit
    for (let i = 0; i < this.thrownCards.length; i++) {
      const card = this.thrownCards[i].card;
      if (card.suit !== firstCard.suit && card.suit !== this.trumpSuit) {
        this.thrownCards.splice(i, 1);
        i--;
      } else if (card.suit === this.trumpSuit) {
        this.thrownCards = this.thrownCards.filter((cardPair) => cardPair.card.suit === this.trumpSuit);
        break;
      }
    }

    // sorting the list by descending values
    this.thrownCards.sort((a, b) => b.card.value - a.card.value);

    // getting the winner and giving him the trick
    const winningPlayerIndex = this.thrownCards[0].player.index;
    this.players[winningPlayerIndex - 1].tricks++;

    this.thrownCards = [];
    this.turn = winningPlayerIndex;

    updateTurnGlow(winningPlayerIndex);
    return winningPlayerIndex;
  }

  getWinningPlayersIndexes() {
    let winningPlayers = [this.players[0]];
    for (let i = 1; i < this.players.length; i++) {
      if (this.players[i].score === winningPlayers[0].score) {
        winningPlayers.push(this.players[i]);
      } else if (this.players[i].score > winningPlayers[0].score) {
        winningPlayers = [this.players[i]];
      }
    }

    return winningPlayers.map((player) => player.index);
  }
}
