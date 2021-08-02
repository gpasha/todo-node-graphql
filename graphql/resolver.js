const Todo = require('../models/todo')

const users = [
    {name: 'Masha', age: 20, email: 'masha@mail.ru'},
    {name: 'Pasha', age: 21, email: 'pasha@gmail.com'}
]

module.exports = {
    test() {
        return {
            count: Math.trunc(Math.random() * 10),
            users
        }
    },
    random({min, max, count}) {
        const arr = []
        for (let i = 0; i < count; i++) {
            const randonFloat = Math.random() * (max - min) + min
            arr.push(randonFloat)
        }
        return arr
    },
    addTestUser({user: {name, email}}) {
        const user = {name, email, age: Math.ceil(Math.random() * 30)}
        users.push(user)
        return user
    },
    async getTodos() {
        try {
            return await Todo.findAll()  
        } catch(e) {
            throw new Error('Fetch todos is not available')
        }
    }
}