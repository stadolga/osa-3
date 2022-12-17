const express = require('express')
var morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('body', function (req, res, param) {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('build'))

let persons =  [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/info', (req, res) => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date().toString()}</p>
    `);
  });
  

const generateId = () => {
    return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER))
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const names = persons.map(person => person.name)

  if (!body.name && body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  if(names.includes(body.name)){
    return response.status(400).json({ 
        error: 'name should be unique' 
      })
    }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})