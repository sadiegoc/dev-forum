<template>
    <section class="home">
        <div class="container">
            <div class="posts">
                <div class="post" v-for="post in posts" :key="post.id">
                    <h1 class="title"><span>Title:</span> {{ post.title }}</h1>
                    <h2 class="subtitle"><span>Author:</span> {{ post.userFirstName }} {{ post.userLastName }}</h2>
                    <p class="date">{{ post.createdAt }}</p>
                </div>
            </div>
            <button v-if="loadMore" @click.prevent="loadPosts" class="load">Load More</button>
        </div>
    </section>
</template>

<script>
import post from '@/services/post';

export default {
    name: 'HomeView',
    data: function () {
        return {
            posts: [],
            page: 1,
            loadMore: true
        }
    },
    methods: {
        loadPosts () {
            post.getAll(this.page).then(res => {
                this.posts = this.posts.concat(
                    res.data.map(post => {
                        const date = new Date(post.createdAt)
                        const formattedDate = date.toLocaleDateString('pt-BR')

                        return { ...post, createdAt: formattedDate}
                    })
                )
                this.page++

                if (res.data.length === 0) this.loadMore = false
            }).catch(err => console.log(err))
        }
    },
    mounted () {
        this.loadPosts()
    }
}
</script>

<style scoped>
.home {
    width: 100%; height: auto;
    margin: 0; padding: 0;

    display: flex; justify-content: center;
}

.container {
    width: 80%; height: auto;
    padding: 0;
    display: flex; flex-direction: column;
    align-items: center;
}

.posts {
    width: 100%;
    display: flex; flex-direction: column;
    justify-content: flex-start; align-items: center;
}

.post {
    width: 100%; height: auto;
    padding: 10px 20px; margin: 10px 0;

    border: 1px solid #ccc;

    background-color: white;
    cursor: pointer;
}

.post:hover {
    border-color: var(--color-theme);
}

h1 span, h2 span {
    font-weight: 600;
    color: var(--color-theme);
}

.load {
    border: 1px solid var(--color-theme);
    background: transparent;
    color: var(--color-theme);
    padding: 6px 12px; margin: 0;
    cursor: pointer;
}

.load:hover {
    background-color: var(--color-theme);
    color: white;
}

.date {
    font-size: 0.9rem;
    text-decoration: underline;
    display: flex; justify-content: flex-end;
}
</style>