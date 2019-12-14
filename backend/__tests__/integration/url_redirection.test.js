import mongoose from 'mongoose';
import faker from 'faker';
import shortid from 'shortid';
import validateUrl from 'is-valid-http-url';
import request from 'supertest';
import Url from '../../src/app/models/Url';
import app from '../../src/app';
import connectToDb from '../../src/config/db';

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
    const longUrl =
      faker.internet.url();
    
    const code = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    expect(validateUrl(shortUrl)).toBeTruthy();

    const url = await Url.create({
        longUrl,
        shortUrl,
        code
    });

    expect(url.longUrl).toBeTruthy();
    expect(url.shortUrl).toBeTruthy();

    const res = await request(app)
        .get(`/redirect/${code}`)
        // should have redirected to long url
        .expect('Location', longUrl);
     expect(res.status).toBe(302)
  });


it(' should return invalid url if short url code is invalid', async () => {
    
    const code = '$u( *@';
    // const shortUrl = `${process.env.BASE_URL}/${code}`;

   
    // expect(validateUrl(shortUrl)).toBeFalsy();

    const res = await request(app)
        .get(`/redirect/${code}`)
        
    expect(res.status).toBe(401)

  });


});
