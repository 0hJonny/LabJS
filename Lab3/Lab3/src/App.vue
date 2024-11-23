<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header class="logo-container" @click="$router.push('/')">
    <img src="/logo.svg" alt="TypingTest Logo" class="logo-icon" />
    <h1 class="logo-text">TypingTest</h1>
  </header>
  <main class="container">
    <div  class="container content-wrapper">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.logo-container {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

/* header.css */
.logo-container {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
  gap: 14px;
}

.logo-container .logo-icon {
  width: 50px;
}

.logo-icon,
.option-icon,
.start-test-icon {
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 24px;
  margin: auto 0;
}

.logo-text {
  flex-grow: 1;
  margin: auto 0;
}
</style>
