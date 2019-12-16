import redis from 'redis';

const client = redis.createClient();

client.on('connect', function() {
  console.log('Redis client connected');
});

client.on('error', err => {
  console.error(err);
});

export default client;
