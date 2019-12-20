import { addDays, differenceInSeconds } from 'date-fns';

import Url from '../models/Url';
import client from '../../config/redis';
import shortid from 'shortid';
import validateUrl from 'is-valid-http-url';

export default {
  async store(req, res) {
    const { longUrl, isPrivate, accessKey, expirationDateTime } = req.body;

    // Check if it's an actual url
    if (!validateUrl(longUrl)) {
      return res.status(401).json({ error: 'Invalid URL' });
    }
    // Generates new ID
    const code = shortid.generate();

    try {
      // // insert on dp
      // let url = await Url.findOne({ code });

      // if (url) {
      //   return res.json({
      //     error: '500',
      //     message: 'This URL has already been shortened',
      //   });
      // }

      // converts expiration date, if not present, sets a default value of 1 year
      let expireAt = expirationDateTime
        ? new Date(expirationDateTime)
        : addDays(Date.now(), 365);

      // creates new document on db

      let url = await Url.create({
        shortUrl: `${process.env.BASE_URL}/${code}`,
        longUrl,
        isPrivate,
        accessKey,
        code,
        expireAt,
      });

      // If not created, sends error
      if (!url) {
        return res.status(500).json({ error: 'Unable to save this URL' });
      }

      // save it on redis cacheing
      await client
        .hmset(code, [
          'accessKey',
          url.accessKey,
          'isPrivate',
          url.isPrivate,
          'longUrl',
          url.longUrl,
        ])
        .then((res, exp) => {
          if (res !== 'OK') {
            console.error('Error saving to redis');
          } else {
            // gets expiration in seconds
            const secsToExp = differenceInSeconds(expireAt, new Date());

            // set expiration
            if (secsToExp > 0) {
              try {
                client.expire(code, secsToExp);
              } catch (expError) {
                console.error(expError);
              }
            }
          }
        })
        .catch(err => {})
        .finally(() => {
          // returns created url
          return res.json(url);
        });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' + err });
    }
  },
};
