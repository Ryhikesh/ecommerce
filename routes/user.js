const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Ecommers = require('../models/user_schema'); 
const bcrypt = require('bcrypt');

const app = express(); 

app.use(express.json()); 

router.post('/saveuserdetail', async (req, res) => {
    const { firstName, lastName, email, phone, password,user_role} = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !user_role) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }
    const existingUser = await Ecommers.User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        title: 'Email already registered',
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    try {
        const newUser = new Ecommers.User({
            firstName,
            lastName,
            email,
            phone,
            user_role,
            password: hashedPassword,

        });

        await newUser.save();
        res.status(201).json({ status: 'saved' });
    } catch (error) {
        console.error('Error saving user detail:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'An error occurred while saving user details' });
        }
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    try {
        const user = await Ecommers.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.status(200).json({ status: 'success', message: 'Login successful', user});
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', message: 'An error occurred during login' });
    }
});

router.get('/getproductlist/:role/:umail', async (req, res) => {
    var product_list;
    var order_list;
    if(req.params.role=='Customer')
    {
         product_list = await Ecommers.Product.find({ });
         order_list=await Ecommers.Order.find({ purchaser_mail: req.params.umail });
    }
    else if(req.params.role=='Admin')
    {
        product_list = await Ecommers.User.find({ });
      
    }
    
    res.status(200).json({
        product_list:product_list,
        role:req.params.role,
        order_list:order_list
    })

})

router.post('/savecartproduct', async (req, res) => {
        const { purchaser_name, purchaser_mail, product_name, product_code, total_cost, product_img, purchase_qty } = req.body;
        const cartItem = new Ecommers.Cart({
            purchaser_name,
            purchaser_mail,
            product_name,
            product_code,
            total_cost,
            product_img,
            purchase_qty,
        });

        await cartItem.save();
        const cart_list = await Ecommers.Cart.find({ purchaser_mail });
        
        
        res.status(201).json({ status: 'saved',cart_list});
   
});

router.get('/getCartlist/:umail', async (req, res) => {
    const mailid = req.params.umail;

        const cart_list = await Ecommers.Cart.find({ purchaser_mail: mailid });
        res.status(201).json({ cart_list});
});

router.get('/deleteproduct/:id', async (req, res) => {
        const cartId = mongoose.Types.ObjectId(req.params.id);
        console.log(cartId);

        const deletedCart = await Ecommers.Cart.findByIdAndDelete(cartId);
        console.log(deletedCart. purchaser_mail)
        
        const cart_list = await Ecommers.Cart.find({ purchaser_mail: deletedCart. purchaser_mail});


        res.status(201).json({ cart_list });
   
});

router.post('/purchaseproduct', async (req, res) => {
    var total_cost=req.body.reduce((accumulator, product) => accumulator + product.total_cost, 0)

    const order_info = req.body.map(x => ({
        product_name: x.product_name,
        product_img: x.product_img,
        purchase_qty: x.purchase_qty,
        product_cost: x.total_cost,
        product_code: x.product_code
    }));

    const newOrder = new Ecommers.Order({
        purchaser_name: req.body[0].purchaser_name, 
        purchaser_mail: req.body[0].purchaser_mail, 
        total_cost: total_cost,
        order_id:Math.floor(100000 + Math.random() * 900000),
        order_info: order_info
    });

    await newOrder.save();

    const ids = req.body.map(product => product._id);
    var delete_list=await Ecommers.Cart.deleteMany({_id: { $in: ids }});
    var cart_list=await Ecommers.Cart.find({});
    var order_list=await Ecommers.Order.find({ purchaser_mail: req.body[0].purchaser_mail});

    res.status(201).json({ message: 'Order saved successfully!', order_list: order_list,cart_list:cart_list});
})


module.exports = router;