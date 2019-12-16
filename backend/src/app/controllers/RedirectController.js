import Url from '../models/Url';
import bcrypt from 'bcryptjs';
import { checkAccessKey } from '../utils/compare';
import client from '../../config/redis';
import validateUrl from 'is-valid-http-url';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export default {
  async show(req, res) {
    const { name, accessKey } = req.body;
    const { code } = req.params;
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    if (!validateUrl(shortUrl)) {
      return res.status(401).json({ error: 'Invalid url' });
    }
    // // Check if it's an actual url
    // // First, search it in redis cache
    // return client.get(`url:${code}`, async (err, result) => {
    //   let url = null;

    //   // If that key exist in Redis
    //   if (result) {
    //     url = { longUrl: result };
    //     console.log(`Code ${code}`, url.longUrl);
    //   } else {
    // Key does not exist in Redis store
    // Fetch directly from db

    // // If not found, send error
    try {
      const url = await Url.findOne({ shortUrl });

      if (!url) {
        return res.status(404).json({ error: 'Url not found', shortUrl });
      }

      if (url.isPrivate) {
        if (!(await checkAccessKey(accessKey, url.accessKey))) {
          return res.status(401).json({ error: 'Access key does not match' });
        }
      }

      return res.status(302).redirect(url.longUrl);
      // await client.set(`url:${code}`, url.longUrl);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  },

  // // otherwise
  // // imcrements number of clicks on the url
  // await url.update({ $inc: { 'analytics.clicks': 1 } });
  // await url.save();

  // redirects user to actual website
  //   });
  // },
};
