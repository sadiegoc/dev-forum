import http from "./http";

class Post {
    send (post, token) {
        return http.post('/posts/my-posts', post, {
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

    getAll (page) {
        return http.get(`/posts?page=${page}`)
    }

    getByPostId (id) {
        return http.get(`/posts/${id}`)
    }

    getByUserId (id, page) {
        return http.get(`/posts/my-posts?page=${page}&id=${id}`)
    }
}

export default new Post()