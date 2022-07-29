const Product = require('../models/Product');
const User = require('../models/User');
const { verifyToken,
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
   } = require('./verifyToken');

const router = require('express').Router();

// CREATE PRODUCT
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE PRODUCT
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const UpdateProduct = await Product.findByIdAndUpdate( 
            req.params.id,
            {
                $set: req.body
            },
            {
            new: true,
            runValidators: true
        });
        res.status(200).json(UpdateProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});
// // GET USER STATS
// router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
//     const  date = new Date();
//     const lastYear = new Date(date.setFullYear(date.getFullYear() -1));
//     try { 
//         const data = await User.aggregate([
//          { $match: { createdAt: { $gte: lastYear } } },
//             {
//               $project: {
//                     month: { $month: '$createdAt' },
//                 },
//             },
//             {
//                $group: {
//                      _id:'$month',
//                      total: { $sum: 1 },
//                }
//             }
//         ])
//         res.status(200).json(data);
//     } catch (err) {
//         console.log('err',err)
//         res.status(500).json(err.message);
//     }
// })



// DELETE PRODUCT
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
         await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product deleted');
    } catch (err) {
        res.status(500).json(err);
    }
});



// GET PRODUCT
router.get('/find/:id',  verifyTokenAndAdmin, async (req, res) => {
    try {
        const getPRODUCT = await Product.findById(req.params.id);
         res.status(200).json(getPRODUCT);

    } catch (err) {
        res.status(500).json(err);
    }
});



// GET ALL PRODUCT
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const qnew = req.query.new;
    const qCategory = req.query.category
    try {
        let products;
        if(qnew){
            products = await Product.find()
            .sort({createdAt: -1})
               .limit(5)
        }else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find()
        }
        
         res.status(200).json(products)

    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router