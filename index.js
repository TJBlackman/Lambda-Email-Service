require('dotenv').config();

const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
const cors = require('cors');
var bodyParser = require('body-parser');
const port = 3000;

// create html email
const makeHtmlEmail = (site, body) => {
  let html = '';
  html += `<p>New email from <b>${site.domain}</b>! Do not reply to this email.</p>`;
  for (key in body) {
    html += `
    <p style="margin: 0px;">
      <label>${key}: </label>
      <span>${body[key]}</span>
    </p>`;
  }
  return html;
};

// sg api setup
sgMail.setApiKey(process.env.SG_API_KEY);

// whitelist websites
const websites = {
  'https://www.bradshousermk.com': {
    domain: 'https://www.bradshousermk.com',
    to: 'nick@gmail.com',
    from: 'website@bradshousermk.com',
    bcc: 'TJBlackman08@gmail.com',
    subject: 'New Form Submission | BradsHouseRMK.com',
  },
  'https://www.trevorblackman.io': {
    domain: 'https://www.trevorblackman.io',
    to: 'TJBlackman08@gmail.com',
    from: 'website@trevorblackman.io',
    subject: 'New Form Submission | trevorblackman.io',
  },
  localhost: {
    domain: 'localhost',
    to: 'tjblackman08@gmail.com',
    from: 'localhost@bradshouse.rmk',
    subject: 'Test Email | Email service API',
  },
  '127.0.0.1': {
    domain: 'localhost',
    to: 'tjblackman08@gmail.com',
    from: 'localhost@bradshouse.rmk',
    subject: 'Test Email | Email service API',
  },
};

const corsOption = {
  origin: Object.keys(websites),
  methods: ['POST'],
};

app.use(bodyParser.json());

// echo controller
app.get('/api/echo/:msg', (req, res) => {
  res.send(`${new Date().toLocaleString()} - You wrote: "${req.params.msg}"`);
});

// mail controller
app.options(`/api/send-email`, cors(corsOption));
app.post(`/api/send-email`, cors(corsOption), async (req, res) => {
  try {
    const site = websites[req.header('Origin')];
    if (!site) {
      throw Error('Origin not approved.');
    }

    const email = {
      to: site.to,
      from: site.from,
      subject: site.subject,
      text: JSON.stringify(req.body, null, 4),
      html: makeHtmlEmail(site, req.body),
    };

    sgMail.send(email, () => {
      console.log(`Form sent successfully. ${new Date()}`);
      console.log(email);

      res.send({
        success: true,
        message: 'Email sent successfully!',
      });
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
