<template>
    <div class="app">
        <Header></Header>
        <Content></Content>
        <Footer></Footer>
    </div>
</template>

<script>
import Content from './components/templates/Content.vue';
import Footer from './components/templates/Footer.vue';
import Header from './components/templates/Header.vue';

export default {
    name: 'App',
    components: { Header, Content, Footer }
}
</script>

<style>
:root {
    --header-height: 60px;
    --color-theme: brown;
}

@font-face {
    font-family: droidsansmono;
    src: url(assets/fonts/droidsansmono.woff2);
}

* {
    font-family: droidsansmono;
    font-size: 1rem;
    font-weight: 100;
}

body {
  margin: 0;
}

.app, #app {
    margin: 0; padding: 0;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>