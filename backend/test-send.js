// backend\test-send.js
import 'dotenv/config';
import { sendMail } from './graph-mail.js';

(async () => {
  try {
    await sendMail({
      to: 'your.recipient@example.com',   // change to a real recipient
      subject: 'PM Dashboard — test email',
      html: '<p>This is a test email sent via Microsoft Graph API.</p>'
    });
    console.log('Test send complete.');
  } catch (err) {
    console.error('Test send error:', err.response ? err.response.data : err.message);
  }
})();
