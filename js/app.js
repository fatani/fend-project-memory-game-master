/*
 * Create a list that holds all of your cards
 */
let card = document.getElementsByClassName("card");
const cards = [...card];

// Create deck board of cards
const deckBoard = document.getElementById("deckBoard");

// Put a two cards in this array to compare them
let isCardsMatched = [];
let matchedCards = [];

// Moves
let moves;
const movesCounter = document.querySelector(".moves");

// Stars
const starsList = document.querySelectorAll(".fa-star");
let starsTotal = 3;

// Timer
let interval;
let timer = {
    hrs: 0,
    min: 0,
    sec: 0
}
let hrs = document.querySelector(".hrs");
let min = document.querySelector(".min");
let sec = document.querySelector(".sec");

// Modal
let modal = document.querySelector("#gameDialog");
let modalTime = document.querySelector(".modalTime");
let modalRating = document.querySelector(".modalRating");
let modalMoves = document.querySelector(".modalMoves");

let gameStarted = false;


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function matched() {
    isCardsMatched[0].classList.add("match");
    isCardsMatched[1].classList.add("match");
    matchedCards.push(isCardsMatched[0]);
    matchedCards.push(isCardsMatched[1]);
    isCardsMatched = [];
}

function notMatched() {
    isCardsMatched[0].classList.remove("open", "show");
    isCardsMatched[1].classList.remove("open", "show"); 
    isCardsMatched = [];
}

function cardsDisable() {
    for (index in cards) {
        cards[index].classList.add("disable");
    }
}

function cardsEnable() {
    for (index in cards) {
        cards[index].classList.remove("disable");
    }

    for (card of matchedCards) {
        card.classList.add("disable");
    }
}

function checkRating() {
    switch (moves) {
        case 10: 
            starsList[2].classList.remove("full-star");
            starsTotal = 2;
            break;
        case 15:
            starsList[1].classList.remove("full-star");
            starsTotal = 1;
            break;
        case 20:
            starsList[0].classList.remove("full-star");
            starsTotal = 0;
    }
}

function formatTime(num) {
    return num < 10 ? "0" + num : num;
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        interval = setInterval(() => {
            hrs.innerHTML = formatTime(timer.hrs);
            min.innerHTML = formatTime(timer.min);
            sec.innerHTML = formatTime(timer.sec);
            ++timer.sec;
            if (timer.sec == 60) {
                ++timer.min;
                timer.sec = 0;
            }
            if (timer.min == 60) {
                ++timer.hrs;
                timer.min = 0;
            }
        }, 1000);
    }
}

function finished() {
    modalTime.innerHTML = formatTime(timer.hrs) + ":" + formatTime(timer.min) + ":" + formatTime(timer.sec);
    modalRating.innerHTML = starsTotal;
    modalMoves.innerHTML = moves;
 
    clearInterval(interval);
    modal.showModal();
}

function closeDialog() {
    modal.close();
    playGame();
}

function openCard() {
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disable");

    isCardsMatched.push(this);
    if (isCardsMatched.length === 2) {
        startTimer();
        movesCounter.innerHTML = ++moves;
        checkRating();
        cardsDisable();
        if (isCardsMatched[0].innerHTML === isCardsMatched[1].innerHTML) {
            matched();
            cardsEnable();
        } else {
            setTimeout(notMatched, 800);
            setTimeout(cardsEnable, 800);
        }
    }
    if (matchedCards.length === 16) { finished(); }
}
 
function playGame() {
    gameStarted = false;
    clearInterval(interval);
    
    // A new deck of cards is shuffled for every game
    let shuffleCards = shuffle(cards);
    for (let i = 0; i < shuffleCards.length; i++) {
        deckBoard.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deckBoard.appendChild(item);
        });
    cards[i].classList.remove("show", "open", "match", "disable");
    cards[i].addEventListener("click", openCard)
    } 
    // matchedCards array set to empty
    matchedCards = [];

    // Reset moves
    moves = 0;
    movesCounter.innerHTML = moves;

    // Reset stars
    for (const star of starsList) {
        star.classList.add("full-star");
    }

    // Reset timer
    timer.hrs = 0;
    timer.min = 0;
    timer.sec = 0;
    hrs.innerHTML = formatTime(timer.hrs);
    min.innerHTML = formatTime(timer.min);
    sec.innerHTML = formatTime(timer.sec);
}

playGame();