import express from 'express';
import routes from './routes';

class AppController {
  constructor() {
      this.express = express();
  }

  middlewares() {
    //give express the hability to deal with json
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes)
  }
}

export default new AppController().express;
