------- TRUMP SUIT BID ROUND --------
checking which suit is the most frequent
if 2 suits are equal in frequency, check which
has the higher cards.

calculate score based on the cards:

most frequent suit:
J -> A : +1
9 -> 10 : +0.75
6 -> 8 : +0.5
2 -> 5 : +0.25

other suits:
A : +1
K : +1
Q : +0.5
Rest : +0

if it's possible to bid the wanted suit,
with the score - bid the suit with the
minimal tricks possible. for example,
if the suit is hearts, the score is 7,
and the highest bid at the moment is
clubs-6, BID HEARTS-6.

-------- TRICK BID ROUND ---------
calculate score based on the cards:

Trump suit:
J -> A : +1
6 -> 10 : +0.5
2 -> 5 : +0.25

other suits:
A : +1 (if you have 5 or more cards in a certain suit, +0.75)
K : +1 (if you have 5 or more cards in a certain suit, +0.5)
Q : +0.5 (if you have 5 or more cards in a certain suit, +0)
Rest : +0

if the lowest card in a certain suit is a 5/6 : +0.5
if the lowest card in a certain suit is a 7 -> ... : +0.75

floor the score

## GAME ROUND 

- keep track of the list of cards that have **not** been played
- only try to win s if you need to
- highlight "automatic" winners (Ace trump, etc.)

# OVER:

1. if possible, and if you know you probably will win, try to win the trick.
2. if you can't win the hand, put the lowest card you have.
3. if you can put a trump card over a regular card, do it with your lowest trump card.
4. when you put the first card, put the highest card you have that will win (not the highest trump card),    unless there's a higher card somewhere there.
5. when you finish your contract, play like it's under.

# UNDER:

6. if you have a lower card to put, put it. put the highest card that will not win.
7. if you can't lose the hand, put the highest card you have.
8. when you put the first card, put the lowest card you have.
9.  if a player took 2 cards over his bid, or 2 players took 1 card over their bid, play like it's over.