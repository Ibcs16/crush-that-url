import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  shortUrl: {
    type: String,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
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
  isPrivate: {
    type: Boolean,
    default: false,
  },
  accessKey: {
    type: String,
    default: '',
  },
});

export default mongoose.model('Url', UrlSchema);
