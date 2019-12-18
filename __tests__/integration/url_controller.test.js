import Url from '../../src/app/models/Url';
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
describe('URL creation', () => {
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
  it(' should return a new URL item when @route /create is called with valid URL', async () => {
    const longUrl = faker.internet.url();
    expect(validateUrl(longUrl)).toBeTruthy();

    const res = await request(app)
      .post('/create')
      .send({ longUrl });

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.error).toBeFalsy();
    expect(res.body.longUrl).toBeTruthy();
    expect(res.body.shortUrl).toBeTruthy();
  });

  // legible name to the test
  it(' should return error when @route /create is called with invalid URL', async () => {
    const longUrl = 'kpoaksodpdas';
    expect(validateUrl(longUrl)).toBeFalsy();

    const res = await request(app)
      .post('/create')
      .send({ longUrl });

    expect(res.status).toBe(401);
  });

  // // legible name to the test
  // it(' should return 500 if URL has already been created', async () => {
  //   const longUrl = faker.internet.url(); // faker.internet.url();
  //   const code = shortid.generate();
  //   const shortUrl = `${process.env.BASE_URL}/${code}`;

  //   const url = await Url.create({
  //     longUrl,
  //     code,
  //     shortUrl,
  //   });

  //   expect(url.longUrl).toBeTruthy();

  //   const res = await request(app)
  //     .post('/create')
  //     .send({ longUrl });

  //   expect(res.status).toBe(200);
  //   expect(res.body.error).toBeTruthy();
  // });
});
