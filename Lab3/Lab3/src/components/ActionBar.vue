<script setup lang="ts">
import { ref, computed, watch} from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

const router = useRouter();

interface Option {
    label: string;
    value: string;
}

// Опции для времени и слов
const options = {
    time: [
        { label: '15', value: '15' },
        { label: '30', value: '30' },
        { label: '60', value: '60' },
        { label: '120', value: '120' }
    ],
    word: [
        { label: '5', value: '5' },
        { label: '25', value: '25' },
        { label: '50', value: '50' },
        { label: '100', value: '100' }
    ]
};

const isTimeMode = ref(JSON.parse(localStorage.getItem('isTimeMode') ?? 'true')); // Текущий режим
const selectedOption = ref<Option | null>(JSON.parse(localStorage.getItem('selectedOption') ?? 'null')); // Выбранная опция

// Текущие опции зависят от режима
const currentOptions = computed(() => (isTimeMode.value ? options.time : options.word));

// Сохраняем в localStorage
function saveToLocalStorage() {
    localStorage.setItem('isTimeMode', JSON.stringify(isTimeMode.value));
    localStorage.setItem('selectedOption', JSON.stringify(selectedOption.value));
}

// Переключаем режим
function switchMode() {
    isTimeMode.value = !isTimeMode.value;
    selectedOption.value = currentOptions.value[0]; // Сбрасываем выбор на первую опцию
    saveToLocalStorage();
}


// Watch for changes in `isTimeMode` and `selectedOption` and save to localStorage
watch([isTimeMode, selectedOption], saveToLocalStorage);

onBeforeRouteLeave(() => {
    saveToLocalStorage();
});
</script>


<template>
    <div class="options-container">
        <div class="option-group">
            <!-- Переключатели режима -->
            <div 
                id="time-option" 
                class="option-item" 
                :class="{ 'option-active': isTimeMode }" 
                @click="switchMode">
                <img src="/clock.svg" alt="" class="option-icon">
                <span class="option-text">Время</span>
            </div>
            <div 
                id="word-option" 
                class="option-item" 
                :class="{ 'option-active': !isTimeMode }" 
                @click="switchMode">
                <img src="/a-letter.svg" alt="" class="option-icon">
                <span class="option-text">Слова</span>
            </div>
        </div>
        <div class="separator" aria-hidden="true"></div>
        <!-- Список опций -->
        <div id="word-option-container" class="word-options">
            <button 
                v-for="option in currentOptions" 
                :key="option.value" 
                class="word-option option-item" 
                :class="{ 'word-option-active': selectedOption?.value === option.value }" 
                @click="selectedOption = option">
                {{ option.label }}
            </button>
        </div>
    </div>
    </template>

<style scoped>
.options-container,
.test-options,
.word-options,
.option-group,
.option-item,
.start-test-button {
    display: flex;
    align-items: center;
}

.test-options {
    width: 100%;
    flex-direction: column;
    font-size: 20px;
}

.options-container {
    display: inline-flex;
    border-radius: 18px;
    background-color: var(--secondary-color);
    gap: 30px;
    justify-content: center;
    flex-wrap: wrap;
    padding: 14px 30px;
    box-sizing: border-box;
}

.option-group {
    align-self: stretch;
    gap: 20px;
}

.option-item,
.word-options {
    align-self: stretch;
    color: #727b8a;
    cursor: pointer;
}

.option-item {
    gap: 8px;
}

.option-active,
.word-option-active {
    color: var(--primary-color);
}

.separator {
    border-radius: 16px;
    background-color: var(--background-color);
    width: 5px;
    height: 30px;
    margin: auto 0;
}

.word-options {
    gap: 20px;
}

.word-option {
    margin: auto 0;
    background-color: var(--secondary-color);
    border: 0;
}
</style>

