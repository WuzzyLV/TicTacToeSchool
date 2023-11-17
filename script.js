const classX = "cross";
const classO = "circle";

const winConditions= [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll(".cell");
const resultScreen = document.querySelector("#result-box");
const resultInfo = document.querySelector(".result-info");
const restartBtn = document.querySelector(".restart-btn");
const turnDisplay = document.querySelector(".display-p");

let circlePlayer;
let circleScore = localStorage.getItem("circleScore") ? localStorage.getItem("circleScore") : 0;
let crossScore = localStorage.getItem("crossScore") ? localStorage.getItem("crossScore") : 0;
let denyInput = false;

function startGame() {
    circlePlayer = false;
    denyInput = false;
    cells.forEach(cell => { 
        cell.classList.remove(classX);
        cell.classList.remove(classO);
        cell.classList.remove("winning-cell");
        cell.addEventListener("click", handleClick, { once: true });
    });
}
startGame();

function handleClick(e) {
    if (denyInput) return;
    const cell= e.target;
    const activePlayer = circlePlayer ? classO : classX;
    placeMark(cell, activePlayer);
    if (checkWin(activePlayer)) {
        highlightWinningCells(activePlayer);
        denyInput = true;
        setTimeout(function (){endGame(false);}, 1000);
    } else if (isDraw()) {
        endGame(true);
    } else{
    changePlayer();
    }
}

function placeMark(cell, activePlayer) {
    cell.classList.add(activePlayer);
}

function changePlayer() {
    circlePlayer = !circlePlayer;
    turnDisplay.classList.remove(circlePlayer ? "cross" : "circle");
    turnDisplay.classList.add(circlePlayer ? "circle" : "cross");

    // change background color for each player
    document.querySelector("body").style.backgroundColor = circlePlayer ? "#1a252c" : "#1c2c1a";
}

let winningCells = [];
function checkWin(activePlayer) {
    winConditions.forEach(combination => {
        const isWinningCombo = combination.every(index => {
            return cells[index].classList.contains(activePlayer);
        });
        if (isWinningCombo) {
            winningCells = combination.slice(); // Store the winning combination
        }
    });
    return winningCells.length > 0; // Return true if there are winning cells
}


function highlightWinningCells(activePlayer) {
    winningCells.forEach(index => {
        cells[index].classList.add("winning-cell");
    });
}

function isDraw() {
    return [...cells].every(cell => { // [...cells] - parveido NodeList par Array
        return cell.classList.contains(classX) || cell.classList.contains(classO);
    })
}

function endGame(draw) {
    if (draw) {
        resultInfo.innerHTML = "Neizšķirts!";
    }else if (circlePlayer) {
        resultInfo.innerHTML = "\"O\" spēlētajs uzvarēja!";
        localStorage.setItem("circleScore", ++circleScore);
        updateScore(null, false);
    }else if (!circlePlayer) {
        localStorage.setItem("crossScore", ++crossScore);
        updateScore(null, false);
        resultInfo.innerHTML = "\"X\" spēlētajs uzvarēja!";
    }
    // Show score

    updateScore(circlePlayer, true);
    resultScreen.classList.add("show");
    $("#result-box").css("opacity", 0).animate({ opacity: 1 }, 100);
}

document.querySelector(".restart-btn").addEventListener("click", restartGame);

function restartGame() {
    resultScreen.classList.remove("show");
    startGame();
}

function updateScore(player, hardUpdate) {
    document.querySelector("#circle-score span").innerHTML = circleScore;
    document.querySelector("#cross-score span").innerHTML = crossScore;

    if (!hardUpdate) return;
    // To only animate the score that has changed
    
    if (player) {
        $("#result-circle-score span").fadeOut(200, function() {
            $(this).text(circleScore).fadeIn(200);
        });
        $("#result-cross-score span").text(crossScore);
    }else {
        $("#result-cross-score span").fadeOut(200, function() {
            $(this).text(crossScore).fadeIn(200);
        });
        $("#result-circle-score span").text(circleScore);
    }   
}
updateScore();

$(".reset-score-btn").click(function() {
    resetScore();
});

function resetScore() {
    console.log("reset");
    localStorage.setItem("circleScore", 0);
    localStorage.setItem("crossScore", 0);
    circleScore = 0;
    crossScore = 0;
    updateScore(null, true);
}