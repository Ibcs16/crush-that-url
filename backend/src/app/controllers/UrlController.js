import validateUrl from 'is-valid-http-url';
import shortid from 'shortid';
import Url from '../models/Url';
import client from '../../config/redis';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export default {
  async store(req, res) {
    const { longUrl, isPrivate, accessKey } = req.body;

    // Check if it's an actual url
    if (validateUrl(longUrl)) {
      try {
        let url = await Url.findOne({ longUrl });

        if (url) {
          return res.json({ error: '500', message: 'This URL has already been shortened' });
        }

        // Generates new ID
        const code = shortid.generate();
        url = await Url.create({
          shortUrl: `${process.env.BASE_URL}/${code}`,
          longUrl,
          isPrivate,
          accessKey,
          code,
        });

        // If not created
        if (!url) {
          return res.status(500).json({ error: 'Unable to save this URL' });
        }

        await client.set(`url:${code}`, longUrl);

        return res.json(url);
      } catch (err) {
        return res.status(500).json({ error: 'Server error' });
      }
    } else {
      return res.status(401).json({ error: 'Invalid URL' });
    }
  },
};
