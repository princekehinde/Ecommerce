const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken,
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
   } = require('./verifyToken');

const router = require('express').Router();

// CREATE ORDER
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const order = new Order(req.body);
    try {
        const savedorder = await order.save();
        res.status(200).json(savedorder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE ORDER
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const Updateorder = await Order.findByIdAndUpdate( 
            req.params.id,
            {
                $set: req.body
            },
            {
            new: true,
            runValidators: true
        });
        res.status(200).json(Updateorder);
    } catch (err) {
        res.status(500).json(err);
    }
});
// // GET MONTH INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const  date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() -1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() -1));
    try { 
        const income = await Order.aggregate([
         { $match: { createdAt: { $gte: previousMonth } } },
            {
              $project: {
                    month: { $month: '$createdAt' },
                    sales: "$amount",
                },
            },
            {
               $group: {
                     _id:'$month',
                     total: { $sum: '$sales' }
                    },
            }
        ])
        res.status(200).json(income);
    } catch (err) {
        console.log('err',err)
        res.status(500).json(err.message);
    }
})



// DELETE ORDER
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
         await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order deleted');
    } catch (err) {
        res.status(500).json(err);
    }
});



// GET ORDER
router.get('/find/:id',  verifyTokenAndAdmin, async (req, res) => {
    try {
        const getorder = await Order.findById(req.params.id);
         res.status(200).json(getorder);

    } catch (err) {
        res.status(500).json(err);
    }
});



// GET ALL ORDER
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const qnew = req.query.new;
    const qCategory = req.query.category
    try {
        let order;
        if(qnew){
            order = await Order.find()
            .sort({createdAt: -1})
               .limit(5)
        }else if(qCategory){
            order = await Order.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            order = await Order.find()
        }
        
         res.status(200).json(order)

    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router