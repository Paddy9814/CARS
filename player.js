document.addEventListener('DOMContentLoaded', () => {
  const steps = [
    {
      task: "McQueen braucht dringend neue Reifen. Hilf ihm sie zu wechseln, damit der Roadtrip starten kann!",
      correct: 'btn3',
      image: 'Reifen.png'
    },
    {
      task: "Oh nein! McQueen ist wohl zu schnell gefahren - bezahle den Strafzettel.",
      correct: 'btn2',
      image: 'dreckig.png'
    },
    {
      task: "Ein toller Roadtrip bisher. Aber im Canyon wurde es etwas staubig. Wasche McQueen!",
      correct: 'btn4',
      image: 'sauber.png'
    },
    {
      task: "McQueen hat Durst! Gib ihm Energie um die letzten Meter seiner Reise zu meistern.",
      correct: 'btn5',
      image: 'satt.png'
    },
    {
      task: "Wir sind angekommen. Mache McQueens Signature-Move um die Fans zu beeindrucken!",
      correct: 'btn1',
      image: 'Kachow.png'
    }
  ];

  let currentStep = 0;

  const taskText = document.querySelector('#taskText');
  const carImage = document.querySelector('#carImage');

  const buttons = {
    btn1: document.querySelector('#btn1'),
    btn2: document.querySelector('#btn2'),
    btn3: document.querySelector('#btn3'),
    btn4: document.querySelector('#btn4'),
    btn5: document.querySelector('#btn5')
  };

  // Map für aktive Flash-Timeouts, um Mehrfachklicks zu vermeiden
  const flashTimeouts = new Map();

  function updateTask() {
    const step = steps[currentStep];
    taskText.setAttribute('value', step.task);
  }

  function flashColor(button, color, duration = 500) {
    const originalColor = 'white'; // feste Standardfarbe

    // Timeout ggf. löschen, wenn noch aktiv
    if (flashTimeouts.has(button)) {
      clearTimeout(flashTimeouts.get(button));
    }

    // Farbe setzen
    button.setAttribute('material', 'color', color);

    // Timeout zum Zurücksetzen
    const timeoutId = setTimeout(() => {
      button.setAttribute('material', 'color', originalColor);
      flashTimeouts.delete(button);
    }, duration);

    flashTimeouts.set(button, timeoutId);
  }

  function handleClick(id) {
    const step = steps[currentStep];
    const sky = document.querySelector('#straße'); // Hintergrund

    if (id === step.correct) {
      flashColor(buttons[id], 'green', 500);
      carImage.setAttribute('src', step.image);

      // Hintergrund wechseln, wenn btn1 (Blitz) geklickt wird
      if (id === 'btn1') {
        sky.setAttribute('src', 'szeneende.PNG');
        sky.setAttribute('rotation', '0 210 0');
      }

      // Hintergrund wechseln, wenn btn2 (Chief) geklickt wird
      if (id === 'btn2') {
        sky.setAttribute('src', 'szenecanyon.jpg');
        sky.setAttribute('rotation', '0 90 0');
      }

      // Hintergrund wechseln, wenn btn3 (Guido) geklickt wird
      if (id === 'btn3') {
        sky.setAttribute('src', 'szeneroadtrip.jpg');
        sky.setAttribute('rotation', '0 90 0');
      }

      // Hintergrund wechseln, wenn btn4 (waschen) geklickt wird
      if (id === 'btn4') {
        sky.setAttribute('src', 'szenetanken.JPG');
        sky.setAttribute('rotation', '0 0 0');
      }

      // Hintergrund wechseln, wenn btn5 (Öl) geklickt wird
      if (id === 'btn5') {
        sky.setAttribute('src', 'szeneende.PNG');
        sky.setAttribute('rotation', '0 90 0');
      }

      currentStep++;

      if (currentStep < steps.length) {
        setTimeout(updateTask, 600);
      } else {
        stopTimer();  // TIMER STOPPEN, wenn alle Schritte geschafft
        taskText.setAttribute('value', "Ka-chow! McQueen ist jetzt bereit sein Rennen zu gewinnen!");
      }
    } else {
      flashColor(buttons[id], 'red', 300);
    }
  }

  // Event Listener für alle Buttons
  Object.keys(buttons).forEach(id => {
    buttons[id].addEventListener('click', () => handleClick(id));
  });

  // Initiale Aufgabe setzen
  updateTask();

  // NEU: Startbildschirm-Overlay steuern
  const startScreen = document.querySelector('#startScreen');
  const startButton = document.querySelector('#startButton');
  const music = document.querySelector('#backgroundMusic');

  // NEU: Timer-Text oben links
  const timerText = document.querySelector('#timerText');

  let timerDuration = 45; // Sekunden
  let timerInterval = null;

  function startTimer() {
    let timeLeft = timerDuration;
    timerText.setAttribute('visible', 'true');
    timerText.setAttribute('value', `Zeit: ${timeLeft}s`);

    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.setAttribute('value', `Zeit: ${timeLeft}s`);

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerText.setAttribute('visible', 'false');

        // Prüfen, ob noch nicht am Ende
        if (currentStep < steps.length) {
          showFailScreen();
        }
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerText.setAttribute('visible', 'false');
  }

  function showFailScreen() {
  resetToStartState();

  // Text anpassen für Fehlversuch
  const failText = document.querySelector('#startScreenText');
  failText.setAttribute('value', "Zeit abgelaufen! Du hast es nicht rechtzeitig zum Rennen geschafft.");

  const startButtonText = document.querySelector('#startButtonText');
  startButtonText.setAttribute('value', "Versuche es erneut");
}


  startButton.addEventListener('click', () => {
    music.play();
    startScreen.setAttribute('visible', 'false'); // Startbildschirm ausblenden
    updateTask(); // erste Aufgabe anzeigen
    startTimer();

    // Reset Startscreen Text & Button für normalen Start
    const failText = document.querySelector('#startScreenText');
    failText.setAttribute('value', "Willkommen beim Lightning McQueen Roadtrip!\nHilf McQueen durch verschiedene Aufgaben.\nKlicke auf die richtigen Freunde, um ihn zu unterstützen!");

    const startButtonText = document.querySelector('#startButtonText');
    startButtonText.setAttribute('value', "Start");
  });

  function resetToStartState() {
  // Timer stoppen und Text ausblenden
  clearInterval(timerInterval);
  timerText.setAttribute('visible', 'false');

  // Aktuellen Schritt zurücksetzen
  currentStep = 0;

  // McQueen-Bild und Hintergrundbild zurücksetzen
  const sky = document.querySelector('#straße');
  sky.setAttribute('src', 'szenestart.jpg'); // Dein Startbild
  sky.setAttribute('rotation', '0 230 0');

  carImage.setAttribute('src', 'Start.png'); // Dein Startbild von McQueen

  // Startbildschirm wieder anzeigen
  startScreen.setAttribute('visible', 'true');

  // Text & Button auf Anfang setzen
  const failText = document.querySelector('#startScreenText');
  failText.setAttribute('value', "Willkommen beim Lightning McQueen Roadtrip!\nHilf McQueen durch verschiedene Aufgaben.\nKlicke auf die richtigen Freunde, um ihn zu unterstützen!");

  const startButtonText = document.querySelector('#startButtonText');
  startButtonText.setAttribute('value', "Start");
}

});
