import 'dotenv/config';
import axios from 'axios';
import qs from 'qs';

async function exchangeCode(code) {
  const tokenUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`;
  const data = {
    client_id: process.env.CLIENT_ID,
    scope: 'offline_access Mail.Send openid profile',
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    grant_type: 'authorization_code',
    client_secret: process.env.CLIENT_SECRET
  };
  try {
    const resp = await axios.post(tokenUrl, qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('--- TOKEN RESPONSE ---');
    console.log(JSON.stringify(resp.data, null, 2));
    console.log('----------------------');
    console.log('Save the value of resp.data.refresh_token into your .env as REFRESH_TOKEN.');
  } catch (err) {
    console.error('Token exchange failed:');
    if (err.response && err.response.data) console.error(err.response.data);
    else console.error(err.message);
    process.exit(1);
  }
}

// Read argument
const code = process.argv[2];
if (!code) {
  console.error('Usage: node exchange-code.js <AUTH_CODE>');
  process.exit(1);
}

exchangeCode(code);
