const userCollection = require('../model/UserCollection');
const bcrypt = require('bcrypt');
const OtpCollection = require('../model/OtpCollection');

const { sendOtpToEmail, afterEmailVerified } = require('../utils/SendingMail');


exports.signup = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const isUserExit = await userCollection.findOne({ email })
        if (isUserExit) {
            return res.status(400).json({ error: "User Already Exist" })
        }

        const user = new userCollection({ name, email, password })

        const otp = Math.ceil(1000 + Math.random() * 412)
        const userOtp = new OtpCollection({ userId: user._id, otp })

        await userOtp.save()
        await user.save()

        res.status(200).json({ message: "Account Created Successfully", _id: user._id })

        // calling sendOtpToEmail() function to send email
        // import from utils
        const isEmailSent = await sendOtpToEmail(user.email, otp)

        if (isEmailSent === "false") {
            throw "404"

        }


    } catch (err) {
        console.log("signup error", err)
        err === "404" ? res.status(404).json({ error: "Email not sent Please Check Again" }) :
            res.status(400).json({ error: "Something Gone Wrong Please Wait" })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const isUserExit = await userCollection.findOne({ email })
        if (isUserExit) {
            if (!bcrypt.compare(password, isUserExit.password)) {
                return res.status(401).json({ error: "Invalid credential" })
            }

            return res.status(200).json({ message: "Login Successfully", user: { _id: isUserExit._id, name: isUserExit.name, email: isUserExit.email, isEmailVerified: isUserExit.isEmailVerified } })
        }
        return res.status(404).json({ error: "No Account Found Please Signup First" })

    } catch (error) {
        return res.status(400).json({ error: 'something wrong please try again' })
    }
}

exports.emailVerification = async (req, res) => {
    const { otp, _id } = req.body
    try {
        const isUserExist = await userCollection.findById(_id)
        if (!isUserExist) {
            return res.status(404).json({ error: "No Account Found Please Signup First" })
        }

        if (isUserExist.isEmailVerified) {
            return res.status(400).json({ error: "This account is already verified" })
        }

        const isOtpAvailable = await OtpCollection.findOne({ userId: _id })
        if (!isOtpAvailable) {
            return res.status(404).json({ error: "No user found in our Database Please Signup Again" })
        }

        const isOtpMatch = await bcrypt.compare(otp, isOtpAvailable.otp)
        if (!isOtpMatch) {
            return res.status(400).json({ error: "OTP not match please enter correct OTP" })
        }

        isUserExist.isEmailVerified = true
        await isUserExist.save()

        await OtpCollection.findByIdAndDelete(isOtpAvailable._id)

        res.status(200).json({ message: "Gmail Verified Successfully", user: { name: isUserExist.name, email: isUserExist.email } })

        await afterEmailVerified(isUserExist.email, "Gmail Verified Successfully", "Thanks for connecting with us")


    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'something wrong please try again' })
    }
}