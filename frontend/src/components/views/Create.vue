<template>
    <section class="create">
        <div class="container">
            <h1>Create a Post</h1>
            <span class="msg" :class="{ err }">{{ this.msg }}</span>
            <div class="form">
                <input id="post-id" type="hidden" v-model="id">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" v-model="post.title">
                </div>
                <div class="form-group">
                    <label for="content">Post</label>
                    <VueEditor id="content" v-model="post.content"></VueEditor>
                </div>
                <div class="form-group">
                    <button @click.prevent="send">Send</button>
                    <button @click.prevent="cancel">Cancel</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import post from '@/services/post';
import { VueEditor } from 'vue3-editor'
import { mapState } from 'vuex';

export default {
    name: 'CreateView',
    components: { VueEditor },
    computed: mapState(['user']),
    data: function () {
        return {
            msg: "",
            err: true,
            post: {},
            id: null
        }
    },
    methods: {
        send () {
            this.post.userId = this.user.id
            if (this.id) {
                post.edit(this.post, this.id, this.user.token)
                    .then(() => {
                        this.msg = "Post updated with successfully"
                        this.err = false
                    })
                    .catch(err => {
                        this.msg = err.response.data
                        this.err = true
                    })
            } else {
                post.send(this.post, this.user.token)
                    .then(() => {
                        this.msg = "Post published with successfully"
                        this.err = false
                    })
                    .catch(err => {
                        this.msg = err.response.data
                        this.err = true
                    })
            }
        },
        cancel () {
            this.post = {}
            this.msg = ""
            this.err = false
            this.id = null
        },
        loadPost (id) {
            post.getByPostId(id).then(res => {
                const uint8Array = new Uint8Array(res.data.content.data);
                const decoder = new TextDecoder('utf-8');
                const contentUTF8 = decoder.decode(uint8Array);

                this.post = { ...res.data, content: contentUTF8 }
                this.id = res.data.id
            })
            .catch(err => {
                console.log(err)
                this.$router.push({ name: 'my-posts' })
            })
        }
    },
    mounted () {
        if (this.$route.params.postId) this.loadPost(this.$route.params.postId)
    }
}
</script>

<style scoped>
.create {
    width: 100%; height: 100%;
    margin: var(--header-height) 0 0 0; padding: 0;

    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    width: 1100px; height: 500px;
    
    display: flex; flex-direction: column;
    align-items: center;
    justify-content: center;
}

h1 {
    font-size: 1.2rem;
    color: var(--color-theme);
    font-weight: 600;
}

.form-group {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    margin: 10px 0; padding: 0;
    position: relative;
}

.form-group:not(:last-child) {
    flex-direction: column;
}

.form-group input {
    width: 500px;
    border: 1px solid #ccc; outline: none;
    font-size: 0.9rem;
    padding: 6px 10px;
}

.form-group button {
    cursor: pointer; border: none;
    background-color: var(--color-theme);
    padding: 6px 12px; color: white;
    margin-right: 10px;
}

.msg {
    font-size: 0.9rem;
    color: darkgreen;
    font-weight: 600;
}

.msg.err {
    color: var(--color-theme);
}

@media (max-width: 1150px) {
    .container {
        width: 800px;
    }
}

@media (max-width: 850px) {
    .container {
        width: 600px;
    }
}

@media (max-width: 650px) {
    .container {
        width: 400px;
    }

    .form-group input {
        width: 400px;
    }
}

@media (max-width: 450px) {
    .container {
        width: 260px;
    }

    .form-group input {
        width: 260px;
    }
}

</style>