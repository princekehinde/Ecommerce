const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const cartRouter = require('./routes/cart')

dotenv.config()

mongoose
.connect(process.env.DB_connection)
   .then(() => console.log('mongoDB connected'))
.catch((err) => { 
    console.log('mongoDb server error')
})

app.use(express.json());
app.use("/api/users", userRouter)
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/cart', cartRouter);

app.listen(6000, () => {
    console.log('Backend server running')
});