import Url from '../../src/app/models/Url';
import { addDays } from 'date-fns';
import app from '../../src/app';
import connectToDb from '../../src/config/db';
import faker from 'faker';
import mongoose from 'mongoose';
import request from 'supertest';
import shortid from 'shortid';
import validateUrl from 'is-valid-http-url';
const databaseName = 'test';
// If used, shouldn't import Url from model in this current file
// import factory from '../factories';

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

// deal with multiple application parts
// describe categorize tests
describe('URL redirection', () => {
  // connects to test database
  beforeAll(async () => {
    connectToDb();
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
  it(' should redirect to original URL if url exists and short url code is valid', async () => {
    // given created url
    const longUrl = faker.internet.url();

    const code = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    expect(validateUrl(shortUrl)).toBeTruthy();

    const url = await Url.create({
      longUrl,
      shortUrl,
      code,
      expireAt: addDays(new Date(), 365),
    });

    expect(url.longUrl).toBeTruthy();
    expect(url.shortUrl).toBeTruthy();

    const res = await request(app)
      .put(`/redirect/${code}`)
      .send({
        info: {
          ip: '',
          browser: 'google',
          name: 'iago',
          country: 'London',
        },
        accessKey: '',
      });
    // // should have redirected to long url
    // .expect('Location', longUrl);
    expect(res.status).toBe(200);
    expect(res.body.longUrl).toBeTruthy();
  });

  it(' should return invalid url if short url code is invalid', async () => {
    const code = '$u( *@';
    // const shortUrl = `${process.env.BASE_URL}/${code}`;

    // expect(validateUrl(shortUrl)).toBeFalsy();

    const res = await request(app)
      .put(`/redirect/${code}`)
      .send({
        info: {
          ip: '',
          browser: 'google',
          name: 'iago',
          country: 'London',
        },
        accessKey: '',
      });

    expect(res.status).toBe(401);
  });

  it('should return authenticate message if url is private and no password given', async () => {
    // given created url
    const longUrl = faker.internet.url();

    const code = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    expect(validateUrl(shortUrl)).toBeTruthy();

    const url = await Url.create({
      isPrivate: true,
      longUrl,
      shortUrl,
      code,
      accessKey: '',
    });

    expect(url.longUrl).toBeTruthy();
    expect(url.shortUrl).toBeTruthy();

    const res = await request(app)
      .put(`/redirect/${code}`)
      .send({
        info: {
          ip: '',
          browser: 'google',
          name: 'iago',
          country: 'London',
        },
        accessKey: '',
      });

    // .expect('Location', longUrl);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Must authenticate');
  });

  it('should redirect if url is private and given password is right', async () => {
    // given created url
    const longUrl = faker.internet.url();

    const code = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    expect(validateUrl(shortUrl)).toBeTruthy();

    const url = await Url.create({
      isPrivate: true,
      longUrl,
      shortUrl,
      code,
      accessKey: '123',
    });

    expect(url.longUrl).toBeTruthy();
    expect(url.shortUrl).toBeTruthy();

    const res = await request(app)
      .put(`/redirect/${code}`)
      .send({
        info: {
          ip: '',
          browser: 'google',
          name: 'iago',
          country: 'London',
        },
        accessKey: '123',
      });
    expect(res.status).toBe(200);
  });

  it('should not redirect if url is private and given password is wrong', async () => {
    // given created url
    const longUrl = faker.internet.url();

    const code = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    expect(validateUrl(shortUrl)).toBeTruthy();

    const url = await Url.create({
      isPrivate: true,
      longUrl,
      shortUrl,
      code,
      accessKey: '123',
    });

    expect(url.longUrl).toBeTruthy();
    expect(url.shortUrl).toBeTruthy();

    const res = await request(app)
      .put(`/redirect/${code}`)
      .send({
        info: {
          ip: '',
          browser: 'google',
          name: 'iago',
          country: 'London',
        },
        accessKey: 'kk',
      });

    // .expect('Location', longUrl);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Access key does not match');
  });
});
