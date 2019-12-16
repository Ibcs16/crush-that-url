import shortid from 'shortid';
import validate from 'is-valid-http-url';

it('should generate valid url with code', async () => {
    const code = shortid.generate();
    expect(code).toBeTruthy();
    
    const shortUrl = `${process.env.BASE_URL}/${code}`;
    expect(validateUrl(shortUrl)).toBeTruthy();

  });