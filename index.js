require('dotenv').config();

const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
const port = 3000;

// create html email
const makeHtmlEmail = (site, body) => {
  return `
    <p>New email from ${site.domain}!
      <br/>
      <b>Do NOT reply to this email.</b>
    </p>
    <p>
      <span>Name: </span>
      <span>${body.name}</span>
    </p>
    <p>
      <span>Email Address: </span>
      <span>${body.emailAddress}</span>
    </p>
    <p>
      <span>Message:</span>
      <br/>
      <span>${body.message}</span>
    </p>
  `;
};

// sg api setup
sgMail.setApiKey(process.env.SG_API_KEY);

// whitelist websites
const websites = {
  'bradshousermk.com': {
    domain: 'bradshousermk.com',
    to: 'nick@gmail.com',
    from: 'website@bradshousermk.com',
    bcc: 'TJBlackman08@gmail.com',
  },
  'trevorblackman.io': {
    domain: 'trevorblackman.io',
    to: 'TJBlackman08@gmail.com',
    from: 'website@trevorblackman.io',
  },
  localhost: {
    domain: 'localhost',
    to: 'tjblackman08@gmail.com',
    from: 'localhost@bradshouse.rmk',
  },
};

// echo controller
app.get('/api/echo/:msg', (req, res) => {
  res.send(`${new Date().toLocaleString()} - You wrote: "${req.params.msg}"`);
});

// mail controller
app.post(`/api/email`, async (req, res) => {
  try {
    // affirm request is from whitelist domain
    const site = websites[req.hostname];
    if (!site) {
      throw Error('Origin not approved.');
    }

    const msg = {
      to: site.to,
      from: site.from,
      subject: req.body.subject,
      text: req.body.subject,
      html: makeHtmlEmail(site, req.body),
    };
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
