<template>
    <section class="auth">
        <div class="container">
            <h1 v-if="login">Login</h1>
            <h1 v-else>Sign Up</h1>
            <form class="form" @submit.prevent="auth">
                <div v-if="msg" class="form-group msg">
                    {{ this.msg }}
                </div>
                <div class="form-group">
                    <input type="text" v-if="!login" v-model="user.firstName" placeholder="First Name">
                </div>
                <div class="form-group">
                    <input type="text" v-if="!login" v-model="user.lastName" placeholder="Last Name">
                </div>
                <div class="form-group">
                    <input type="email" v-model="user.email" placeholder="E-mail">
                </div>
                <div class="form-group">
                    <input type="password" v-model="user.password" placeholder="Password">
                </div>
                <div class="form-group">
                    <input type="password" v-if="!login" v-model="user.confirmPassword" placeholder="Confirm Password">
                </div>
                <div class="form-group">
                    <button v-if="login" type="submit">Login</button>
                    <button v-else type="submit">Sign Up</button>
                    <a href @click.prevent="login = !login">
                        <span v-if="login">
                            Don't have an account? Register
                        </span>
                        <span v-else>
                            Already have an account? Log in
                        </span>
                    </a>
                </div>
            </form>
        </div>
    </section>
</template>

<script>
import { userKey } from '@/config/global';
import auth from '@/services/auth';

export default {
    name: 'AuthPage',
    data: function () {
        return {
            login: false,
            msg: "",
            user: {
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: ""
            }
        }
    },
    methods: {
        auth () {
            if (this.login) { // se o usuário estiver logando
                const user = {
                    email: this.user.email,
                    password: this.user.password
                }

                auth.login(user)
                    .then(res => {
                        this.$store.commit('setUser', res.data)
                        localStorage.setItem(userKey, JSON.stringify(res.data))
                        this.$router.push({ name: 'home' })
                    })
                    .catch(err => this.msg = err.response.data)
            } else { // se estiver se registrando
                auth.register(this.user)
                    .then(() => this.login = true)
                    .catch(err => this.msg = err.response.data)
            }
        }
    }
}
</script>

<style scoped>
.auth {
    width: 100%; height: 100vh;
    padding: 0; margin: 0;

    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    width: 400px;
    display: flex; flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: var(--color-theme);
    padding: 0; margin: 0;
}

.form {
    width: 100%; height: auto;
    padding: 0; margin: 0;
}

.form-group {
    display: flex; flex-direction: column;
    justify-content: center;
    align-items: center;

    margin: 10px auto; padding: 0;
}

.form-group input {
    border: 1px solid var(--color-theme);
    outline: none;

    padding: 10px 14px; width: 350px;
    font-size: 0.9rem;
}

.form button {
    cursor: pointer;
    border: none;
    background-color: white;
    color: black;
    padding: 10px;
    margin: 5px auto;
}

.form a {
    text-decoration: none;
    color: white;
    margin: 5px 0;
}

.form a span {
    font-size: 0.9rem;
}

.form a:hover {
    text-decoration: underline;
}

.form-group.msg {
    margin: 0; color: white;
    font-size: 0.9rem;
}

.auth h1 {
    font-size: 1.4rem;
    color: white;
}

@media (max-width: 480px) {
    .container {
        width: 300px;
    }

    .form-group input {
        width: 250px;
    }

    .form a span {
        font-size: 0.8rem;
    }
}
</style>