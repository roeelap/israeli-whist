import Game from './classes/Game.js';
import { SUITS_TO_PICTURES } from './static/consts.js';
import Player from './classes/Player.js';
import Ai from './classes/AI.js';
import { showBid, showBidButtons, showSuitButtons, changeCardClickable, showCards } from './static/dynamicUIChanges.js';
import { updateScore } from './static/scoreCalculations.js';

const newGame = () => {
  let players = [];
  for (let i = 1; i <= 4; i++) {
    players.push(new Player(i));
  }

  const game = new Game(players);

  game.newRound(false);

  return game;
};

// Correct bid
const onBidInputChange = (bidInput) => {
  if (bidInput.value < 5) {
    return (bidInput.value = 5);
  }
  if (bidInput.value > 13) {
    return (bidInput.value = 13);
  }
};

const newRound = () => {
  game.newRound(true);
  showCards(game.players[0].cards);
  trumpSuitBidRound();
};

const trumpSuitBidRound = () => {
  // checking if trump suit bid round has ended
  if (game.passCount === 3 && game.bidCount >= 1) {
    console.log('phase complete');
    return tricksBidRound();
  } else if (game.passCount === 4) {
    return setTimeout(() => {
      return newRound();
    }, 0);
  }

  // player turn
  if (game.turn === 1) {
    return showSuitButtons(true);
  }

  // AI turn
  return setTimeout(() => {
    showBid(game.turn, Ai.getTrumpSuitBid(game, game.players[game.turn - 1]));
    game.nextTurn();
    trumpSuitBidRound();
  }, 1000);
};

// on suit bid click
const onSuitBidButtonClicked = (bidButton) => {
  const bidAmount = parseInt($('#bidAmount').val());
  const bidSuit = $(bidButton).index();
  const choice = game.isTrumpSuitBidValid(bidAmount, bidSuit);

  // invalid choice
  if (!choice) {
    return alert('Not a valid bid, please try again.');
  }

  if (choice === 'pass') {
    game.passCount++;
    showBid(1, choice);
  } else {
    game.bidCount++;
    game.passCount = 0;

    game.highestBid = game.players[0].bid = bidAmount;
    game.trumpSuit = bidSuit;

    showBid(1, bidAmount + SUITS_TO_PICTURES[bidSuit]);
  }

  // updating the turn and letting the cpu act
  showSuitButtons(false);
  game.nextTurn();
  return trumpSuitBidRound();
};

const tricksBidRound = () => {
  // Tricks round ended
  if (game.trickBidsMade === 4) {
    $('#roundMode').html(`<td><strong>${game.getRoundMode()}</strong></td>`);
    return gameRound();
  }

  // waiting for player to bid
  if (game.turn === 1) {
    return showBidButtons(true);
  }

  // AI turn
  return setTimeout(() => {
    game.trickBidsMade++;
    showBid(game.turn, Ai.getTrickBid(game, game.players[game.turn - 1]));
    game.nextTurn();
    trumpSuitBidRound();
  }, 1000);
  
};

const onTricksBidButtonClicked = (bidButton) => {
  const bid = parseInt(bidButton.value);

  if (!game.isTrickBidValid(bid)) {
    return alert('Not a valid bid, please try again.');
  }

  game.players[0].bid = bid;
  game.totalBids += bid;
  $('#totalBids').html(`<td><strong>Total Bids: </strong>${game.totalBids}</td>`);

  showBidButtons(false);
  showBid(1, bid);
  game.trickBidsMade++;

  // updating the turn and letting the cpu act
  game.nextTurn();
  return tricksBidRound();
};

const gameRound = () => {
  // check if round has ended and calculate scores
  if (game.players.every((player) => player.cards.length === 0)) {
    updateScore(player, game.roundMode);
    return game.newRound(false);
  }

  // if sub-round ended - figure out the winning card and the starting player of the next putdown
  if (game.thrownCards.length === 4) {
    game.determineTrickWinner();
    return gameRound();
  }

  // player turn
  if (game.turn === 1) {
    return changeCardClickable(true);
  }

  // ai turn
  console.log('ai turn');
};

export const throwCard = (player, index, cardImg = null) => {
  if (game.isCardValid(player, player.cards[index])) {
    // putting the clicked card on the game board
    const img = player.cards[index].getImage();
    const playerCardId = `#player${player.index}Card .usedCardImage`;
    $(playerCardId).attr('src', img);

    // removing the card from the player's hand
    game.thrownCards.push([player, player.cards.splice(index, 1)]);
    $(cardImg.parentElement).remove();

    if (player.index === 1) {
      changeCardClickable(true);
    }

    // next turn
    game.nextTurn();
    return gameRound();
  }
};

const bindConstsToWindow = () => {
  window.game = game;
  window.onSuitBidButtonClicked = onSuitBidButtonClicked;
  window.onTricksBidButtonClicked = onTricksBidButtonClicked;
  window.onBidInputChange = onBidInputChange;
};

// creating a new game
const game = newGame();

$(document).ready(() => {
  bindConstsToWindow();

  // showing player cards and disable clicking
  showCards(game.players[0].cards);
  changeCardClickable(false);

  // onclick events for the card images
  document.querySelectorAll('.cardImage').forEach((cardImg) => {
    cardImg.onclick = function () {
      throwCard(game.players[0], $(cardImg.parentElement).index(), cardImg);
    };
  });

  // starting the trump suit bid round
  trumpSuitBidRound();
});
