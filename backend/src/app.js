import express from 'express';
import cors from 'cors';
import io from 'socket.io';
import http from 'http';
import routes from './routes';
import connectToDb from './config/db';

class AppController {
  constructor() {
    // Initialize express application
    this.app = express();

    this.middlewares();

    this.socket();

    connectToDb();

    this.middlewares();
    this.routes();
  }

  socket() {

    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;

      next();
    });

    // Used to extract http from express protocol
    this.server = http.createServer(this.app);

    // Give server the ability to work with real-time
    // io.origins(['*']);
    this.io = io(this.server);
    this.io.origins('http://localhost:3001')

    // listen for io events
    this.io.on('connection', socket => {
      // when client connects to the server
      // socket holds client's unique hash
      console.log(`Client ${socket.id} connected`);
      // listen for when client disconnects
      socket.on('disconnect', () => {});
    });


  }

  middlewares() {

    // allowing access from unkown origins
    this.app.use(cors());
    // give express the hability to deal with json
    this.app.use(express.json());


  }

  routes() {
    this.app.use(routes);
  }
}

export default new AppController().server;
