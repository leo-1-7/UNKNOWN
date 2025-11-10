(function () {
  const loadingScreen = document.getElementById('loading-screen');
  const passwordScreen = document.getElementById('password-screen');
  const menuScreen = document.getElementById('menu-screen');
  const selectionScreen = document.getElementById('selection-screen');
  const messageScreen = document.getElementById('message-screen');
  const cakeScreen = document.getElementById('cake-screen');
  
  // Password screen elements
  const passwordInput = document.getElementById('password-input');
  const passwordSubmitBtn = document.getElementById('password-submit-btn');
  const welcomeMessage = document.getElementById('welcome-message');
  
  // Caps Lock detection
  let isCapsLockOn = false;

  const btnExitMain = document.getElementById('btn-exit-main');
  const btnOpen = document.getElementById('btn-open');
  const btnOpenMessage = document.getElementById('btn-open-message');
  const btnOpenCakeSelection = document.getElementById('btn-open-cake-selection');
  const btnExitMessage = document.getElementById('btn-exit-message');
  const btnBackToMainMenuMessage = document.getElementById('btn-back-to-main-menu-message');
  const btnBackToMainMenuCake = document.getElementById('btn-back-to-main-menu-cake');
  const btnExitCake = document.getElementById('btn-exit-cake');
  const balloonsLayer = document.querySelector('#message-screen .balloons-layer');
  const paperText = document.getElementById('paper-text');
  const interactiveCake = document.getElementById('interactive-cake');
  const candleCountDisplay = document.getElementById('candleCount');

  const EXIT_URL = 'https://websitecursor.com/downloads';
  const COUNTDOWN_STORAGE_KEY = 'birthdayCountdownStartTime';

  function showScreen(screenEl) {
    for (const el of [loadingScreen, passwordScreen, menuScreen, selectionScreen, messageScreen, cakeScreen]) {
      if (!el) continue;
      el.classList.remove('active');
    }
    if (screenEl) screenEl.classList.add('active');
    
    // If showing cake screen, check if countdown should resume
    if (screenEl === cakeScreen) {
      const savedStartTime = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
      const countdownDisplay = document.getElementById('countdown-display');
      
      const countdownTitle = document.querySelector('.countdown-title');
      
      if (savedStartTime && !countdownInterval) {
        // Resume countdown if there's a saved time and no active interval
        // This means candles were already blown, so show the countdown
        if (countdownDisplay) {
          countdownDisplay.classList.add('visible');
        }
        if (countdownTitle) {
          countdownTitle.classList.add('visible');
        }
        startCountdown();
      } else {
        // Hide countdown if candles haven't been blown yet
        if (countdownDisplay) {
          countdownDisplay.classList.remove('visible');
        }
        if (countdownTitle) {
          countdownTitle.classList.remove('visible');
        }
      }
    }
  }

  // Password validation logic
  let usedPasswords = new Set();
  const VALID_PASSWORDS = [
    "HAPPY010",
    "CANNOTBITE23",
    "SPICELATTE",
    "MOPTHEFLOOR",
    "Moon!37Cat",
    "River9$Tree",
    "Star_88Lion",
    "Book#42Sun",
    "Leaf3@Stone",
    "Sky_77Boat",
    "Tiger#84Moon",
    "Rain5$Bird",
    "Rock_62Star",
    "Sun!93Tree",
    "Frog7@Lake",
    "Cloud#58Dog",
    "Wind2$Cat",
    "GROWALL40",
    "REPLYTOME",
    "FORFOXTRADE5$",
    "CANTEATS76#"
  ];

  function initializePasswordScreen() {
    // Check if there are any unused passwords left
    if (usedPasswords.size >= VALID_PASSWORDS.length) {
      // All passwords used, go directly to main menu
      showScreen(menuScreen);
      return;
    }
    
    // Show password screen
    showScreen(passwordScreen);
    
    // Reset password screen elements
    if (passwordInput) {
      passwordInput.value = '';
      const passwordContainer = passwordInput.parentNode;
      passwordContainer.style.display = 'flex'; // Show the container with input and button
    }
    
    if (welcomeMessage) {
      welcomeMessage.classList.add('hidden');
    }
    
    // Clear any error messages
    const errorMsg = document.getElementById('error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
    
    // Focus on password input
    setTimeout(() => {
      if (passwordInput) {
        passwordInput.focus();
      }
    }, 100);
  }

  function validatePassword() {
    // Get fresh reference to elements
    const input = document.getElementById('password-input');
    const btn = document.getElementById('password-submit-btn');
    const container = input ? input.parentNode : null;
    
    if (!input) {
      console.error('Password input not found');
      return;
    }
    
    const enteredPassword = input.value.trim();
    
    console.log('Entered password:', enteredPassword);
    console.log('Valid passwords:', VALID_PASSWORDS);
    console.log('Is valid password:', VALID_PASSWORDS.includes(enteredPassword));
    console.log('Is already used:', usedPasswords.has(enteredPassword));
    
    // Check if password is valid
    const isValidPassword = VALID_PASSWORDS.includes(enteredPassword);
    const isAlreadyUsed = usedPasswords.has(enteredPassword);
    
    if (isValidPassword && !isAlreadyUsed) {
      // Correct password - hide password input container and instruction messages
      if (container) {
        container.style.display = 'none';
      }
      
      // Hide the caps message and instruction message
      const capsMessage = document.getElementById('password-caps-message');
      const instructionMessage = document.getElementById('password-instruction');
      
      if (capsMessage) {
        capsMessage.style.display = 'none';
      }
      if (instructionMessage) {
        instructionMessage.style.display = 'none';
      }
      
      // Show welcome message
      if (welcomeMessage) {
        welcomeMessage.classList.remove('hidden');
        
        // Add animation class for styling
        setTimeout(() => {
          welcomeMessage.classList.add('show');
        }, 100);
      }
      
      // Auto-proceed to main menu after 3 seconds
      setTimeout(() => {
        showScreen(menuScreen);
      }, 3000);
      
      // Mark this specific password as used
      usedPasswords.add(enteredPassword);
      saveUsedPasswords();
      
    } else if (isValidPassword && isAlreadyUsed) {
      // Password is valid but already used
      showErrorMessage(false, 'PASSWORD HAS BEEN ALREADY USED');
      
      // Flash the input field
      input.style.animation = 'shake 0.5s ease-in-out';
      input.value = '';
      
      // Flash the button
      if (btn) {
        btn.style.animation = 'button-flash 0.5s ease-in-out';
        setTimeout(() => {
          btn.style.animation = '';
        }, 500);
      }
      
      // Flash the container
      if (container) {
        container.style.animation = 'container-flash 0.5s ease-in-out';
        setTimeout(() => {
          container.style.animation = '';
        }, 500);
      }
      
      setTimeout(() => {
        input.style.animation = '';
        input.focus();
      }, 500);
      
    } else {
      // Wrong password - check if user typed mostly lowercase (indicating Caps Lock is off)
      // Count lowercase and uppercase letters
      const lowercaseCount = (enteredPassword.match(/[a-z]/g) || []).length;
      const uppercaseCount = (enteredPassword.match(/[A-Z]/g) || []).length;
      
      // If there are lowercase letters and no (or very few) uppercase letters, Caps Lock is likely off
      const showCapsMessage = lowercaseCount > 0 && uppercaseCount === 0;
      showErrorMessage(showCapsMessage);
      
      // Flash the input field
      input.style.animation = 'shake 0.5s ease-in-out';
      input.value = '';
      
      // Flash the button
      if (btn) {
        btn.style.animation = 'button-flash 0.5s ease-in-out';
        setTimeout(() => {
          btn.style.animation = '';
        }, 500);
      }
      
      // Flash the container
      if (container) {
        container.style.animation = 'container-flash 0.5s ease-in-out';
        setTimeout(() => {
          container.style.animation = '';
        }, 500);
      }
      
      setTimeout(() => {
        input.style.animation = '';
        input.focus();
      }, 500);
    }
  }

  function showErrorMessage(showCapsMessage = false, customMessage = null) {
    // Remove any existing error message
    const existingError = document.getElementById('error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Get fresh reference to password input
    const input = document.getElementById('password-input');
    if (!input || !input.parentNode) {
      console.error('Cannot show error message - password input or container not found');
      return;
    }
    
    // Create new error message
    const errorMsg = document.createElement('div');
    errorMsg.id = 'error-message';
    errorMsg.className = 'error-message';
    
    // Use custom message if provided, otherwise use default logic
    if (customMessage) {
      errorMsg.textContent = customMessage;
    } else {
      errorMsg.textContent = showCapsMessage ? 'USE CAPSLOCK' : 'WRONG PASSWORD';
    }
    
    // Insert after password input container
    const passwordContainer = input.parentNode;
    if (passwordContainer.parentNode) {
      passwordContainer.parentNode.insertBefore(errorMsg, passwordContainer.nextSibling);
    }
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
      if (errorMsg.parentNode) {
        errorMsg.remove();
      }
    }, 2000);
  }

  function saveUsedPasswords() {
    const savedPasswords = Array.from(usedPasswords);
    localStorage.setItem('birthdayUsedPasswords', JSON.stringify(savedPasswords));
  }


  function startLoading() {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
      // Get elements directly to ensure they exist
      const pt = document.getElementById('progress-text');
      const pf = document.getElementById('progress-fill');
      
      if (!pt || !pf) {
        console.error('Loading elements not found', { pt, pf });
        // If elements not found, skip loading and go to password screen
        setTimeout(() => initializePasswordScreen(), 100);
        return;
      }
      
      console.log('Starting loading animation');
      
      // Initialize to 0%
      pt.textContent = '0%';
      pf.style.width = '0%';
      
      const duration = 12000; // 12 seconds total for slower loading
      const startTime = Date.now();
      const updateInterval = 50; // Update every 50ms for smooth animation

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / duration) * 100);
        
        const shown = Math.round(progress);
        pt.textContent = `${shown}%`;
        pf.style.width = `${progress}%`;

        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => initializePasswordScreen(), 450);
        }
      }, updateInterval);
    }, 100);
  }

  function exitToUrl() {
    // Attempt to close tab if opened by script, otherwise redirect
    window.open('', '_self');
    window.close();
    setTimeout(() => {
      window.location.href = EXIT_URL;
    }, 200);
  }

  // Initialize all event listeners
  function initializeEventListeners() {
    // Re-query elements if they're null (safety check)
    const pInput = document.getElementById('password-input');
    const pBtn = document.getElementById('password-submit-btn');
    
    // Wire up buttons
    if (btnExitMain) {
      btnExitMain.addEventListener('click', exitToUrl);
    }
    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        showScreen(selectionScreen);
      });
    }
    if (btnOpenMessage) {
      btnOpenMessage.addEventListener('click', () => {
        showScreen(messageScreen);
        try { spawnBalloons(30); } catch (_) { /* ignore */ }
      });
    }
    if (btnOpenCakeSelection) {
      btnOpenCakeSelection.addEventListener('click', () => {
        showScreen(cakeScreen);
        initializeInteractiveCake();
        // Don't start countdown yet - wait for candles to be blown
        // Hide countdown display and title initially
        const countdownDisplay = document.getElementById('countdown-display');
        const countdownTitle = document.querySelector('.countdown-title');
        if (countdownDisplay) {
          countdownDisplay.classList.remove('visible');
        }
        if (countdownTitle) {
          countdownTitle.classList.remove('visible');
        }
      });
    }
    if (btnBackToMainMenuMessage) {
      btnBackToMainMenuMessage.addEventListener('click', () => {
        showScreen(selectionScreen);
      });
    }
    if (btnBackToMainMenuCake) {
      btnBackToMainMenuCake.addEventListener('click', () => {
        cleanupCakeScreen();
        showScreen(selectionScreen);
      });
    }
    if (btnExitCake) {
      btnExitCake.addEventListener('click', () => {
        cleanupCakeScreen();
        exitToUrl();
      });
    }
    if (btnExitMessage) {
      btnExitMessage.addEventListener('click', exitToUrl);
    }
    
    // Cake info button and modal
    const cakeInfoBtn = document.getElementById('cake-info-btn');
    const cakeInfoModal = document.getElementById('cake-info-modal');
    const cakeInfoClose = document.getElementById('cake-info-close');
    
    if (cakeInfoBtn && cakeInfoModal) {
      cakeInfoBtn.addEventListener('click', () => {
        cakeInfoModal.classList.remove('hidden');
      });
    }
    
    if (cakeInfoClose && cakeInfoModal) {
      cakeInfoClose.addEventListener('click', () => {
        cakeInfoModal.classList.add('hidden');
      });
    }
    
    // Close modal when clicking outside
    if (cakeInfoModal) {
      cakeInfoModal.addEventListener('click', (e) => {
        if (e.target === cakeInfoModal) {
          cakeInfoModal.classList.add('hidden');
        }
      });
    }
    
    // Clickable asterisk to show reset timer button
    const clickableAsterisk = document.getElementById('clickable-asterisk');
    const resetTimerBtn = document.getElementById('reset-timer-btn');
    
    if (clickableAsterisk && resetTimerBtn) {
      clickableAsterisk.addEventListener('click', () => {
        // Toggle the reset button visibility
        resetTimerBtn.classList.toggle('hidden');
      });
      
      // Reset timer functionality
      resetTimerBtn.addEventListener('click', () => {
        // Reset countdown to 365 days
        countdownStartTime = Date.now();
        localStorage.setItem(COUNTDOWN_STORAGE_KEY, countdownStartTime.toString());
        
        // Update the countdown display immediately
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
        
        // Hide the reset button after resetting
        resetTimerBtn.classList.add('hidden');
        
        console.log("Countdown reset to 365 days");
      });
    }
    
    // Password info button and modal
    const passwordInfoBtn = document.getElementById('password-info-btn');
    const passwordInfoModal = document.getElementById('password-info-modal');
    const passwordInfoClose = document.getElementById('password-info-close');
    
    if (passwordInfoBtn && passwordInfoModal) {
      passwordInfoBtn.addEventListener('click', () => {
        passwordInfoModal.classList.remove('hidden');
      });
    }
    
    if (passwordInfoClose && passwordInfoModal) {
      passwordInfoClose.addEventListener('click', () => {
        passwordInfoModal.classList.add('hidden');
      });
    }
    
    // Close modal when clicking outside
    if (passwordInfoModal) {
      passwordInfoModal.addEventListener('click', (e) => {
        if (e.target === passwordInfoModal) {
          passwordInfoModal.classList.add('hidden');
        }
      });
    }
    
    // Password input event listeners
    const inputEl = pInput || passwordInput;
    if (inputEl) {
      // Detect if device is mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       (window.matchMedia && window.matchMedia("(max-width: 768px)").matches);
      
      inputEl.addEventListener('keydown', (event) => {
        // Detect Caps Lock state on keydown as well (more reliable)
        if (event.getModifierState) {
          isCapsLockOn = event.getModifierState('CapsLock');
        }
        
        // On mobile, handle Enter key to insert paragraph spacing instead of submitting
        if (isMobile && event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          
          const input = event.target;
          const start = input.selectionStart;
          const end = input.selectionEnd;
          const value = input.value;
          
          // Insert double space (paragraph spacing representation) instead of submitting
          const newValue = value.substring(0, start) + '  ' + value.substring(end);
          input.value = newValue;
          
          // Set cursor position after the inserted spaces
          const newCursorPos = start + 2;
          input.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
      
      inputEl.addEventListener('keypress', (event) => {
        // Detect Caps Lock state
        if (event.getModifierState) {
          isCapsLockOn = event.getModifierState('CapsLock');
        }
        
        // Only submit on Enter if not mobile (mobile is handled in keydown)
        if (!isMobile && event.key === 'Enter') {
          validatePassword();
        }
      });
      
      
      inputEl.addEventListener('keyup', (event) => {
        // Detect Caps Lock state on keyup
        if (event.getModifierState) {
          isCapsLockOn = event.getModifierState('CapsLock');
        }
      });
      
      inputEl.addEventListener('input', (event) => {
        // Clear any existing error styling when user types
        if (inputEl.style.animation === 'shake 0.5s ease-in-out') {
          inputEl.style.animation = '';
        }
      });
    } else {
      console.error('Password input element not found');
    }

    // Password submit button event listener
    const btnEl = pBtn || passwordSubmitBtn;
    if (btnEl) {
      btnEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Submit button clicked');
        const input = document.getElementById('password-input');
        if (input) {
          validatePassword();
        } else {
          console.error('Password input not found');
        }
      });
    } else {
      console.error('Password submit button not found');
    }
  }

  // Interactive Cake functionality
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('hbd.mp3');
  audio.preload = 'auto'; // Preload the audio
  let blowOutInterval;
  let confettiInterval;
  let backgroundNoiseLevel = 0; // Track background noise level
  
  // Countdown Timer functionality
  let countdownInterval = null;
  let countdownStartTime = null;
  const COUNTDOWN_DURATION = 365 * 24 * 60 * 60 * 1000; // Exactly 365 days in milliseconds (31,536,000,000 ms)

  function initializeInteractiveCake() {
    if (!interactiveCake) return;
    
    // Clear existing candles
    candles = [];
    const existingCandles = interactiveCake.querySelectorAll('.candle');
    existingCandles.forEach(candle => candle.remove());

    // Add initial candles
    addCandle(125, 50); // Center candle
    addCandle(100, 40); // Left candle
    addCandle(150, 40); // Right candle

    // Add microphone status indicator
    addMicrophoneIndicator();

    // Setup microphone with user interaction
    setupMicrophoneWithInteraction();
    
    // Enable audio on user interaction
    enableAudioOnInteraction();
    
    // Reset any existing intervals
    if (blowOutInterval) {
      clearInterval(blowOutInterval);
      blowOutInterval = null;
    }
    
    // Clear any existing confetti
    clearConfetti();
    
    // Reset confetti library if needed
    if (typeof confetti !== 'undefined' && confetti.reset) {
      confetti.reset();
    }
  }
  
  function enableAudioOnInteraction() {
    // Add click handler to enable audio
    const enableAudio = () => {
      audio.load(); // Reload audio
      console.log("Audio enabled for user interaction");
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
    
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });
  }
  
  function setupMicrophoneWithInteraction() {
    // Setup microphone immediately without button
    setupMicrophone();
  }

  function addMicrophoneIndicator() {
    // Microphone indicator removed - no status messages will be shown
  }


  function updateMicrophoneStatus(status) {
    // Microphone status messages removed - no messages will be shown
  }

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    if (candleCountDisplay) {
      candleCountDisplay.textContent = activeCandles;
    }
  }

  function calibrateBackgroundNoise() {
    if (!analyser) return;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let samples = [];
    
    // Take multiple samples over 2 seconds to get average background noise
    const sampleInterval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      
      let highFreqSum = 0;
      const midPoint = Math.floor(bufferLength / 2);
      
      for (let i = midPoint; i < bufferLength; i++) {
        highFreqSum += dataArray[i];
      }
      
      const highFreqAvg = highFreqSum / midPoint;
      samples.push(highFreqAvg);
      
      if (samples.length >= 10) { // Take 10 samples (2 seconds)
        clearInterval(sampleInterval);
        // Use median instead of average to avoid outliers
        samples.sort((a, b) => a - b);
        backgroundNoiseLevel = samples[Math.floor(samples.length / 2)];
        console.log("Background noise level calibrated:", backgroundNoiseLevel);
      }
    }, 200);
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    interactiveCake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  interactiveCake.addEventListener("click", function (event) {
    // Check if clicking on an existing candle
    const clickedCandle = event.target.closest('.candle');
    if (clickedCandle) {
      // If clicking on a candle, don't add a new one
      return;
    }
    
    // Only add candle if not clicking on existing elements
    const rect = interactiveCake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    
    // Only allow candle placement at the top of the cake (top 50px)
    if (top <= 50) {
      addCandle(left, top);
    }
  });

  function isBlowing() {
    if (!analyser) return false;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Focus on higher frequencies (blowing creates more high-frequency noise)
    let highFreqSum = 0;
    let lowFreqSum = 0;
    const midPoint = Math.floor(bufferLength / 2);
    
    for (let i = 0; i < bufferLength; i++) {
      if (i < midPoint) {
        lowFreqSum += dataArray[i];
      } else {
        highFreqSum += dataArray[i];
      }
    }
    
    const highFreqAvg = highFreqSum / midPoint;
    const lowFreqAvg = lowFreqSum / midPoint;
    
    // Blowing should have significantly more high-frequency content
    const freqRatio = highFreqAvg / (lowFreqAvg + 1); // +1 to avoid division by zero
    
    // Dynamic threshold based on background noise - more responsive
    const dynamicThreshold = Math.max(backgroundNoiseLevel * 2, 15); // At least 2x background noise or 15 minimum
    
    // More responsive detection - need high volume AND frequency ratio above background
    const isBlowingDetected = highFreqAvg > dynamicThreshold && freqRatio > 1.8 && highFreqAvg > (backgroundNoiseLevel + 10);
    
    // Fallback: if frequency analysis fails, use simple volume detection
    const fallbackDetection = highFreqAvg > (backgroundNoiseLevel * 1.5 + 20);
    
    const finalDetection = isBlowingDetected || fallbackDetection;
    
    console.log('High freq:', highFreqAvg, 'Low freq:', lowFreqAvg, 'Ratio:', freqRatio, 'Background:', backgroundNoiseLevel, 'Threshold:', dynamicThreshold, 'Blowing:', finalDetection);
    return finalDetection;
  }

  function blowOutCandles() {
    if (candles.length === 0) return;
    
    let blownOut = 0;
    const hasUnlitCandles = candles.some((candle) => !candle.classList.contains("out"));
    
    // Only proceed if there are unlit candles AND microphone is working
    if (!hasUnlitCandles || !analyser) {
      return;
    }
    
    const blowingDetected = isBlowing();
    
    if (blowingDetected) {
      console.log("Blowing detected! Attempting to blow out candles...");
      
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.1) { // Lower chance to make it more realistic
          candle.classList.add("out");
          blownOut++;
          console.log("Candle blown out!");
        }
      });

      if (blownOut > 0) {
        updateCandleCount();
        console.log(`${blownOut} candles blown out!`);
      }

      // Check if all candles are out
      if (candles.every((candle) => candle.classList.contains("out"))) {
        console.log("All candles blown out! Triggering celebration...");
        
        // Stop the detection interval to prevent multiple celebrations
        if (blowOutInterval) {
          clearInterval(blowOutInterval);
          blowOutInterval = null;
        }
        
        // Show and start countdown
        const countdownDisplay = document.getElementById('countdown-display');
        const countdownTitle = document.querySelector('.countdown-title');
        if (countdownDisplay) {
          countdownDisplay.classList.add('visible');
        }
        if (countdownTitle) {
          countdownTitle.classList.add('visible');
        }
        startCountdown();
        
        // Play audio immediately
        audio.currentTime = 0;
        audio.play().catch(err => {
          console.log("Audio play failed:", err);
        });
        
        setTimeout(function() {
          triggerConfetti();
          endlessConfetti();
        }, 200);
      }
    } else {
      // Update status to show ready state
    }
  }

  function setupMicrophone() {
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ 
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 44100
          }
        })
        .then(function (stream) {
          console.log("Microphone access granted");
          
          // Create audio context with better settings
          audioContext = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 44100
          });
          
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048; // Even higher resolution for better frequency analysis
          analyser.smoothingTimeConstant = 0.05; // Less smoothing for more responsive detection
          analyser.minDecibels = -100; // Lower threshold to catch quieter sounds
          analyser.maxDecibels = -5; // Higher max to allow louder sounds
          
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          
          // Wait for microphone to stabilize, then calibrate background noise
          setTimeout(() => {
            calibrateBackgroundNoise();
            // Start checking for blowing with less frequent intervals
            blowOutInterval = setInterval(blowOutCandles, 200);
            console.log("Microphone setup complete - detection started");
          }, 2000); // 2 second delay to let microphone stabilize
        })
        .catch(function (err) {
          console.log("Unable to access microphone: " + err);
          // Fallback: allow manual candle blowing by clicking
          setupManualBlowing();
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
      setupManualBlowing();
    }
  }

  function setupManualBlowing() {
    // Fallback: allow users to click on candles to blow them out
    console.log("Setting up manual candle blowing as fallback");
    
    // Remove any existing event listeners first
    document.removeEventListener('click', handleManualCandleBlow);
    document.removeEventListener('touchend', handleManualCandleBlow);
    
    // Add new event listeners
    document.addEventListener('click', handleManualCandleBlow);
    document.addEventListener('touchend', handleManualCandleBlow);
  }
  
  function handleManualCandleBlow(event) {
    // Only handle clicks directly on candle flames, not the entire candle area
    const flame = event.target.closest('.flame');
    if (flame) {
      const candle = flame.parentElement;
      if (candle && !candle.classList.contains('out')) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log("Manual candle blow detected");
        candle.classList.add('out');
        updateCandleCount();
        
        // Check if all candles are out
        if (candles.every((c) => c.classList.contains("out"))) {
          console.log("All candles blown out manually! Triggering celebration...");
          
          // Show and start countdown
          const countdownDisplay = document.getElementById('countdown-display');
          const countdownTitle = document.querySelector('.countdown-title');
          if (countdownDisplay) {
            countdownDisplay.classList.add('visible');
          }
          if (countdownTitle) {
            countdownTitle.classList.add('visible');
          }
          startCountdown();
          
          // Play audio immediately
          audio.currentTime = 0;
          audio.play().catch(err => {
            console.log("Audio play failed:", err);
          });
          
          setTimeout(function() {
            triggerConfetti();
            endlessConfetti();
          }, 200);
        }
      }
    }
  }

  function playAudio() {
    // Reset audio to beginning
    audio.currentTime = 0;
    
    // Play audio
    audio.play().catch(err => {
      console.log("Audio play failed:", err);
    });
  }

  function triggerConfetti() {
    console.log("Triggering confetti...");
    
    // Clear any existing confetti first
    clearConfetti();
    
    if (typeof confetti !== 'undefined' && confetti) {
      try {
        // Reset confetti library
        if (confetti.reset) {
          confetti.reset();
        }
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        console.log("Confetti triggered successfully");
      } catch (error) {
        console.error("Confetti error:", error);
        // Fallback: try again after a short delay
        setTimeout(() => {
          if (typeof confetti !== 'undefined' && confetti) {
            try {
              confetti({
                particleCount: 50,
                spread: 50,
                origin: { y: 0.5 }
              });
            } catch (e) {
              console.error("Fallback confetti failed:", e);
              createFallbackConfetti();
            }
          } else {
            createFallbackConfetti();
          }
        }, 100);
      }
    } else {
      console.error("Confetti library not loaded, using fallback...");
      // Fallback confetti using CSS animations
      createFallbackConfetti();
    }
  }
  
  function createFallbackConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)]};
        left: ${Math.random() * 100}%;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      `;
      confettiContainer.appendChild(confetti);
    }
    
    document.body.appendChild(confettiContainer);
    
    // Add CSS animation if not exists
    if (!document.getElementById('confetti-animation')) {
      const style = document.createElement('style');
      style.id = 'confetti-animation';
      style.textContent = `
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Remove after animation
    setTimeout(() => {
      if (confettiContainer.parentNode) {
        confettiContainer.parentNode.removeChild(confettiContainer);
      }
    }, 5000);
  }

  function endlessConfetti() {
    console.log("Starting endless confetti...");
    
    // Clear any existing endless confetti first
    if (confettiInterval) {
      clearInterval(confettiInterval);
      confettiInterval = null;
    }
    
    if (typeof confetti !== 'undefined' && confetti) {
      confettiInterval = setInterval(function() {
        try {
          confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0 }
          });
        } catch (error) {
          console.error("Endless confetti error:", error);
          // Fallback to CSS confetti if canvas confetti fails
          createFallbackConfetti();
        }
      }, 1000);
    } else {
      console.error("Confetti library not loaded for endless confetti, using fallback...");
      // Use fallback confetti for endless mode
      confettiInterval = setInterval(function() {
        createFallbackConfetti();
      }, 2000);
    }
  }

  function clearConfetti() {
    // Clear confetti interval
    if (confettiInterval) {
      clearInterval(confettiInterval);
      confettiInterval = null;
    }
    
    // Clear any existing confetti canvas elements
    const confettiCanvases = document.querySelectorAll('canvas[style*="pointer-events: none"]');
    confettiCanvases.forEach(canvas => canvas.remove());
  }

  // Audio event listeners to handle playback issues
  audio.addEventListener('ended', function() {
    console.log("Audio ended, restarting...");
    audio.currentTime = 0;
    audio.play().catch(err => console.log("Audio restart failed:", err));
  });

  audio.addEventListener('error', function(e) {
    console.log("Audio error:", e);
  });

  // Load used passwords from localStorage
  function loadUsedPasswords() {
    try {
      const saved = localStorage.getItem('birthdayUsedPasswords');
      if (saved) {
        const savedPasswords = JSON.parse(saved);
        usedPasswords = new Set(savedPasswords);
        
        // Remove GROWALL40 from used passwords to make it available again
        usedPasswords.delete('GROWALL40');
        saveUsedPasswords(); // Save the updated list
      }
    } catch (error) {
      console.log('Error loading used passwords:', error);
      // If there's an error, start fresh
      usedPasswords = new Set();
    }
  }

  function startLoading() {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
      // Get elements directly to ensure they exist
      const pt = document.getElementById('progress-text');
      const pf = document.getElementById('progress-fill');
      
      if (!pt || !pf) {
        console.error('Loading elements not found', { pt, pf });
        // If elements not found, skip loading and go to password screen
        setTimeout(() => initializePasswordScreen(), 100);
        return;
      }
      
      console.log('Starting loading animation');
      
      // Initialize to 0%
      pt.textContent = '0%';
      pf.style.width = '0%';
      
      const duration = 12000; // 12 seconds total for slower loading
      const startTime = Date.now();
      const updateInterval = 50; // Update every 50ms for smooth animation

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / duration) * 100);
        
        const shown = Math.round(progress);
        pt.textContent = `${shown}%`;
        pf.style.width = `${progress}%`;

        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            showScreen(passwordScreen);
            initializePasswordScreen();
          }, 450);
        }
      }, updateInterval);
    }, 100);
  }

  // Initialize everything once DOM is ready
  function initialize() {
    loadUsedPasswords();
    setupAutoResize();
    initializeEventListeners();
    startLoading();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already loaded, initialize immediately
    initialize();
  }

  // Balloons
  function spawnBalloons(count) {
    if (!balloonsLayer) return;
    balloonsLayer.innerHTML = '';

    const colors = [
      '#ff6b6b', '#ff9f1c', '#ffd166', '#06d6a0', '#2ec4b6',
      '#4cc9f0', '#4361ee', '#b5179e', '#f94144', '#90be6d'
    ];

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'balloon';

      // Random size category
      const sizeRoll = Math.random();
      let width = 22, height = 30; // base medium
      if (sizeRoll < 0.4) { width = 16; height = 22; }       // small
      else if (sizeRoll < 0.8) { width = 22; height = 30; }  // medium
      else { width = 30; height = 40; }                      // large

      // Random horizontal start (leave margins)
      const left = 5 + Math.random() * 90;
      // Random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      const darker = darken(color, 0.28);
      const shadow = colorShadow(color, 0.25);

      // Random float duration and delay
      const floatDuration = 7 + Math.random() * 4;    // 7s–11s
      const delay = Math.random() * 1.2;              // 0–1.2s

      el.style.left = left + '%';
      el.style.setProperty('--balloon-color', color);
      el.style.setProperty('--balloon-color-dark', darker);
      el.style.setProperty('--balloon-shadow', shadow);
      el.style.color = color;
      el.style.animationDuration = `${floatDuration}s`;
      el.style.animationDelay = `${delay}s`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;

      // slight vertical offset to avoid same start line
      el.style.bottom = `${-120 - Math.floor(Math.random() * 80)}px`;

      // Cleanup after animation
      const ttl = (delay + floatDuration + 0.5) * 1000;
      setTimeout(() => { el.remove(); }, ttl);

      // Add glossy shine element
      const shine = document.createElement('div');
      shine.className = 'shine';
      el.appendChild(shine);

      // Add curly string as SVG path
      const stringWrap = document.createElement('div');
      stringWrap.className = 'balloon-string';

      // Randomize string width/height for variation
      const stringWidth = 18 + Math.random() * 20;   // 18–38px
      const stringHeight = 70 + Math.random() * 50;  // 70–120px
      stringWrap.style.width = `${stringWidth}px`;
      stringWrap.style.height = `${stringHeight}px`;

      const curl = createCurlyPath(stringWidth, stringHeight);
      stringWrap.appendChild(curl);

      el.appendChild(stringWrap);

      balloonsLayer.appendChild(el);
    }
  }

  // Color helpers
  function darken(hex, amt) {
    const { r, g, b } = hexToRgb(hex);
    const dr = Math.max(0, Math.round(r * (1 - amt)));
    const dg = Math.max(0, Math.round(g * (1 - amt)));
    const db = Math.max(0, Math.round(b * (1 - amt)));
    return rgbToHex(dr, dg, db);
  }

  // Auto-resize the message box for long text
  function setupAutoResize() {
    if (!paperText) return;
    const adjust = () => {
      paperText.style.height = 'auto';
      paperText.style.height = Math.max(320, paperText.scrollHeight) + 'px';
    };
    // Run once initially and whenever content changes programmatically
    adjust();
    // If you decide to make it editable later, this will keep resizing
    paperText.addEventListener('input', adjust);
  }

  function colorShadow(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    // darker mixed shadow
    const rr = Math.round(r * 0.25);
    const gg = Math.round(g * 0.25);
    const bb = Math.round(b * 0.25);
    return `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h.length === 3 ? h.split('').map(x => x + x).join('') : h, 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function rgbToHex(r, g, b) {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function createCurlyPath(w, h) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const path = document.createElementNS(svgNS, 'path');
    // Build a sine-like path with cubic Beziers
    const waves = 4 + Math.floor(Math.random() * 3); // 4–6 waves
    const amplitude = Math.max(6, Math.min(12, w * 0.28));
    let d = `M ${w/2} 0`;
    const segment = h / waves;
    for (let i = 0; i < waves; i++) {
      const y1 = segment * i + segment * 0.33;
      const y2 = segment * i + segment * 0.66;
      const y3 = segment * (i + 1);
      const dir = i % 2 === 0 ? 1 : -1;
      const x1 = w/2 + dir * amplitude;
      const x2 = w/2 - dir * amplitude;
      d += ` C ${x1} ${y1}, ${x2} ${y2}, ${w/2} ${y3}`;
    }

    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(0,0,0,0.45)');
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('stroke-linecap', 'round');

    svg.appendChild(path);
    return svg;
  }


  // Countdown Timer Functions
  function startCountdown() {
    // Clear any existing countdown interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    
    // Check if there's a saved countdown start time in localStorage
    // This persists even if user closes browser or navigates away
    const savedStartTime = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
    
    if (savedStartTime) {
      // Resume from saved time - countdown continues from where it left off
      countdownStartTime = parseInt(savedStartTime, 10);
      console.log("Resuming countdown from saved time:", new Date(countdownStartTime));
    } else {
      // Start new countdown and save it to localStorage
      // localStorage persists across browser sessions
      countdownStartTime = Date.now();
      localStorage.setItem(COUNTDOWN_STORAGE_KEY, countdownStartTime.toString());
      console.log("Starting new 365-day countdown and saving to localStorage");
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second - countdown continues running
    countdownInterval = setInterval(updateCountdown, 1000);
  }
  
  function updateCountdown() {
    if (!countdownStartTime) {
      // Try to load from localStorage if not set
      const savedStartTime = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
      if (savedStartTime) {
        countdownStartTime = parseInt(savedStartTime, 10);
      } else {
        return;
      }
    }
    
    const now = Date.now();
    const elapsed = now - countdownStartTime;
    const remaining = Math.max(0, COUNTDOWN_DURATION - elapsed);
    
    // Calculate days, hours, minutes, seconds (365 days total)
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    
    // Update display
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    
    if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Only clear saved time when countdown reaches zero (after 365 days)
    // Otherwise, it persists forever in localStorage
    if (remaining <= 0) {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
      // Only clear localStorage when countdown completes after full 365 days
      localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      countdownStartTime = null;
    }
  }
  
  // Function to update countdown even when not on cake screen (for background updates)
  function updateCountdownIfActive() {
    const savedStartTime = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
    if (savedStartTime && cakeScreen && cakeScreen.classList.contains('active')) {
      // Only update if we're on the cake screen
      if (!countdownStartTime) {
        countdownStartTime = parseInt(savedStartTime, 10);
      }
      if (!countdownInterval) {
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
      }
    }
  }

  // Cleanup function for cake screen
  function cleanupCakeScreen() {
    // Stop audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // Stop intervals
    if (blowOutInterval) {
      clearInterval(blowOutInterval);
      blowOutInterval = null;
    }

    if (confettiInterval) {
      clearInterval(confettiInterval);
      confettiInterval = null;
    }
    
    // Pause countdown interval (but keep the start time saved in localStorage)
    // The countdown continues in the background even when they leave or close browser
    // localStorage persists the start time permanently until countdown completes
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    // Don't clear countdownStartTime or localStorage - it persists forever
    // The countdown will resume automatically when they return to the cake screen

    // Clear confetti
    clearConfetti();

    // Stop microphone stream
    if (microphone && microphone.mediaStream) {
      microphone.mediaStream.getTracks().forEach(track => track.stop());
    }

    // Close audio context
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }

    // Reset variables
    audioContext = null;
    analyser = null;
    microphone = null;

    // Remove microphone indicator
    const micIndicator = document.getElementById('mic-indicator');
    if (micIndicator) {
      micIndicator.remove();
    }

    // Reset all candles to unlit state
    candles.forEach(candle => {
      candle.classList.remove('out');
    });
    updateCandleCount();

    console.log("Cake screen cleaned up");
  }
})();


