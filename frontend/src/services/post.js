import http from "./http";

class Post {
    send (post, token) {
        return http.post('/post', post, {
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    }

    edit (post, id, token) {
        return http.patch(`/post/${id}`, post, {
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    }
}

export default new Post()