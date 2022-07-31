const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);


router.post('/payment', (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: 'usd',
    }, (stripeErr,stripeRes) => {
        if (stripeErr) {
            res.status(stripeErr.message).json({
                message: stripeErr.message,
                });
                } else {
                    res.status(200).json({
                        message: 'Payment successful',
                        result: stripeRes,
                    });
                    }
})
})
module.export = router;
