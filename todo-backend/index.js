const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const todos = [
    { content: 'Learn JavaScript' },
    { content: 'Learn React' },
    { content: 'Build a project' }
]

app.get('/todos', (req, res) => {
    res.json(todos)
})

app.post('/todos', (req, res) => {
    const { content } = req.body
    if (!content) {
        return res.status(400).send('Missing content')
    }

    todos.push({ content })
    res.status(201).json({ status: 'ok' })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`todo-backend running on port ${PORT}`)
})
