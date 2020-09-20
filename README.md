# Lambda-Email-Service

A serverless function that receives form data and sends an email using the SendGrid email API. Uses some very basic domain whitelisting to prevent spam. Service is hosted with AWS hosting.

#### Example request

```js
fetch('/api/email', {
    method: 'POST',
    body: {
        name: 'john doe',
        subject: 'Domain.com | Contact Form'
        emailAddress: 'john.doe@gmail.com',
        message: 'I would like to get in touch with you!'
    }
});
```
