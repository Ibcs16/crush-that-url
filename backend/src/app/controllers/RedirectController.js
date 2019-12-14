import validateUrl from 'is-valid-http-url';
import Url from '../models/Url';
import client from '../../config/redis';

require('dotenv').config({
  path: process.env.NODE_ENV ==='test' ? '.env.test' : '.env'
});

export default {
  async show(req, res) {
    const { code } = req.params;
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    // Check if it's an actual url
    if (validateUrl(shortUrl)) {
      // First, search it in redis cache
      return client.get(`url:${code}`, async (err, result) => {
        let url = null;

        // If that key exist in Redis
        if (result) {
          url = { longUrl: result };
          console.log(`Code ${code}`, url.longUrl);
        } else {
          // Key does not exist in Redis store
          // Fetch directly from db

          // // If not found, send error
          try {
            url = await Url.findOne({ shortUrl });
            
            if (!url) {
              return res.status(404).json({ error: 'Url not found', shortUrl });
            }
            
            await client.set(`url:${code}`, url.longUrl);
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server error' });
          }
        }

        

        // // otherwise
        // // imcrements number of clicks on the url
        // await url.update({ $inc: { 'analytics.clicks': 1 } });
        // await url.save();

        // redirects user to actual website
        return res.status(302).redirect(url.longUrl);
      });
    }
    return res.status(401).json({ error: 'Invalid url' });
  },
};
