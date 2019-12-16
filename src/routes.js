import express from 'express';
import UrlController from './app/controllers/UrlController';
import RedirectController from './app/controllers/RedirectController';
import AnalyticsController from './app/controllers/AnalyticsController';

const routes = express.Router();

// Defining routes
routes.get('/redirect/:code', RedirectController.show);
routes.get('/analytics/:code', AnalyticsController.show);
routes.post('/create', UrlController.store);

export default routes;
