import Url from '../models/Url';

export default {
  async show(req, res) {
    const { code } = req.params;
    
    const url = await Url.findOne({code});

    if(!url) {
        return res.status(404).json({ error: 'Url not found' });
    }

    return res.json(url);
  },
};
