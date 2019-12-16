import AnalyticsController from './app/controllers/AnalyticsController';
import RedirectController from './app/controllers/RedirectController';
import UrlController from './app/controllers/UrlController';
import express from 'express';

const routes = express.Router();

// Defining routes
routes.put('/redirect/:code', RedirectController.show);
routes.get('/analytics/:code', AnalyticsController.show);
routes.post('/create', UrlController.store);

export default routes;
