const express = require('express')
const dotenv = require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const MONGODB_USER = process.env.MONGODB_USER
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
const MONGODB_PORT = process.env.MONGODB_PORT || '27017'
const connectionString = `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_PORT}`
const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

MongoClient.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(client => {
  console.log('Connected to database.')
  const db = client.db('addressbook')
  const contactsCollection = db.collection('contacts')

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })

  app.get('/contacts', (req, res) => {
    db.collection('contacts').find().toArray()
    .then(results => {
      res.send(results)
    })
    .catch(error => console.error(error))
  })
  
  app.post('/contacts', (req, res) => {
    contactsCollection.insertOne(req.body).then(result => {
      res.send(result.ops[0])
    }).catch(error => console.error(error))
  })
  app.get('/contact/:contactId', (req, res) => {
    res.send(req.params)
  })
  app.delete('/contacts/:contactId', (req, res) => {
    contactsCollection.deleteOne({'_id': ObjectId(req.params.contactId)}).then(result => {
      res.json({status: 'success'})
    })
  })
  app.put('/contacts/:contactId', (req, res) => {
    contactsCollection.findOneAndUpdate(
      {'_id': ObjectId(req.params.contactId)},
      {'$set': req.body},
      {'upsert': true}
    ).then(result => {
      res.json({status: 'success'})
    })
  })
}).catch(error => {
  console.error(error)
})

app.listen(3000, () => {
  console.log('listening on 3000')
})