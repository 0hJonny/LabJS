<script setup lang="ts">
import { useRouter } from 'vue-router'
import ActionBar from '../components/ActionBar.vue'

const router = useRouter()

const onClick = () => {
    router.push('/typing-test')
}

</script>

<template>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Typing Test</title>
        <link rel="stylesheet" href="styles/main.css">
    </head>
    <body>
        <section class="typing-test-container">
            <div class="test-options">
                <ActionBar />
                <button class="start-test-button" @click="onClick">
                    <span id="start-type-test" class="start-test-text">Начать тест</span>
                    <img src="/arrow.svg" alt="" class="start-test-icon">
                </button>
            </div>
        </section>
    </body>
    </html>
</template>

<style scoped>  
.typing-test-container {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 20px 60px;
}

.test-options {
    width: 100%;
    flex-direction: column;
    font-size: 20px;
    margin-top: 100px;
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

/* button.css */
.start-test-button {
    border-radius: 18px;
    background-color: var(--primary-color);
    margin-top: 50px;
    gap: 10px;
    overflow: hidden;
    color: var(--background-color);
    line-height: 30px;
    justify-content: center;
    padding: 16px 30px;
    cursor: pointer;
    width: fit-content;
    border: 0;
}

.start-test-button:hover {
    background-color: var(--primary-color-hover);
}

.start-test-text {
    flex-grow: 1;
    margin: auto 0;
}

</style>


