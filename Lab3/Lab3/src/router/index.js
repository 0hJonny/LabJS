import { createRouter, createWebHistory } from 'vue-router';

import MainPage from '../views/MainPage.vue';

const routes = [
    {
        path: '/',
        name: 'main',
        component: MainPage
    },
    {
        path: '/typing-test',
        name: 'typing-test',
        component: () => import('../views/TypingTestPage.vue')
    },
    {
        path: '/results',
        name: 'results',
        component: () => import('../views/ResultsPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router

