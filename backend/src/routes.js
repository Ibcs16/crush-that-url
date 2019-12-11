import express from 'express';
import UrlController from './app/controllers/UrlController';
import RedirectController from './app/controllers/RedirectController';

const routes = express.Router();

// Defining routes
routes.get('/:code', RedirectController.show);
routes.post('/create', UrlController.store);

export default routes;
