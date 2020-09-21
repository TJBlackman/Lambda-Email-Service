const config = require('./config');
const sgMail = require('@sendgrid/mail');
const querystring = require('querystring');

// setup sendgrid
sgMail.setApiKey(config.SG_API_KEY);

module.exports = async (req, res) => {
  try {
    // only accept requests from bradshousermk.com
    if (!req.headers.origin.includes('bradshousermk.com')){
      res.end('Unauthorized.');
      return; 
    }

    console.log('=====!!!===== New Form Submission =====!!!=====');
    const values = querystring.parse(req.url)
    console.log(req.url);

    const html = Object.entries(values).reduce((acc, item) => {
      return `${acc}<p>${item[0].replace('/?','')}: ${item[1]}</p>`;
    },'');
    console.log(html);

    const email = {
      to: config.TO,
      from: config.FROM,
      bcc: config.BCC,
      subject: config.SUBJECT,
      html: html
    }; 

    const replyTo = values['Email Address'];
    if (replyTo){
      email.replyTo = values['Email Address'];
    } else {
      console.log('Error: Unable to assign replyTo address.');
      console.log(`Error: values['Email Address'] returns "${replyTo}".`);
      return;
    }

    sgMail.send(email, () => {
      console.log(`Form sent successfully. ${new Date()}`);
      res.end(`Form sent successfully. ${new Date()}`);
    });

  } catch (err){
    console.log(err);
  }
}