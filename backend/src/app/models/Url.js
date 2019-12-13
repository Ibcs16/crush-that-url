import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
  analytics: {
    clicks: {
      type: Number,
      default: 0,
    },
    accesses: [
      {
        ip: String,
        browser: String,
        date: {
          type: Date,
          default: Date.now,
        },
        country: {
          name: String,
          code: String,
        },
      },
    ],
  },
});

export default mongoose.model('Url', UrlSchema);
