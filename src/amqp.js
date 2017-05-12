const amqplib = require('amqplib');
const rabbitmq = amqplib.connect('amqp://leaflow:leaflow@rabbit')
const amqp = rabbitmq
      .then((conn) => conn.createConfirmChannel())
      .catch((err) => console.log(err, 'channel con'));

module.exports = amqp;
