const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const ampqlib = require('amqplib');
const pgp = require('pg-promise')();
const app = express();
const db = pgp('postgres://localhost/leaflow')
const rabbitmq = ampqlib.connect('ampq://rabbitmq')
const rabbitmqChannel = rabbitmq.then((conn) => conn.createChannel());
const scripts = new ScriptsController(db, jwt, rabbitmqChannel)

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(scripts.authenticate)
app.post('/triggers/:scriptId/:token', scripts.trigger)

module.exports = app;

if (require.main === module) {
  app.listen(3000);
}
