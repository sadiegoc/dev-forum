<template>
    <section class="post">
        <div class="container">
            <div class="header">
                <h1 class="title">
                    {{ currentPost.title }}
                    <div class="buttons" v-if="user && user.id == currentPost.userId">
                        <button @click.prevent="removePost" class="delete">Delete</button>
                        <button @click.prevent="edit" class="edit">Edit</button>
                    </div>
                </h1>
                <h2 class="author"><span>published by</span> {{ currentPost.userFirstName }} {{ currentPost.userLastName }}</h2>
                <p class="date">{{ currentPost.createdAt }}</p>
            </div>
            <div class="content" v-html="currentPost.content"></div>
        </div>
        <div class="container">
            <h1 class="title">Comments</h1>
            <div class="newComment" v-if="user">
                <div class="box">
                    <textarea v-model="comment.content"></textarea>
                </div>
                <div class="btn">
                    <button @click.prevent="send" class="send">Send</button>
                </div>
            </div>
            <div class="comments" v-if="this.currentPost.comments">
                <div class="comment" v-for="comment in this.currentPost.comments" :key="comment.id">
                    <div class="name">
                        <div class="username">
                            <span>User: </span>
                            {{ comment.userFirstName }} {{ comment.userLastName }}
                        </div>
                        <div class="buttons" v-if="user && user.id == comment.userId">
                            <button @click.prevent="removeComment(comment.id)" class="delete">Delete</button>
                        </div>
                    </div>
                    <div class="content">
                        {{ comment.content }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import comment from '@/services/comment';
import post from '@/services/post';
import { mapState } from 'vuex';

export default {
    name: 'PostView',
    computed: mapState(['user']),
    data: function () {
        return {
            currentPost: {},
            comment: {}
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
        removePost () {
            post.remove(this.currentPost.id, this.user.token)
                .then(() => this.$router.push({ name: 'my-posts' }))
                .catch(err => console.log(err))
        },
        edit () {
            this.$router.push({ name: 'edit', params: { postId: this.currentPost.id } })
        },
        send () {
            this.comment.userId = this.user.id
            this.comment.postId = this.currentPost.id
            comment.send(this.comment, this.user.token)
                .then(() => {
                    this.loadPost()
                    this.comment.content = ""
                })
                .catch(err => console.log(err))
        },
        removeComment (id) {
            comment.remove(id, this.user.token).then(() => this.loadPost()).catch(err => console.log(err))
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

.container h1 {
    margin: 10px 0; padding: 0;
    font-size: 1rem;
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

.buttons button {
    border: 1px solid var(--color-theme);
    color: var(--color-theme);
    padding: 6px 12px;
    background-color: transparent;
    cursor: pointer;
    margin-left: 10px;
}

.buttons button:hover {
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

.box, .comments, .newComment {
    width: 100%; height: fit-content;
}

.newComment {
    margin: 0 0 20px 0;
}

.box textarea {
    width: 100%; height: 150px;
    padding: 10px; box-sizing: border-box;
    border: 1px solid #ccc;
    background-color: #f8f8f8; resize: none;
    font-size: 0.9rem;
    outline: none;
}

.newComment .btn {
    text-align: right;
}

.newComment button {
    color: white;
    background-color: var(--color-theme);
    border: none; cursor: pointer;
    padding: 7px 14px;
    margin-top: 10px;
}

.comments {
    width: 100%; height: auto;
    display: flex; flex-direction: column;
}

.comment {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    padding: 10px; box-sizing: border-box;
    margin-bottom: 20px;
}

.comment .name {
    font-weight: 600;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 8px;

    display: flex; justify-content: space-between;
    align-items: center;
}

.comment .content {
    padding-top: 5px;
}

</style>