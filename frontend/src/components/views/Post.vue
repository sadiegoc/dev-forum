<template>
    <section class="post">
        <div class="container">
            <div class="header">
                <h1 class="title">
                    {{ currentPost.title }}
                    <div class="buttons">
                        <button @click.prevent="remove" class="delete">Delete</button>
                        <button @click.prevent="edit" class="edit">Edit</button>
                    </div>
                </h1>
                <h2 class="author"><span>published by</span> {{ currentPost.userFirstName }} {{ currentPost.userLastName }}</h2>
                <p class="date">{{ currentPost.createdAt }}</p>
            </div>
            <div class="content" v-html="currentPost.content"></div>
        </div>
    </section>
</template>

<script>
import post from '@/services/post';
import { mapState } from 'vuex';

export default {
    name: 'PostView',
    computed: mapState(['user']),
    data: function () {
        return {
            currentPost: {}
        }
    },
    methods: {
        async loadPost () {
            if (this.$route.params.postId) {
                const id = this.$route.params.postId
                await post.getByPostId(id).then(resp => {
                    const date = new Date(resp.data.createdAt)
                    const formattedDate = date.toLocaleDateString('pt-BR')

                    const uint8Array = new Uint8Array(resp.data.content.data);
                    const decoder = new TextDecoder('utf-8');
                    const contentUTF8 = decoder.decode(uint8Array);

                    this.currentPost = { ...resp.data, createdAt: formattedDate, content: contentUTF8 }
                }).catch(err => console.log(err))
            }
        },
        remove () {
            post.remove(this.currentPost.id)
                .then(() => this.$router.push({ name: 'my-posts' }))
                .catch(err => console.log(err))
        },
        edit () {
            
        }
    },
    mounted () {
        this.loadPost()
    }
}
</script>

<style scoped>

.post {
    width: 100%; height: auto;
    margin: 0; padding: 0;

    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
}

.container {
    border: 1px solid #ccc;
    width: 80%; height: auto;
    margin: 40px 0; padding: 0 20px;

    display: flex; flex-direction: column;
    justify-content: flex-start; align-items: flex-start;
}

.header {
    border-bottom: 1px dashed #ccc;
    width: 100%;
}

.header h1 {
    font-size: 1.4rem;
    color: var(--color-theme);
    font-weight: 600;

    display: flex; justify-content: space-between;
}

.header h1 button {
    border: 1px solid var(--color-theme);
    color: var(--color-theme);
    padding: 6px 12px;
    background-color: transparent;
    cursor: pointer;
    margin-left: 10px;
}

.header h1 button:hover {
    background-color: var(--color-theme);
    color: white;
}

.header h2 {
    font-size: 1rem;
}

.header h2 {
    font-weight: 600;
}

.header p {
    font-size: 0.9rem;
    color: #555;
}

</style>