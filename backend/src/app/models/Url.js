import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
  analytics: {
    clicks: {
      type: Number,
      default: 0,
    },
  },
});

export default mongoose.model('Url', UrlSchema);
