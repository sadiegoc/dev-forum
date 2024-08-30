module.exports = app => {
    // função que garante que a variável tem conteúdo
    function existsOrError (value, msg) {
        if (!value) throw msg // se é uma variável truthy
        if (Array.isArray(value) && value.length === 0) throw msg // se for um array e ele estiver vazio, retorne um erro
        if (typeof value === 'string' && !value.trim()) throw msg // garante que não seja uma string preenchida somente com espaços
    }
    
    // essa função garante que a variável NÃO contém conteúdo
    function notExistsOrError (value, msg) {
        try { existsOrError(value, msg) } // caso a variável não exista, retornará um erro
        catch (e) { return } // o erro será capturado aqui, significando que a variável não existe
        throw msg // caso não caia no catch, a função continua e retorna um erro para a sua chamada
    }
    
    function equalsOrError (valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    return { existsOrError, notExistsOrError, equalsOrError }
}