const nodemailer = require('nodemailer')


const sendEmail = options => {
    var transport = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,

        // host: process.env.SMTP_HOST,
        // port: process.env.SMTP_PORT,
        auth: {
            // user: process.env.SMTP_USER,
            // pass: process.env.SMTP_PAS,
            user: 'khagijora2074@gmail.com',
            pass: 'vwuvzacadvyyyogx'

        }
    });
    const mailoption = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text

    }
    transport.sendMail(mailoption)
}
module.exports = sendEmail