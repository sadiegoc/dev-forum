<template>
    <header class="header">
        <div class="container">
            <div class="brand">
                <router-link to="/home">
                    Dev Helper
                </router-link>
            </div>
            <div class="form">
                <router-link to="/auth">
                    Login / Sign Up
                </router-link>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderComponent'
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
    padding: 10px;
}

.form a:hover {
    background-color: white;
    color: var(--color-theme);
}

@media (max-width: 420px) {
    .container {
        padding: 0 10px;
    }
}
</style>