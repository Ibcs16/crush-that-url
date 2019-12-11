import express from 'express';
import routes from './routes';
import connectToDb from './config/db';

class AppController {
  constructor() {
    // Initialize express application
    this.express = express();

    connectToDb();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // give express the hability to deal with json
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes);
  }
}

export default new AppController().express;
