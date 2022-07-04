const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')


// REGISTER
router.post('/register', async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        password:CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.Password
            ).toString(),
         email : req.body.email,
        phone: req.body.phone,
    });

    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser);
    }catch (err) {
        res.status(500).json(err); 

    }
});

// LOGIN
router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username})
        !user && res.status(401).json('Wrong credentials')

        const hashedpassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.Password
        );
        const Password = hashedpassword.toString(CryptoJS.enc.Utf8);

        Password !== req.body.password &&
         res.status(401).json('Wrong credentials');
        const accessToken = jwt.sign(
            {
                _id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
        )
          const { password, ...others } = user._doc;

         res.status(200).json({...others, accessToken});


    }catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;