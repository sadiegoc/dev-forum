import http from "./http";

class Comment {
    send (comment, token) {
        return http.post('/comment', comment, {
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    }

    remove (id, token) {
        return http.delete(`/comment/${id}`, {
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
    }
}

export default new Comment()