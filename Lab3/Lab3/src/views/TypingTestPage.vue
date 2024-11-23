<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import ActionBar from "../components/ActionBar.vue";

const router = useRouter();

// Исходный текст
const texts = [
  "Задача организации, в особенности же рамки и место обучения кадров в значительной степени обуславливает создание направлений прогрессивного развития.",
  "В целом, консультация с широким активом в значительной степени обуславливает важнейшие направления развития.",
  "Значимость этих проблем настолько очевидна, что постоянное информационно-пропагандистское обеспечение нашей деятельности напрямую зависит от как формирования позиции, так и соответствующих условий активизации.",
  "В стремлении повысить качество жизни, они забывают, что развитые страны третьего мира своими posiциями и развитым социальным обеспечением являются для них не только примером, но и конкурентом.",
  "Таким образом, сплоченность команды профессионалов, занимающихся исключительно своей работой, - это только small часть проблемы.",
  "Возьмем, к примеру, обширную сеть поставщиков, производителей, дистрибьюторов и других заинтересованных сторон. Их взаимодействие между собой и с покупателями влияет на качество обслуживания, а также на уровень и качество товаров и услуг.",
  "В целом, консультация с широким активом в значительной степени обуславливает важнейшие направления развития.",
  "В стремлении повысить качество жизни, они забывают, что развитые страны третьего мира своими posiциями и развитым социальным обеспечением являются для них не только примером, но и конкурентом.",
  "Таким образом, сплоченность команды профессионалов, занимающихся исключительно своей работой, - это только small часть проблемы.",
  "Возьмем, к примеру, обширную сеть поставщиков, производителей, дистрибьюторов и других заинтересованных сторон. Их взаимодействие между собой и с покупателями влияет на качество обслуживания, а также на уровень и качество товаров и услуг.",
];

const originalText = texts[Math.floor(Math.random() * texts.length)];

// Линейный массив символов (включая пробелы)
const textArray = originalText.split("");

// Состояние ввода
const userInput = ref(""); // Текст, введённый пользователем
const currentCharIndex = ref(0); // Индекс текущего символа
const correctCount = ref(0); // Количество правильных символов
const errorCount = ref(0); // Количество ошибок

// Таймер
const startTime = ref(0);
const elapsedTime = ref(0);
const timerInterval = ref<any>(null);
const isTestStarted = ref(false); // Тест не начат


var isTimeMode = ref(JSON.parse(localStorage.getItem("isTimeMode") || "false"));
var selectedOption = JSON.parse(localStorage.getItem("selectedOption") || '{"label":"15","value":"15"}');

// В режиме времени: ограничение по секундам
const maxTime = ref(Number(selectedOption.value)); // Максимальное время в секундах
// В режиме количества слов: ограничение по словам
const maxWords = ref(Number(selectedOption.value)); // Максимальное количество слов


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

    // Останавливаем таймер при превышении времени
    if (isTimeMode.value && elapsedTime.value >= maxTime.value) {
      finishTest();
    }
  }, 1000);
}

// Остановка таймера
function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null; // Сбрасываем интервал
  }
}

// Обработка ввода
function handleInput(event: KeyboardEvent) {
  const expectedChar = textArray[currentCharIndex.value];
  const userChar = event.key;

  // Проверяем, нужно ли завершить тест
  if (isTimeMode.value && elapsedTime.value >= maxTime.value) {
    finishTest();
    return;
  }

  if (!isTimeMode.value && userInput.value.split(" ").length >= maxWords.value) {
    finishTest();
    return;
  }

  // Логика ввода символов
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

    if (currentCharIndex.value >= textArray.length) {
      finishTest();
    }
  }
}

function finishTest() {
  stopTimer();
  isTestStarted.value = false;

  // Рассчитываем скорость ввода (CPM)
  const cpm = Math.round((correctCount.value / elapsedTime.value) * 60);

  // Формируем объект с результатами
  const results = {
    testType: isTimeMode.value
      ? `время ${selectedOption.value}`
      : `количество слов ${selectedOption.value}`,
    cpm,
    accuracy: accuracy.value,
    symbols: currentCharIndex.value,
    errors: errorCount.value,
  };

  // Сохраняем результаты в LocalStorage (или другой store)
  localStorage.setItem("testResults", JSON.stringify(results));

  // Перенаправляем на страницу results
  router.push("/results");
}


// Сброс
function restartTest() {
  userInput.value = "";
  currentCharIndex.value = 0;
  correctCount.value = 0;
  errorCount.value = 0;
  elapsedTime.value = 0;
  isTestStarted.value = false;
  stopTimer();

  if (isTimeMode.value) {
    maxTime.value = Number(selectedOption.value); // Сбрасываем время
  } else {
    maxWords.value = Number(selectedOption.value); // Сбрасываем количество слов
  }
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
