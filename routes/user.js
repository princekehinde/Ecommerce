const User = require('../models/User');
const usER = require('../models/User');
const { verifyToken,
     verifyTokenAndAuthorization, 
     verifyTokenAndAdmin 
    } = require('./verifyToken');

const router = require('express').Router();


//UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.Password
            ).toString();
    }
    try {
        const user = await usER.findByIdAndUpdate( 
            req.params.id,{
                $set: req.body
            },
            {
            new: true,
            runValidators: true
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});
// GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const  date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));
    try { 
        const data = await User.aggregate([
         { $match: { createdAt: { $gte: lastYear } } },
            {
              $project: {
                    month: { $month: '$createdAt' },
                },
            },
            {
               $group: {
                     _id:'$month',
                     total: { $sum: 1 },
               }
            }
        ])
        res.status(200).json(data);
    } catch (err) {
        console.log('err',err)
        res.status(500).json(err.message);
    }
})


// DELETE USER
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
         await usER.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted');
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER
router.get('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await usER.findById(req.params.id);
        const { password, ...others } = user._doc;
         res.status(200).json(others)

    } catch (err) {
        res.status(500).json(err);
    }
});



// GET ALL USER
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ?
         await usER.find()
         .sort({_id: -1})
            .limit(1)
         : await usER.find()
         res.status(200).json(users)

    } catch (err) {
        res.status(500).json(err);
    }
});

 
module.exports = router;