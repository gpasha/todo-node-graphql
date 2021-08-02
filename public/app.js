new Vue({
  vuetify : new Vuetify(),
  el: '#app',
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: '',
      todos: []
    }
  },
  created() {
    const query = `
      query {
        getTodos {
          id title done createdAt updatedAt
        }
      }
    `
    fetch('/qraphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(response => this.todos = response.data.getTodos)
      .catch(e => console.log(e))
  },
  methods: {
    addTodo() {
      const title = this.todoTitle.trim()
      if (!title) {
        return
      }
      const query = `
        mutation {
          createTodo(todo: {title: "${title}"}) {
            id title done createdAt updatedAt
          }
        }
      `
      fetch('/qraphql', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query })
      })
        .then(res => res.json())
        .then(response => {
          const todo = response.data.createTodo
          this.todos.push(todo)
          this.todoTitle = ''
        })
        .catch(e => console.log('error: ', e))
    },
    completeTodo(id) {
      const query = `
        mutation {
          completeTodo(id: "${id}") {
            updatedAt
          }
        }
      `
      console.log(id);
      fetch('/qraphql', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query })
      })
        .then(res => res.json())
        .then(response => {
          const indexTodo = this.todos.findIndex(t => t.id === id)
          this.todos[indexTodo].updatedAt = response.data.completeTodo.updatedAt
        })
        .catch(e => console.log(e)) 
    },
    removeTodo(id) {
      const query = `
        mutation {
          deleteTodo(id: "${id}")
        }
      `
      fetch('/qraphql', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query })
      })
        .then(res => {
          this.todos = this.todos.filter(todo => todo.id !== id)
        })
        .catch(e => console.log(e))
    }
  },
  filters: {
    capitalize(value) {
      return value.toString().charAt(0).toUpperCase() + value.slice(1)
    },
    date(value, withTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      }
      if (withTime) {
        options.hour = '2-digit',
        options.minute = '2-digit',
        options.second = '2-digit'
      }
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
    }
  }
})