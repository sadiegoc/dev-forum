import axios from "axios";
import { createStore } from "vuex";

export default createStore({
    state: {
        user: null
    },
    mutations: {
        setUser (state, user) {
            state.user = user
            axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
        }
    }
})