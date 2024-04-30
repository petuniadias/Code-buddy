document.addEventListener("DOMContentLoaded", function () {
  const diceButton = document.querySelector(".dice_button");
  const numberDisplay = document.querySelector(".dice_number");
  const popup = document.getElementById("popup");
  const goButton = document.querySelector(".go_button");
  const nameDisplay = document.querySelector(".board_name");
  const availablePieces = document.querySelectorAll(".piece");
  const cellsDisplay = document.querySelectorAll(".cell");
  const originalContent = [...cellsDisplay].map((cell) => cell.innerHTML);
  const pointsDisplay = document.querySelector('.points');
  
  cellsDisplay.forEach((cell, index) => {
    cell.dataset.index = index;
  });

  let playerPiece = "";
  let playerName = "";
  let diceNum = 0;
  let gameReady = false;
  let showOption;
  let previousCell;
  let playerPoints = 30;
  let clickedCell = true;

  const user = { name: playerName, position: 0, piece: playerPiece };

  const direction1 = [
    17, 18, 19, 20, 21, 16, 15, 14, 13, 12, 11, 6, 7, 8, 9, 10,
  ];

  const direction2 = [5, 4, 3, 2, 1, 0];
  const challenges = [19, 14, 11, 9, 4, 2];
  const points = [21, 12, 6, 10];
  const tips = [7, 16];

  const normalPath = direction1.map((index, i) => ({
    elementIndex: index,
    orderIndex: i,
    element: cellsDisplay[index],
    state: "",
  }));
  const winningPath = direction2.map((index, i) => ({
    elementIndex: index,
    orderIndex: i,
    element: cellsDisplay[index],
    state: "",
  }));

  function game() {
    popup.style.display = "block";

    goButton.addEventListener("click", () => {
      playerName = document.querySelector(".player_name").value;
      if (playerName) {
        popup.style.display = "none";
        nameDisplay.textContent = `${playerName}'s Board`;
        gameReady = true;
        startGame();
      }
    });

    availablePieces.forEach((piece) => {
      piece.addEventListener("click", () => {
        playerPiece = piece.textContent;
      });
    });

    goButton.onclick = () => {
      playerName = document.querySelector(".player_name").value;
    };

    rollDice();
  }

  function startGame() {
    normalPath[0].element.style.fontSize = "30px";
    normalPath[0].element.textContent = playerPiece;
    normalPath[0].state = playerPiece;
  }

  function rollDice() {
    diceButton.addEventListener("click", () => {
      if (!gameReady || !clickedCell) return;
      clickedCell = false;
      diceNum = Math.floor(Math.random() * 3) + 1;
      numberDisplay.textContent = `Dice number: ${diceNum}`;
      showDiceOptions();
      
    });
    numberDisplay.textContent = `Dice number: ${diceNum}`;
  }

  function showDiceOptions() {
 

    if (diceNum !== 0) {
      showOption = normalPath[user.position + diceNum].element;
      Object.assign(showOption.style, {
        boxShadow: "0 0 60px #B2FAF1",
        border: "3px solid #B2FAF1",
      });

      clickCell(showOption);
    }

    user.position = normalPath[user.position + diceNum].orderIndex;
  }

  function clickCell(showOption) {
    cellsDisplay.forEach((cell, index) => {

      function clickCellEvent() {
        console.log('click');
        let checkIndex = index;
        if (cell === showOption) {
         clickedCell = true;
          if (previousCell) {
            previousCell.innerHTML =
              originalContent[previousCell.dataset.index];
            previousCell.style.fontSize = "50px";
          }
          cell.style.fontSize = "30px";
          previousCell = cell;
          previousCell.innerHTML = playerPiece;
          resetFirstCell();
        }
        Object.assign(showOption.style, {
          boxShadow: "none",
          border: "none",
        });
        checkCells(checkIndex);
      }
      if(cell.controller)  cell.controller.abort()
        const controller = new AbortController();
        const signal = controller.signal;
       cell.addEventListener("click", clickCellEvent, {
        signal
       });
       cell.controller = controller;
    });
  }

  function resetFirstCell() {
    const firstCell = normalPath[0].element;
    firstCell.innerHTML = originalContent[firstCell.dataset.index];
    firstCell.style.fontSize = "50px";
  }

  function checkCells(index) {
    if (points.includes(index)) {
      switch (index) {
        case 21:
          addPoints();
          break;
        case 12:
          removePoints();
          break;
        case 6:
          addPoints();
          break;
        case 10:
          removePoints();
          break;
      }
    } else if (challenges.includes(index)) {
      switch (index) {
        case 19:
          openChallenge();
          case 14:
          openChallenge();
          case 11:
          openChallenge();
          case 9:
          openChallenge();
          case 4:
          openChallenge();
          case 2:
          openChallenge();
      }
      console.log('challenges');
    } else if (tips.includes(index)) {
      console.log("tips");
    }
  }

  function openChallenge() {
    const popupChallenge = document.getElementById("popup_challenge");
    popupChallenge.style.display = "block";
  }

  function changePopupContent(newQuestion, newStatement) {
    let questionContent = document.querySelector("question");
    questionContent.innerHTML = newQuestion;
    let statementContent = document.querySelector("statement");
    statementContent.innerHTML = newStatement;
  }

  function generatePoints(min, max){
    const randomNr = Math.floor(Math.random() * ((max - min) / 10 + 1));
    return (randomNr * 10) + min;
  }

  function removePoints(){
    const addRandom = generatePoints(20,100);
    playerPoints += addRandom;
    console.log(playerPoints);
    pointsDisplay.innerHTML = playerPoints;  
  }

  function addPoints(){
    const removeRandom = generatePoints(20,100);
    playerPoints += removeRandom;
    console.log(playerPoints);
    pointsDisplay.innerHTML = playerPoints;
  }

  game();
});