import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        alias: '/home',
        name: 'home',
        component: () => import('@/components/views/Home.vue')
    }, {
        path: '/auth',
        name: 'auth',
        component: () => import('@/components/auth/Auth.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router