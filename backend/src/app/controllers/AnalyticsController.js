import validateUrl from 'valid-url';
import Url from '../models/Url';
import client from '../../config/redis';

require('dotenv').config({
    path: process.env.NODE_ENV ==='test' ? '.env.test' : '.env'
});

export default {
  async show(req, res) {
    const { shortUrl } = req.params;
    
    const url = Url.findeOne({shortUrl});

    if(!url) {
        return res.status(404).json({ error: 'Url not found' });
    }
      
    return res.json(url);
  },
};
