<script lang="ts" setup>
import { ref, onMounted } from "vue";

const testResults = ref({
  testType: "",
  cpm: 0,
  accuracy: "0%",
  symbols: 0,
  errors: 0,
});

onMounted(() => {
  const savedResults = localStorage.getItem("testResults");
  if (savedResults) {
    testResults.value = JSON.parse(savedResults);
  }
});
</script>


<template>
    <section class="result-container">
        <div class="content-wrapper">
            <div class="stats-container">
                <div class="stat-item">
                    <span class="stat-label">тип теста</span>
                    <span class="stat-value">{{ testResults.testType }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">сpm</span>
                    <span class="stat-value">{{ testResults.cpm }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">точность</span>
                    <span class="stat-value">{{ testResults.accuracy }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">символы</span>
                    <span class="stat-value">{{ testResults.symbols }}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">ошибки</span>
                    <span class="stat-value">{{ testResults.errors }}</span>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn btn-secondary" @click="$router.push('/typing-test')">
                    <span class="btn-text">Заново</span>
                    <img src="/restart.svg" alt="" class="btn-icon" />
                </button>
                <button class="btn btn-primary" @click="$router.push('/')">
                    <span class="btn-text">Следующий тест</span>
                    <img src="/arrow.svg" alt="" class="btn-icon" />
                </button>
            </div>
        </div>
    </section>
</template>


<style scoped>
.result-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    align-items: center;
    font-family: var(--font-family);
    font-weight: var(--font-weight);
    padding: 20px 80px 280px;
}

@media (max-width: 991px) {
    .result-container {
        padding: 0 20px 100px;
    }
}

.content-wrapper {
    display: flex;
    width: 763px;
    max-width: 100%;
    flex-direction: column;
    align-items: center;
}

.header {
    display: flex;
    width: 221px;
    max-width: 100%;
    gap: 14px;
    font-size: var(--font-size);
    color: var(--text-color);
    white-space: nowrap;
}

@media (max-width: 991px) {
    .header {
        white-space: initial;
    }
}

.logo {
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center;
    width: 50px;
}

.app-title {
    flex-grow: 1;
    width: 147px;
    margin: auto 0;
}

.stats-container {
    align-self: stretch;
    display: flex;
    margin-top: 266px;
    align-items: center;
    gap: 40px 77px;
    text-align: center;
    justify-content: start;
    flex-wrap: wrap;
}

@media (max-width: 991px) {
    .stats-container {
        max-width: 100%;
        margin-top: 40px;
    }
}

.stat-item {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    margin: auto 0;
}

.stat-label,
.stat-value {
    color: #fff;
    /* color: var(--secondary-color); */
    font-size: var(--font-size-sm);
}

.stat-value {
    color: var(--primary-color);
    font-size: var(--font-size-lg);
    line-height: var(--font-size-lg);
    margin-top: 15px;
}

.action-buttons {
    display: flex;
    margin-top: 204px;
    align-items: center;
    gap: 26px;
    font-size: var(--font-size);
    line-height: var(--font-size);
    justify-content: start;
}

@media (max-width: 991px) {
    .action-buttons {
        max-width: 100%;
        margin-top: 40px;
    }
}

.btn {
    border-radius: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
    white-space: nowrap;
    justify-content: center;
    margin: auto 0;
    padding: 16px 30px;
}

.btn-secondary,
.btn-primary {
    background-color: var(--secondary-color);
    color: var(--text-color);
}

.btn-primary {
    background-color: var(--primary-color);
    color: var(--background-color);
    min-width: 240px;
}

.btn-text,
.btn-icon {
    align-self: stretch;
    margin: auto 0;
}

.btn-icon {
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center;
    width: 24px;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>