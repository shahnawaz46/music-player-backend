const userCollection = require('../model/UserCollection');

exports.signup = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const isUserExit = await userCollection.findOne({ email })
        if (isUserExit) {
            return res.status(400).json({ error: "User Already Exist" })
        }

        const user = new userCollection({ name, email, password })
        await user.save((error, solve) => {
            if (error) {
                return res.status(400).json({ error: "Something Gone Wrong Please Try Again" })
            }
            else if (solve) {
                return res.status(200).json({ message: "Account Created Successfully", user: { name: solve.name, email: solve.email } })
            }
        })


    } catch (err) {
        // console.log("signup error", err)
        return res.status(400).json({ error: "Something Gone Wrong Please Wait" })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const isUserExit = await userCollection.findOne({ email })
        if (isUserExit) {
            if (password !== isUserExit.password) {
                return res.status(401).json({ error: "Invalid credential" })
            }
            return res.status(200).json({ message: "Login Successfully", user: { name: isUserExit.name, email: isUserExit.email } })
        }
        return res.status(404).json({ error: "No Account Found Please Signup First" })

    } catch (error) {
        return res.status(400).json({ error: 'something wrong please try again' })
    }
}