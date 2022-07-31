const Cart = require('../models/Cart');
const User = require('../models/User');
const { verifyToken,
    verifyTokenAndAuthorization, 
    verifyTokenAndAdmin 
   } = require('./verifyToken');

const router = require('express').Router();

// CREATE CART
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const cart = new Cart(req.body);
    try {
        const savedcart = await cart.save();
        res.status(200).json(savedcart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE CART
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const UpdateCart = await Cart.findByIdAndUpdate( 
            req.params.id,
            {
                $set: req.body
            },
            {
            new: true,
            runValidators: true
        });
        res.status(200).json(UpdateCart);
    } catch (err) {
        res.status(500).json(err);
    }
});




// DELETE Cart
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
         await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart deleted');
    } catch (err) {
        res.status(500).json(err);
    }
});



// GET CART
router.get('/find/:userId',  verifyTokenAndAuthorization ,async (req, res) => {
    try {
        const getCART = await Cart.findOne({userId:req.params.userId});
         res.status(200).json(getCART);

    } catch (err) {
        res.status(500).json(err);
    }
});



// GET ALL CART
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const qnew = req.query.new;
    const qCategory = req.query.category
    try {
        let cart;
        if(qnew){
            cart = await Cart.find()
            .sort({createdAt: -1})
               .limit(5)
        }else if(qCategory){
            cart = await Cart.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            cart = await Cart.find()
        }
        
         res.status(200).json(cart)

    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router