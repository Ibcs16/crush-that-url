import validateUrl from 'valid-url';
import shortid from 'shortid';
import Url from '../models/Url';
import client from '../../config/redis';

require('dotenv').config();

export default {
  async store(req, res) {
    const { longUrl } = req.body;

    // Check if it's an actual url
    if (validateUrl.isUri(longUrl)) {
      try {
        // Generates new ID
        const code = shortid.generate();
        const url = await Url.create({
          shortUrl: `${process.env.BASE_URL}/${code}`,
          longUrl,
        });

        // If not found, send error
        if (!url) {
          return res.status(404).json({ error: 'Url not found' });
        }

        await client.set(`url:${code}`, longUrl);

        req.io.emit('crated_url', url);

        return res.json(url);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    } else {
      return res.status(401).json({ error: 'Invalid url' });
    }
  },
};
