const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const generateId = () => {
  const maxId = phonebook.length > 0 ? Math.max(...phonebook.map((p) => p.id)) : 0
  return maxId + 1
}

app.post('/api/persons/', (req, res) => {
  const body = req.body
  const isAlready = phonebook.find((person) => person.name === body.name)

  if (!body.name || !body.number) {
    return res.status(404).json({ error: 'some content missing' })
  }

  if (isAlready) {
    return res.status(404).json({ error: 'name must be unique' })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  phonebook = [...phonebook, newPerson]

  res.json(newPerson)
})

app.get('/', (req, res) => {
  res.send('<h1>Hola mundo, estamos probando express</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
            <div>
                <p>Phonebook has info for ${phonebook.length} people</p>
                <p>${date}</p>
            </div>
        `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const findPerson = phonebook.find((person) => person.id === id)

  if (findPerson) {
    res.json(findPerson)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const personToEliminate = phonebook.find((person) => person.id === id)

  if (personToEliminate) {
    phonebook = phonebook.filter((person) => person.id !== personToEliminate.id)
    res.json(phonebook)
  } else {
    res.status(404).json({ error: 'person missing' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
