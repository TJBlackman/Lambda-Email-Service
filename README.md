# Email Sending API

An email service for any of my existing web apps.

#### Example request

```js
fetch('/api/send-email', {
    method: 'POST',
    body: {
        name: 'john doe',
        email: 'john.doe@gmail.com',
        message: 'I would like to get in touch with you!'
    }
});
// response
{
    success: true,
    message: 'Email sent!'
}
```
