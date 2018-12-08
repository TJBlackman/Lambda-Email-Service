const config = require('./config');
const sgMail = require('@sendgrid/mail');
const querystring = require('querystring');

// setup sendgrid
sgMail.setApiKey(config.SG_API_KEY);

module.exports = async req => {
  
  const values = querystring.parse(req.url)
  console.log('=====!!!===== New Form Submission =====!!!=====');
  console.log(req.url);

  const html = Object.entries(values).reduce((acc, item) => {
    return `${acc}<p>${item[0].replace('/?','')}: ${item[1]}</p>`;
  },'');

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
  }

  sgMail.send(email, () => {
    console.log(`Form sent successfully. ${new Date()}`);
  });
}