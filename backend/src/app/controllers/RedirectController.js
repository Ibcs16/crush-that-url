import validateUrl from 'valid-url';
import Url from '../models/Url';

require('dotenv').config();

export default {
  async show(req, res) {
    const { code } = req.params;
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    // Check if it's an actual url
    if (validateUrl.isUri(shortUrl)) {
      try {
        // Search for url in the db
        const url = await Url.findOne({ shortUrl });

        // If not found, send error
        if (!url) {
          return res.status(404).json({ error: 'Url not found', shortUrl });
        }
        // otherwise
        // imcrements number of clicks on the url
        await url.update({ $inc: { 'analytics.clicks': 1 } });
        await url.save();

        // redirects user to actual website
        return res.redirect(url.longUrl);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
    } else {
      return res.status(401).json({ error: 'Invalid url' });
    }
  },
};
