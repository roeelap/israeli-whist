import { SUITS_TO_PICTURES } from './consts.js';

export const showSuitButtons = (isShow) => {
  if (isShow) {
    return $('#bid1').show();
  }
  $('#bid1').hide();
};

export const showBidButtons = (isShow) => {
  if (isShow) {
    return $('#bid2').show();
  }
  $('#bid2').hide();
};

export const changeCardClickable = (isClickable) => {
  document.querySelectorAll('.cardImage').forEach((cardImg) => {
    if (isClickable) {
      $(cardImg).removeClass('nonClickable');
    } else {
      $(cardImg).addClass('nonClickable');
    }
  });
};

// shows the bid/pass label
export const showBid = (playerIndex, bid) => {
  const playerCardDiv = `#player${playerIndex}Card h4`;
  $(playerCardDiv).html(bid);
};

export const showCards = (playerCards) => {
  let output = '';
  let index = 0;
  playerCards.forEach((card) => {
    output += `
              <div style:"z-index: ${index};">
                  <img src="${card.getImage()}" class="cardImage" style="margin-left: -60px">
              </div>
          `;

    index++;
  });

  $('#player').html(output);
};

// makes the player's label bold while it's their turn
export const updateBoldLabel = (playerIndex) => {
  const playerLabels = [`#player1Card p`, `#player2Card p`, `#player3Card p`, `#player4Card p`];
  playerLabels.forEach((label) => {
    $(label).removeClass('bold');
  });

  $(playerLabels[playerIndex - 1]).addClass('bold');
};

const createRoundInfoTable = (game) => {
  const data = [
    { id: 'roundNumber', text: `Round ${game.round} of 14` },
    { id: 'trumpSuit', text: `Trump Suit: ${SUITS_TO_PICTURES[game.trumpSuit]}` },
    { id: 'totalBids', text: `Total Bids: ${game.totalBids}` },
    { id: 'roundMode', text: game.getRoundMode() },
  ];

  let table = $('<table></table>').addClass('table table-sm table-hover').html(` 
  <thead>
    <tr class="text-center">
      <th>
        <strong>Round Information</strong>
      </th>
    </tr>
  </thead>`);

  let tableBody = $('<tbody></tbody>');

  for (let row of data) {
    tableBody.append(`
    <tr id="${row.id}">
      <td>${row.text}</td>
    </tr>`);
  }
  table.append(tableBody);
  $('#roundInfo').html(table);
};

const createScoreTable = (game) => {
  let data = [];
  for (let player of game.players) {
    const { index, bid, tricks, score } = player;
    data.push({ id: `player${index}info`, player: `Player ${index}`, bid, tricks, score });
  }

  let table = $('<table></table>').addClass('table table-sm table-hover text-center').html(` 
  <thead>
    <tr>
      <th>Player</th>
      <th>Bid</th>
      <th>Tricks</th>
      <th>Score</th>
    </tr>
  </thead>`);

  let tableBody = $('<tbody></tbody>');

  for (let row of data) {
    const { id, player, bid, tricks, score } = row;
    tableBody.append(`
    <tr id="${id}">
      <td>${player}</td>
      <td>${bid}</td>
      <td>${tricks}</td>
      <td>${score}</td>
    </tr>`);
  }
  table.append(tableBody);
  $('#score').html(table);
};

export const createTrickBidButtons = (minBid, forbiddenBid = null) => {
  let newDiv = $('<div class="trick-buttons"></div');
  for (let i = 0; i <= 13; i++) {
    const disabled = i < minBid || i === forbiddenBid ? 'disabled' : '';
    newDiv.append(
      `<input type="button" class="btn btn-secondary bidButton" value="${i}" onclick="onTricksBidButtonClicked(this)" ${disabled}/>`
    );
  }
  $('#bid2').html(newDiv);
};

export const createTables = (game) => {
  createRoundInfoTable(game);
  createScoreTable(game);
};