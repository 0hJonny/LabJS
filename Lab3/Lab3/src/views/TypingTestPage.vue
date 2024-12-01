<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import ActionBar from "../components/ActionBar.vue";

const router = useRouter();

const userInput = ref(""); // Текст, введённый пользователем
const currentCharIndex = ref(0); // Индекс текущего символа
const correctCount = ref(0); // Количество правильных символов
const errorCount = ref(0); // Количество ошибок
const startTime = ref(0);
const elapsedTime = ref(0);
const timerInterval = ref<any>(null);
const isTestStarted = ref(false); // Тест не начат

var isTimeMode = ref(JSON.parse(localStorage.getItem("isTimeMode") || "false"));
var selectedOption = JSON.parse(localStorage.getItem("selectedOption") || '{"label":"15","value":"15"}');
const maxTime = ref(Number(selectedOption.value)); // Максимальное время в секундах
const maxWords = ref(Number(selectedOption.value)); // Максимальное количество слов

const originalText = ref(""); // Исходный текст
const textArray = ref<string[]>([]); // Линейный массив символов (включая пробелы)

async function fetchTextFromAPI(type = "sentence", number = 3) {
  try {
    const response = await fetch(`https://fish-text.ru/get?type=${type}&number=${number}&format=json`);
    if (!response.ok) throw new Error("Ошибка при получении текста");
    const data = await response.json();
    if (data && data.text) {
      originalText.value = data.text;
      if (!isTimeMode.value)
        textArray.value = data.text.split(" ").slice(0, selectedOption.value).join(" ");
      else
        textArray.value = originalText.value.split("");
    }
  } catch (error) {
    console.error("Ошибка загрузки текста:", error);
    originalText.value = "Ошибка загрузки текста. Попробуйте еще раз.";
    textArray.value = originalText.value.split("");
  }
}

fetchTextFromAPI();

// Точность
const accuracy = computed(() => {
  if (correctCount.value + errorCount.value === 0) return 100;
  return (
    (correctCount.value / (correctCount.value + errorCount.value)) * 100
  ).toFixed(2);
});

// Запуск таймера
function startTimer() {
  startTime.value = Date.now();
  timerInterval.value = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);

    if (isTimeMode.value && elapsedTime.value >= maxTime.value) {
      finishTest();
    }
  }, 1000);
}

// Остановка таймера
function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

// Обработка ввода
function handleInput(event: KeyboardEvent) {
  const expectedChar = textArray.value[currentCharIndex.value];
  const userChar = event.key;

  if (isTimeMode.value && elapsedTime.value >= maxTime.value) {
    finishTest();
    return;
  }

  if (!isTimeMode.value && userInput.value.split(" ").length >= maxWords.value) {
    finishTest();
    return;
  }

  if (!isTestStarted.value && userChar.length === 1 && userChar !== "Backspace") {
    isTestStarted.value = true;
    startTimer();
  }

  if (userChar === "Backspace") {
    if (userInput.value.length > 0) {
      userInput.value = userInput.value.slice(0, -1);
      currentCharIndex.value--;
    }
  } else if (userChar.length === 1) {
    userInput.value += userChar;

    if (userChar === expectedChar) {
      correctCount.value++;
    } else {
      errorCount.value++;
    }

    currentCharIndex.value++;

    if (currentCharIndex.value >= textArray.value.length) {
      finishTest();
    }
  }
}

function finishTest() {
  stopTimer();
  isTestStarted.value = false;

  const cpm = Math.round((correctCount.value / elapsedTime.value) * 60);

  const results = {
    testType: isTimeMode.value
      ? `время ${selectedOption.value}`
      : `количество слов ${selectedOption.value}`,
    cpm,
    accuracy: accuracy.value,
    symbols: currentCharIndex.value,
    errors: errorCount.value,
  };

  localStorage.setItem("testResults", JSON.stringify(results));
  router.push("/results");
}

function restartTest() {
  userInput.value = "";
  currentCharIndex.value = 0;
  correctCount.value = 0;
  errorCount.value = 0;
  elapsedTime.value = 0;
  isTestStarted.value = false;
  stopTimer();

  if (isTimeMode.value) {
    maxTime.value = Number(selectedOption.value);
  } else {
    maxWords.value = Number(selectedOption.value);
  }

  fetchTextFromAPI(); // Загружаем новый текст
}
</script>


<template>
  <section class="typing-test-container" tabindex="0" @keydown="handleInput">
    <div class="content-wrapper">
      <div v-if="!elapsedTime">
        <ActionBar />
      </div>
      <div>
        <div v-if="elapsedTime" class="timer-wrapper">
          <div class="timer-container">
            <!-- <p>Время: {{ elapsedTime }} секунд</p> -->
            <!-- <p>Точность: {{ accuracy }}%</p> -->
             <p>{{  isTimeMode ? `${ maxTime -elapsedTime}` : `${userInput.split(" ").length -1}`}}</p>
          </div>
        </div>
        <p class="typing-text">
          <span v-for="(char, index) in textArray" :key="index" class="letter-wrapper">
            <!-- Каретка перед текущим символом -->
            <span v-if="index === currentCharIndex" class="caret"></span>
            <span class="letter" :class="[
              index < userInput.length && userInput[index] === char ? 'correct' : '',
              index < currentCharIndex ? 'typed' : '',
              index === currentCharIndex ? 'current' : '',
              index < userInput.length && userInput[index] !== char ? 'incorrect' : '',
              char === ' ' ? 'space' : '',
            ].join(' ')">
              {{ char === " " ? " " : char }} <!-- Отображаем символ пробела как  -->
            </span>
          </span>
          <!-- Каретка в конце строки -->
          <span v-if="currentCharIndex >= textArray.length" class="caret"></span>
        </p>

      </div>

      <button class="restart-button" @click="restartTest">
        <div>Заново</div>
        <img src="/restart.svg" alt="" class="start-test-icon">
      </button>
    </div>
  </section>
</template>

<style scoped>
.typing-test-container {
  outline: none;
  height: 100%;
}

.timer-container p {
  margin: 0;
  color: var(--primary-color);
}

.content-wrapper {
  margin-top: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 50px;
}

.timer-text {
  color: var(--primary-color);
}

.typing-text {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  max-width: 600px;
  position: relative;
}

.letter {
  position: relative;
  color: #727B8A;
}

.space {
  width: 0.5em;
  /* Ширина пробела */
  display: inline-block;
}

.incorrect {
  color: #ca4754;
  /* Неправильные буквы */
}

.correct {
  color: #d1d0c5;
  /* Правильные буквы */
}

.highlight {
  text-decoration: underline;
  text-decoration-color: var(--primary-color);
  text-decoration-thickness: 2px;
}


.highlight {
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 2px;
  animation: blink 1s infinite;
}

.restart-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background-color: var(--secondary-color);
  overflow: hidden;
  color: var(--text-color);
  line-height: 30px;
  padding: 16px 30px;
  gap: 10px;
  cursor: pointer;
  width: fit-content;
}

.restart-button:hover {
  background-color: var(--secondary-color-hover);
}

.restart-button img {
  width: 24px;
}

.caret {
  width: 1px;
  height: 1.2em;
  background-color: var(--primary-color);
  display: inline-block;
  vertical-align: bottom;
  animation: blink-caret 0.8s infinite;
}

@keyframes blink-caret {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}
</style>
