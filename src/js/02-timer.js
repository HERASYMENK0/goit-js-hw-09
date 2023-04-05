import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');
const dataPicer = document.querySelector('input#datetime-picker');
const startBtn = document.querySelector('[data-start]');

let intervalId; 

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate && selectedDate.getTime() < Date.now()) {
      window.alert('Please choose a date in the future');
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
      updateTimer(); 
    }
  },
};

flatpickr(dataPicer, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer() {
  const currentDate = new Date();
  const selectedDate = flatpickr.parseDate(dataPicer.value, 'Y-m-d H:i:S');
  const msDiff = selectedDate.getTime() - currentDate.getTime();

  if (msDiff <= 0) {
    clearInterval(intervalId);
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(msDiff);

  daysEl.textContent = padZero(days, 2);
  hoursEl.textContent = padZero(hours, 2);
  minutesEl.textContent = padZero(minutes, 2);
  secondsEl.textContent = padZero(seconds, 2);
}

function padZero(value, length) {
  return value.toString().padStart(length, '0');
}

startBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = setInterval(updateTimer, 1000);
});
