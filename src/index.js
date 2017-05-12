/**
 * Application class
 */
class Application {
  static async main() {
    const express = require('express');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    const cors = require('cors');
    const jwt = require('jsonwebtoken');
    const ScriptsController = require('./scripts');
    const amqp = require('./amqp');
    const db = require('./db');
    const app = express();
    const scripts = new ScriptsController(db, amqp, jwt);

    app.use(cors())
      .use(morgan('dev'))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: true}))
      .post('/triggers/:scriptId/:token', scripts.authenticate, scripts.trigger)
      .listen(3000);
  }
}

if (require.main === module) {
  Application.main().catch(console.error);
} else {
  module.exports = Application;
}
