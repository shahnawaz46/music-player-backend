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


// sending gmail
exports.sendOtpToEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: "From Music Player frowebformail@gmail.com", // sender address
            to: email, // list of receivers
            subject: "Verify Your Email Account", // Subject line
            html: generateMaiTemplate(otp), // html body
        });
        return "true"

    } catch (error) {
        // console.log(error)
        return "false"
    }
}


// sending gmail
exports.afterEmailVerified = async (email, heading, message) => {
    await transporter.sendMail({
        from: "From Music Player frowebformail@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Successfully Account Created", // Subject line
        html: afterMailVerifiedTemplate(heading, message) // html body
    });
}