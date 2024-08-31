import axios from "axios";
import { createStore } from "vuex";
import { userKey } from "./global";

export default createStore({
    state: {
        user: JSON.parse(localStorage.getItem(userKey)) || null
    },
    mutations: {
        setUser (state, user) {
            state.user = user
            axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
        }
    }
})