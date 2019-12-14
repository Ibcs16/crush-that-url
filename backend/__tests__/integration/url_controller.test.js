import mongoose from 'mongoose';
import faker from 'faker';
import shortid from 'shortid';
import validateUrl from 'valid-url';
import request from 'supertest';
import Url from '../../src/app/models/Url';
import app from '../../src/app';

const databaseName = 'test';
// If used, shouldn't import Url from model in this current file
// import factory from '../factories';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

// deal with multiple application parts
// describe categorize tests
describe('URL creation', () => {
  // connects to test database
  beforeAll(async () => {
    const url = `${process.env.MONGO_URI}`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Cleans up database between each test
  afterEach(async () => {
    await Url.deleteMany();
  });

  afterAll(async () => {
    // Removes the Url collection
    // await Url.collection.drop();
    await mongoose.connection.close();
  });

  // legible name to the test
  it(' should return a new URL item when @route /create is called with valid URL', async () => {
    const longUrl =
      'https://medium.com/@lucaspenzeymoog/mocking-api-requests-with-jest-452ca2a8c7d7'; // faker.internet.url();
    expect(validateUrl.isUri(longUrl)).toBeTruthy();

    const res = await request(app)
      .post('/create')
      .send({ longUrl });

    expect(res.status).toBe(200);
    expect(res.body.error).toBeFalsy();
    expect(res.body.longUrl).toBeTruthy();
    expect(res.body.shortUrl).toBeTruthy();

    const url = await Url.findOne({ shortUrl: res.body.shortUrl });

    expect(url.longUrl).toBeTruthy();
    expect(url.shortUrl).toBeTruthy();



  });

  // legible name to the test
  it(' should return a new URL item when @route /create is called with invalid URL', async () => {
    const longUrl = 'kpoaksodpdas';
    expect(validateUrl.isUri(longUrl)).toBeFalsy();

    const res = await request(app)
      .post('/create')
      .send({ longUrl });

    expect(res.status).toBe(401);
  });
});
