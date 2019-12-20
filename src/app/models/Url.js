import bcrypt from 'bcryptjs';
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
        name: {
          type: String,
          default: '',
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
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1s' },
  },
  created_at: { type: Date, default: Date.now },
});

UrlSchema.pre('save', async function(next) {
  if (this.accessKey !== '') {
    this.accessKey = await bcrypt.hash(this.accessKey, 8);
  }

  next();
});

UrlSchema.method('toJSON', function() {
  var url = this.toObject();
  delete url.accessKey;
  return url;
});

export default mongoose.model('Url', UrlSchema);
