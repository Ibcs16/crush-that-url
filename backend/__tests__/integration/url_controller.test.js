import Url  from '../../src/app/models/Url';
import mongoose from 'mongoose';
const databaseName = 'test';
import faker from 'faker';
import shortid from 'shortid';
import validateUrl from 'valid-url';
import request from 'supertest';
import app from '../../src/app';
//If used, shouldn't import Url from model in this current file
//import factory from '../factories';

require('dotenv').config({
    path: process.env.NODE_ENV ==='test' ? '.env.test' : '.env'
});



//deal with multiple application parts
//describe categorize tests
describe('URL creation',  ()=>{

    //connects to test database
    beforeAll(async () => {
        const url = `${process.env.MONGO_URI}`
        await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
    });

    // Cleans up database between each test
    afterEach(async () => {
        await Url.collection.drop();
        await Url.deleteMany();
        const urls = await Url.find();
        console.log(urls,  'all')
    });

    afterAll(async () => {
        // Removes the Url collection
        // await Url.collection.drop();
        await mongoose.connection.close();
    });
   
    //legible name to the test
    it(' should return a new URL item when @route /create is called with valid URL', async () => {
       
        const longUrl = 'https://medium.com/@lucaspenzeymoog/mocking-api-requests-with-jest-452ca2a8c7d7';//faker.internet.url();
        expect(validateUrl.isUri(longUrl)).toBeTruthy();

        const code = shortid.generate();

        const shortUrl = `${process.env.BASE_URL}/${code}`;
        const res = await request(app).post('/create')
        .send({longUrl})
    
        const url = await Url.findOne({shortUrl});

        // const url = await Url.create({longUrl, shortUrl});
         console.log(url)
 
        expect(url.longUrl).toBeTruthy();
        expect(url.shortUrl).toBeTruthy();

        expect(res.status).toBe(200);
        expect(res.body.longUrl).toBeTruthy()
        expect(res.body.shortUrl).toBeTruthy()
    });


    //legible name to the test
    it(' should return a new URL item when @route /create is called with invalid URL', async () => {
       
        const longUrl = 'kpoaksodpdas';
        expect(validateUrl.isUri(longUrl)).toBeFalsy();

        const res = await request(app).post('/create')
        .send({longUrl})
    

        expect(res.status).toBe(401)
    });
})
