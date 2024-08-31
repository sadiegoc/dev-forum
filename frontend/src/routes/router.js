import { userKey } from "@/config/global";
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
    }, {
        path: '/create-post',
        name: 'create-post',
        component: () => import('@/components/views/Create.vue'),
        meta: { requiresAuth: true }
    }, {
        path: '/my-posts',
        name: 'my-posts',
        component: () => import('@/components/views/MyPosts.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)

    if (to.matched.some(record => record.meta.requiresAuth)) {
        const user = JSON.parse(json)
        user ? next() : next({ name: 'home' })
    } else {
        next()
    }
})

export default router