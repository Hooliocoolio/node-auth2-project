const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const Users = require("../routes/userModel")
const restrict = require("../middleware/restricted")

const router = express.Router()

router.get("/users", restrict("admin"), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.get("/users/:department", restrict("user"), async (req, res, next) => {
	try {
		 
		res.json(await Users.findByDept())
	} catch(err) {
		next(err)
	}
})

router.post("/register", async (req, res, next) => {
	try {
		const { username, password, department, role } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
        }
        
        const newUser = await Users.register ({
            username,
			password:await bcrypt.hash(password, 12),
			department,
			role
        })


		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", restrict("basic"), async (req, res, next) => {
		try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		// hash the password again and see if it matches what we have in the database
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		// generate a new JSON web token
			const token = jwt.sign({
				userID: user.id,
				userRole: "admin",
			}, process.env.JWT_SECRET)


		// generate a new session for this user,
		// and sends back a session ID
		// req.session.user = user

		// send the token back as a cookie
		res.cookie("token", token)
		res.json({
			message: `Welcome ${user.username}!`,
			// token: token,
		})
	} catch(err) {
		next(err)
	}
})

router.get("/logout", (req, res, next) => {
	try{
        req.session.destroy((err) => {
            if(err) {
                next(err)
            } else {
                res.status(204)
            }
        })
    }catch(err) {
        nextt(err)
    }
 
})

module.exports = router