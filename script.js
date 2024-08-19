const completeBtn = document.getElementById('complete-button');
const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const countdownBtn = document.getElementById('countdown-button');
const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');
const inputContainer = document.getElementById('input-container');
const timeElements = document.querySelectorAll('span');

let countdownActive;
let countdownDate = '';
let countdownTitle = '';
let countdownValue = new Date();

// Event listeners
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);
countdownForm.addEventListener('submit', updateCountdown);

/**
 * Checks localStorage for a previous countdown and restores it if available.
 * @returns {void}
 */
function restorePreviousCountdown() {
    // Get countdown from localStorage if available
    if (!localStorage.getItem('countdown')) {
        return;
    }

    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

/**
 * Resets the countdown values.
 * @returns {void}
 */
function reset() {
    // Hide countdown, show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    // Stop the countdown
    clearInterval(countdownActive);

    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

/**
 * Updates the countdown based on the form input.
 * @param {Event} event - The event object triggered by the user.
 * @returns {void}
 */
function updateCountdown(event) {
    event.preventDefault();
    countdownTitle = event.target.elements[0].value;
    countdownDate = event.target.elements[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };

    // Save the countdown to localStorage
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // Check for valid date
    if (countdownDate === '') {
        alert('Please select a date for the countdown.');
        return;
    }

    // Get the number version of the current date and update the DOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

/**
 * Updates the DOM with the countdown values.
 * @returns {void}
 */
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hide input container
        inputContainer.hidden = true;

        // If countdown has ended, show complete
        if (distance < 0) {
            countdownEl.hidden = true;
            completeEl.hidden = false;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            return;
        }

        // Show countdown in progress
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent = `${days}`;
        timeElements[1].textContent = `${hours}`;
        timeElements[2].textContent = `${minutes}`;
        timeElements[3].textContent = `${seconds}`;
        countdownEl.hidden = false;
    }, 1000);
}

// Pass today's date as min value for date picker
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// On load, check localStorage
restorePreviousCountdown();