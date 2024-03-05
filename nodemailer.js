const nodemailer = require('nodemailer');

// Create a transporter object
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-password' // Your email password
    }
});

// Define email options
let mailOptions = {
    from: 'your-email@gmail.com', // Sender address
    to: 'recipient-email@example.com', // List of recipients
    subject: 'Test Email', // Subject line
    text: 'This is a test email from Node.js' // Plain text body
};

// Send email
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
