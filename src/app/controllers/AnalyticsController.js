import { endOfDay, isWithinInterval, startOfDay, subDays } from 'date-fns';

import Url from '../models/Url';

export default {
  async show(req, res) {
    const { code } = req.params;

    const url = await Url.findOne({ code });

    if (!url) {
      return res.status(404).json({ error: 'Url not found' });
    }

    const lastSevenDays = [];
    const currentDate = new Date();

    for (let i = 0; i <= 6; i++) {
      const accesses = url.analytics.accesses.reduce(
        (acc, item) =>
          isWithinInterval(item.date, {
            start: startOfDay(subDays(currentDate, i)),
            end: endOfDay(subDays(currentDate, i)),
          })
            ? acc + 1
            : acc,
        0
      );

      lastSevenDays.push(accesses);
    }

    const urlData = url.toObject();

    return res.json({ url, lastSevenDays});
  },
};
