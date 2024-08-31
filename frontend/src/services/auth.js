import http from "./http";

class Auth {
    login (user) {
        return http.post('/signin', user)
    }

    register (user) {
        return http.post('/signup', user)
    }
}

export default new Auth()