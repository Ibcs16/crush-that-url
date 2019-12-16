import { factory } from 'factory-girl';
import Url from '../src/app/models/Url';

factory.define("Url", Url, {
    longUrl: '',
    shortUrl: '',
})

export default factory;