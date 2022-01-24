const nodemailer = require('nodemailer');
const dotenv = require('dotenv')

dotenv.config()

const generateMaiTemplate = (otp) => {
    return (`
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8>
                <meta http-equiv="X-UA-Compatible" content="IE-edge>
                
                <style>
                    @media only screen and (max-width:620px){
                        h1{
                            font-size: 20px;
                            padding: 5px;
                        }
                    }
                </style>
            </head>

            <body>
                <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
                    <h1 style="background: #f6f6f6; padding: 10px; text-align:center; color: #272727;">
                        We are delighted to welcome you to our team!
                    </h1>
                    <p>Please Verify Your Email To Continue, Your Verification Code is:</p>
                    <p style="width: 80px; margin: 0 auto; font-weight: bold; text-align:center; background: #f6f6f6; border-radius: 5px; font-size: 25px;">
                        ${otp}
                    </p>
                </div>
            </body>

        </html>`
    )
}


const afterMailVerifiedTemplate = (heading, message) => {
    return (`
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8>
            <meta http-equiv="X-UA-Compatible" content="IE-edge>
            
            <style>
                @media only screen and (max-width:620px){
                    h1{
                        font-size: 20px;
                        padding: 5px;
                    }
                }
            </style>
        </head>

        <body>
            <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
                <h1 style="background: #f6f6f6; padding: 10px; text-align:center; color: #272727;">
                    ${heading}
                </h1>
                <p style="color: #272727; text-align:center;">
                    ${message}
                </p>
            </div>
        </body>

    </html>`
    )
}


const forgotPasswordTemplate = (forgotPasswordLink) => {
    return (`
    <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8>
                <meta http-equiv="X-UA-Compatible" content="IE-edge>
                
                <style>
                    @media only screen and (max-width:620px){
                        h1{
                            font-size: 20px;
                            padding: 5px;
                        }
                    }
                </style>
            </head>

            <body>
                <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
                    <h1 style="background: #f6f6f6; padding: 10px; text-align:center; color: #272727;">                       	
                        Reset Password
                    </h1>
                    <P>A Password reset event has been triggered. The password reset Link will be expire in 10 minutes</p>
                    <a href="${process.env.CLIENT_PRODUCTION_MODE}/account/reset/password/${forgotPasswordLink}">${forgotPasswordLink}</a>
                </div>
            </body>

        </html>`
    )
}



// creating transporter for send gmail

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
    },
});


// sending otp to gmail for verify gmail
exports.sendOtpToEmail = (email, otp) => {
    transporter.sendMail({
        from: "From Music Player frowebformail@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Verify Your Email Account", // Subject line
        html: generateMaiTemplate(otp), // html body
    });
}


// sending message to gmail after gmail verified
exports.afterEmailVerified = (email, heading, message) => {
    transporter.sendMail({
        from: "From Music Player frowebformail@gmail.com",
        to: email,
        subject: "Successfully Account Created",
        html: afterMailVerifiedTemplate(heading, message)
    });
}


exports.forgotPasswordOtp = (email, forgotPasswordLink) => {
    transporter.sendMail({
        from: "From Music Player frowebformail@gmail.com",
        to: email,
        subject: "Forgot Password Request",
        html: forgotPasswordTemplate(forgotPasswordLink)
    });
}