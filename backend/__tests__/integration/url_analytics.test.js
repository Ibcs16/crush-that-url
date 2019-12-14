import mongoose from 'mongoose';
import faker from 'faker';
import shortid from 'shortid';
import validateUrl from 'is-valid-http-url';
import request from 'supertest';
import Url from '../../src/app/models/Url';
import app from '../../src/app';
import connectToDb from '../../src/config/db';

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
  it('should return analytics when @route /analytics/:code is called with existing url code', async () => {
   
    const longUrl = faker.internet.url();
    const code = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${code}`;

    expect(validateUrl(longUrl)).toBeTruthy();

    const url = await Url.create({
        longUrl,
        shortUrl,
        code
    });

    expect(url.code).toBeTruthy();

    const res = await request(app).get(`/analytics/${code}`);

    expect(res.status).toBe(200);
    expect(res.body.analytics).toBeTruthy();
    

  });

  // legible name to the test
  it('should return url-not-found when @route /analytics/:code is called with nonexisting url code', async () => {
    // given created url
    const code = shortid.generate();

    const res = await request(app).get(`/analytics/${code}`);

    expect(res.status).toBe(404);

  });

});
