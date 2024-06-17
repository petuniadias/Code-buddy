document.addEventListener("DOMContentLoaded", function () {
  const elements = {
    popup: document.getElementById("popup"),
    cellsDisplay: document.querySelectorAll(".cell"),
    popupPieces: document.getElementById("regular_popup"),
    sendButton: document.getElementById("send"),
    timerDisplay: document.querySelector(".timer"),
    tipNum: document.querySelector(".tipsNum"),
    tipImg: document.querySelector(".tip"),
    input: document.querySelector(".answer"),
  };

  let movingForward = true;
  let blockedPath = true;
  let elapsedTime = 0;

  const cellsDisplay = document.querySelectorAll(".cell");
  cellsDisplay.forEach((cell, index) => {
    cell.dataset.index = index;
  });

  const originalContent = [...cellsDisplay].map((cell) => cell.innerHTML);

  const challengeContents = [
    {
      question: "Qual é o operador de igualdade estrita em JavaScript?",
      answer: `===`,
      tip: "É igual de trás para a frente e de frente para trás",
    },
    {
      question: "Qual é o método usado para concatenar arrays em JavaScript?",
      answer: `concat()`,
      tip: "Começa com a letra 'c'",
    },
    {
      question: "Qual é o operador usado para exponenciação em Python?",
      answer: `**`,
      tip: "São dois caracteres especiais juntos",
    },
    {
      question:
        "Qual é o elemento HTML usado para criar uma lista não ordenada?",
      answer: `<ul>`,
      tip: "O elemento é representado por duas letras entre dois caracteres especiais",
    },
    {
      question: "Qual é o elemento HTML usado para criar um link?",
      answer: `<a>`,
      tip: "É representado pela primeira letra do alfabeto entre dois caracteres especiais'",
    },
    {
      question:
        "Como se aplica um estilo CSS a um elemento com o id definido como 'content",
      answer: "#content",
      tip: "Começa com um caracter especial e o nome do id",
    },
    {
      question:
        "Qual é o método usado para adicionar um elemento no final de um array em JavaScript?",
      answer: "push()",
      tip: "Começa com a letra 'p' seguido de parênteses",
    },
    {
      question: "Como se define um comentário de uma linha em Python?",
      answer: "#",
      tip: "Representado por um único caracter",
    },
    {
      question:
        "Qual é o seletor CSS usado para selecionar todos os elementos filhos de um elemento pai?",
      answer: ">",
      tip: "É um símbolo matemático que indica uma relação direta.",
    },
    {
      question:
        "Qual é a propriedade CSS usada para definir a altura de um elemento?",
      answer: "height",
      tip: "Uma palavra simples que descreve a dimensão vertical de um elemento.",
    },
    {
      question: "Como você converte um número para uma string em Python?",
      answer: "str()",
      tip: "Três letras que abreviam 'string' seguida de parênteses",
    },
    {
      question:
        "Qual é o método usado para remover o último elemento de um array em JavaScript?",
      answer: "pop()",
      tip: "Começa com a letra 'p'",
    },
    {
      question:
        "Qual é o operador usado para incrementar o valor de uma variável em JavaScript?",
      answer: "++",
      tip: "Dois símbolos iguais que indicam aumento",
    },
    {
      question: "Como se verifica o tipo de uma variável em Python?",
      answer: "type()",
      tip: "Função que retorna o tipo de dado de uma variável.",
    },
    {
      question:
        "Qual é a propriedade CSS usada para definir o espaçamento entre as linhas de texto?",
      answer: "line-height",
      tip: "Define a altura da linha de texto dentro de um elemento.",
    },
    {
      question: "Qual é a tag usada para inserir um quebra de linha em HTML?",
      answer: "<br>",
      tip: "É uma tag simples que não tem tag de fechamento.",
    },
    {
      question: "Como você define uma variável constante em JavaScript?",
      answer: "const",
      tip: "Uma palavra-chave que declara uma variável cujo valor não pode ser alterado depois de atribuído.",
    },
  ];

  let gameState = {
    playerPiece: "",
    playerName: "",
    diceNum: 0,
    gameReady: false,
    previousCell: null,
    clickedCell: true,
    tip: false,
    hasShield: false,
    user: { name: "", position: 0, piece: "", tips: 0, pieces: 0, shields: 0 },
  };

  const paths = {
    normal: [
      17, 18, 19, 20, 21, 16, 15, 14, 13, 12, 11, 6, 7, 8, 9, 10, 5, 4, 3, 2, 1,
      0,
    ].map((index, i) => ({
      index,
      order: i,
      element: elements.cellsDisplay[index],
      state: "",
    })),
  };

  function startTimer() {
    timerInterval = setInterval(() => {
      elapsedTime++;
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    elements.timerDisplay.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function initializeGame() {
    const goButton = document.querySelector(".go_button");
    const diceButton = document.querySelector(".dice_button");
    const availablePieces = document.querySelectorAll(".piece");
    elements.popup.style.display = "block";

    goButton.addEventListener("click", startGame);

    availablePieces.forEach((piece) => {
      piece.addEventListener("click", () => {
        gameState.playerPiece = piece.textContent;
      });
    });

    diceButton.addEventListener("click", rollDice);
  }

  function startGame() {
    const nameDisplay = document.querySelector(".board_name");
    const playerNameInput = document.querySelector(".player_name");
    const playerName = playerNameInput ? playerNameInput.value : "";

    if (!gameState.playerPiece) {
      gameState.playerPiece = "🟡";
    }
    if (playerName) {
      elements.popup.style.display = "none";
      nameDisplay.textContent = `${playerName}'s Board`;
      gameState.gameReady = true;
      gameState.playerName = playerName;
      gameState.user.name = playerName;

      paths.normal[0].element.style.fontSize = "30px";
      paths.normal[0].element.textContent = gameState.playerPiece;
      paths.normal[0].state = gameState.playerPiece;
    }
  }

  function rollDice() {
    const numberDisplay = document.querySelector(".dice_number");
    if (!gameState.gameReady || !gameState.clickedCell) return;

    gameState.clickedCell = false;
    gameState.diceNum = getDiceRoll();
    numberDisplay.textContent = `Dice number: ${gameState.diceNum}`;

    let targetIndex;

    if (movingForward) {
      targetIndex = gameState.user.position + gameState.diceNum;
    } else {
      targetIndex = gameState.user.position - gameState.diceNum;
    }

    if (targetIndex >= paths.normal.length) {
      targetIndex = paths.normal.length - 1;
    } else if (targetIndex < 0) {
      targetIndex = 0;
    }

    if (targetIndex >= 16 && gameState.user.pieces < 3 && blockedPath) {
      movingForward = false;

      targetIndex = gameState.user.position - gameState.diceNum;
      changeRegularContent(
        "São necessárias três peças para desbloquear o caminho",
        "/codebuddy/images/escaperoom/Assets/lock_popup.png"
      );
    } else if (
      targetIndex === 0 &&
      !movingForward &&
      gameState.user.pieces < 3
    ) {
      movingForward = true;
      targetIndex = gameState.user.position + gameState.diceNum;
    } else if (targetIndex >= 21 && movingForward) {
      moveToFinalCell();
    }

    let showOption = paths.normal[targetIndex].element;
    styleCell(showOption, true);
    setupCellClick(showOption, targetIndex);

    if (elapsedTime === 0) {
      startTimer();
    }
  }

  function getDiceRoll() {
    const random = Math.random();
    if (random < 0.4) {
      return 1;
    } else if (random < 0.7) {
      return 2;
    } else if (random < 0.9) {
      return 3;
    } else if (random < 0.95) {
      return 4;
    } else if (random < 0.975) {
      return 5;
    } else {
      return 6;
    }
  }

  function styleCell(cell, highlight) {
    const style = highlight
      ? { boxShadow: "0 0 60px #B2FAF1", border: "3px solid #B2FAF1" }
      : { boxShadow: "none", border: "none" };
    Object.assign(cell.style, style);
  }

  function setupCellClick(cell, targetIndex) {
    const handleClick = () => {
      if (
        !gameState.clickedCell &&
        cell === paths.normal[targetIndex].element
      ) {
        gameState.clickedCell = true;

        if (gameState.previousCell) {
          resetCell(gameState.previousCell);
        }

        cell.innerHTML = gameState.playerPiece;
        cell.style.fontSize = "30px";
        gameState.previousCell = cell;
        resetFirstCell();
        styleCell(cell, false);

        if (gameState.user.pieces >= 3 && !movingForward) {
          gameState.user.position = 16;
          movingForward = true;
          targetIndex = gameState.user.position + gameState.diceNum;
        } else {
          gameState.user.position = paths.normal[targetIndex].order;
          checkCellActions(targetIndex);
        }
      }
    };

    cell.addEventListener("click", handleClick, { once: true });
  }

  function resetCell(cell) {
    const originalIndex = cell.dataset.index;
    cell.innerHTML = originalContent[originalIndex];
    cell.style.fontSize = "50px";
  }

  function resetFirstCell() {
    const firstCell = paths.normal[0].element;
    firstCell.innerHTML = originalContent[firstCell.dataset.index];
    firstCell.style.fontSize = "50px";
  }

  function checkCellActions(index) {
    const shields = [3, 8, 14];
    const challenges = [2, 4, 6, 9, 11, 13, 15, 17, 19];
    const tips = [5, 10, 12];

    let content = selectRandomContent();

    if (shields.includes(index)) {
      shieldsHandler(index);
    } else if (challenges.includes(index)) {
      changeChallengeContent(content.question);
      checkAnswer(content.answer);
      openTip(content.tip);
    } else if (tips.includes(index)) {
      handleTipCell();
    }
  }

  function shieldsHandler() {
    let shieldsDisplay = document.querySelector(".shieldsNum");
    gameState.user.shields++;
    shieldsDisplay.innerHTML = gameState.user.shields;
    gameState.hasShield = true;
    changeRegularContent(
      "Recebeste um escudo, estás protegido de perder peças",
      `/codebuddy/images/escaperoom/Assets/shield_popup.png`
    );
  }

  function openPopupChallenge() {
    const popupChallenge = document.getElementById("popup_challenge");
    const closeChallenge = elements.sendButton;
    popupChallenge.style.display = "block";
    closeChallenge.addEventListener("click", () => {
      popupChallenge.style.display = "none";
    });
  }

  function changeChallengeContent(newQuestion) {
    let questionContent = document.querySelector(".question");
    questionContent.innerHTML = newQuestion;
    openPopupChallenge();
  }

  function openRegularPopup() {
    const popupPieces = document.getElementById("regular_popup");
    const closeButton = document.querySelector(".close_button");
    popupPieces.style.display = "block";
    closeButton.addEventListener("click", () => {
      popupPieces.style.display = "none";
    });
  }

  function changeRegularContent(newLabel, newImg) {
    let popupLabel = document.querySelector(".regular_content");
    const popupImg = document.querySelector(".popup_img");
    popupLabel.innerHTML = newLabel;
    popupImg.src = newImg;

    openRegularPopup();
  }

  function selectRandomContent() {
    let randomIndex = Math.floor(Math.random() * challengeContents.length);
    let selectedContent = challengeContents[randomIndex];
    return selectedContent;
  }

  function checkAnswer(correctAnswer) {
    elements.sendButton.addEventListener(
      "click",
      () => {
        const userAnswer = elements.input.value.trim().toLowerCase();
        const piecesNum = document.querySelector(".piecesNum");
        const shieldsNum = document.querySelector(".shieldsNum");
        if (userAnswer !== "" && userAnswer === correctAnswer) {
          gameState.user.pieces++;
          piecesNum.innerHTML = gameState.user.pieces;
          changeRegularContent(
            "Acertaste na resposta e ganhase uma peça",
            `/codebuddy/images/escaperoom/Assets/piece_popup.png`
          );

          if (gameState.user.pieces === 3) {
            moveToBlockCell();
            blockedPath = false;
          }
        } else if (gameState.user.pieces > 0 && gameState.hasShield) {
          gameState.user.shields--;
          shieldsNum.innerHTML = gameState.user.shields;
          changeRegularContent(
            "Falhaste a resposta mas como estavas protegido pelo escudo não perdeste peças",
            `/codebuddy/images/escaperoom/Assets/sad_face.png`
          );
          gameState.hasShield = false;
        } else if (gameState.user.pieces !== 0) {
          gameState.user.pieces--;
          piecesNum.innerHTML = gameState.user.pieces;
          changeRegularContent(
            "Falhaste a resposta e perdeste uma peça ",
            `/codebuddy/images/escaperoom/Assets/sad_face.png`
          );
        }
        unlockPath();

        elements.input.value = "";
      },
      { once: true }
    );
  }

  function unlockPath() {
    const padlock = document.querySelector(".padlock");
    if (gameState.user.pieces === 3 && blockedPath) {
      changeRegularContent("Desbloqueaste o caminho", `/codebuddy/images/escaperoom/Assets/unlock.png`);
      padlock.src = `/codebuddy/images/escaperoom/Assets/unlock_popup.png`;
    }
  }

  function handleTipCell() {
    changeRegularContent(
      "Recebeste uma dica para o próximo desafio",
      "/codebuddy/images/escaperoom/Assets/tip_popup.png"
    );

    gameState.user.tips++;
    elements.tipNum.innerHTML = gameState.user.tips;
    gameState.tip = true;
    elements.tipImg.src = "/codebuddy/images/escaperoom/Assets/tip_popup.png";
  }

  function openTip(selectedTip) {
    elements.tipImg.addEventListener(
      "click",
      () => {
        changeRegularContent(selectedTip, '/codebuddy/images/escaperoom/Assets/exclamation_point.png');
        if (gameState.user.tips > 0) {
          gameState.user.tips--;
          elements.tipNum.innerHTML = gameState.user.tips;
        } else if (gameState.user.tips === 0) {
          gameState.tip = false;
          elements.tipImg.src = "";
        }
      },
      { once: true }
    );
  }

  function moveToBlockCell() {
    const targetIndex = 16;
    const targetCell = paths.normal[targetIndex].element;
    const previousCell = paths.normal[gameState.user.position].element;

    gameState.user.position = targetIndex;
    gameState.previousCell = targetCell;

    resetCell(previousCell);
    targetCell.innerHTML = gameState.playerPiece;
    targetCell.style.fontSize = "30px";
    styleCell(targetCell, false);

    changeRegularContent("Desbloqueaste o caminho !", `/codebuddy/images/escaperoom/Assets/unlock_popup.png`);

    movingForward = true;
    elements.input.value = "";
  }

  function moveToFinalCell() {
    const finalIndex = 21;
    const finalCell = paths.normal[finalIndex].element;
    const previousCell = paths.normal[gameState.user.position].element;

    gameState.user.position = finalIndex;
    gameState.previousCell = finalCell;

    resetCell(previousCell);
    finalCell.innerHTML = gameState.playerPiece;
    finalCell.style.fontSize = "30px";
    styleCell(finalCell, false);
    setupCellClick(finalCell, 21);

    stopTimer();
    showRaking();
  }

  function showRaking() {
    const minutes = Math.floor(elapsedTime / 60);

    if (minutes < 10) {
      changeRegularContent(
        "Concluiste o jogo em menos de 1o minutos e recebeste uma medalha dourada",
        "/codebuddy/images/escaperoom/Assets/first_trophy.png"
      );
    } else if (minutes => 10 && minutes <= 20) {
      changeRegularContent("Ganhaste uma medalha dourada pelo tempo que demoraste a concluir o jogo", "/codebuddy/images/escaperoom/Assets/second_trophy.png");
    } else {
      changeRegularContent("Concluiste o jogo e ganhaste uma medalha de bronze", "/codebuddy/images/escaperoom/Assets/third_trophy.png");
    }
  }

  initializeGame();
});
