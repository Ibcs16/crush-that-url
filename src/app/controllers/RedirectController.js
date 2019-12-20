import Url from '../models/Url';
import bcrypt from 'bcryptjs';
import { checkAccessKey } from '../utils/compare';
import client from '../../config/redis';
import validateUrl from 'is-valid-http-url';

export default {
  async show(req, res) {
    const { code } = req.params;

    const { accessKey, name } = req.body;

    const { ip, browser, country } = req.body.info;

    const shortUrl = `${process.env.BASE_URL}/${code}`;

    // // Check if it's an actual url
    if (!validateUrl(shortUrl)) {
      return res.status(401).json({ error: 'Invalid url' });
    }

    // First, search it in redis cache
    let url = await client.hgetall(code);

    // Key does not exist in Redis store

    // Fetch directly from db
    if (!url) {
      url = await Url.findOne({ code });
    }

    // // If not found, send error
    if (!url) {
      return res.status(404).json({ error: 'Url not found', shortUrl });
    }

    // if url is private, check for authentication
    if (url.isPrivate === 'true' || url.isPrivate === true) {
      if (!accessKey) {
        return res.status(401).json({ error: 'Must authenticate' });
      }

      // if access key is already defined, check if it matches with original
      if (!(await checkAccessKey(accessKey, url.accessKey))) {
        return res.status(401).json({ error: 'Access key does not match' });
      }
    }

    //update analytics of url
    try {
      await Url.updateOne(
        { code },
        {
          $push: {
            'analytics.accesses': {
              ip,
              browser,
              date: Date.now(),
              country,
              name,
            },
          },
          $inc: {
            'analytics.clicks': 1,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
    return res.json({ longUrl: url.longUrl });
  },
};
