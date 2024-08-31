<template>
    <header class="header">
        <div class="container">
            <div class="brand">
                <router-link to="/home">
                    Dev Helper
                </router-link>
            </div>
            <div class="form">
                <router-link v-if="!user" to="/auth">
                    Login / Sign Up
                </router-link>
                <router-link v-if="user" to="/create-post">
                    Create
                </router-link>
                <router-link v-if="user" to="/my-posts">
                    My posts
                </router-link>
                <a href v-if="user" @click.prevent="logout">
                    Logout
                </a>
            </div>
        </div>
    </header>
</template>

<script>
import { userKey } from '@/config/global';
import { mapState } from 'vuex';

export default {
    name: 'HeaderComponent',
    computed: mapState(['user']),
    methods: {
        logout () {
            localStorage.removeItem(userKey)
            this.$store.state.user = null
            this.$router.push({ name: 'home' })
        }
    }
}
</script>

<style scoped>
header {
    inset: 0; padding: 0; margin: 0;
    height: var(--header-height); width: 100%;
    
    background-color: var(--color-theme);
}

.container {
    height: 100%;
    padding: 0 40px; margin: 0;

    display: flex; flex-direction: row;
    justify-content: space-between; align-items: center;
}

.brand {
    font-weight: 600;
}

.brand a {
    color: white;
    text-decoration: none;
}

.form a {
    text-decoration: none;
    color: white;
    font-size: 0.9rem;
    border: 1px solid white;
    padding: 6px;
}

.form a:hover {
    background-color: white;
    color: var(--color-theme);
}

@media (max-width: 480px) {
    .container {
        padding: 0 10px;
    }

    .brand a, .form a {
        font-size: 0.9rem;
    }
}
</style>