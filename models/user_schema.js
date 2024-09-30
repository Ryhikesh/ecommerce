const { type } = require('jquery');
var mongoose = require('mongoose'),
connectionOne = require('../db/db');
var Schema = mongoose.Schema;

var orderSchema=new Schema({
    product_name:{type:String},
    purchase_qty:{type:Number},
    product_cost:{type:Number},
    product_img:{type:String},
    product_code:{type:Number}
})

var purchasesSchema=new Schema({
    purchaser_name:{type:String},
    purchaser_mail:{type:String},
    total_cost:{type:Number},
    order_id:{type:Number},
    order_info:[orderSchema]
})

var cartSchema=new Schema({
    purchaser_name:{type:String},
    purchaser_mail:{type:String},
    purchase_qty:{type:Number},
    product_name:{type:String},
    product_code:{type:Number},
    total_cost:{type:Number},
    product_img:{type:String},
})

var productSchema=new Schema({
    Product_name:{type:String},
    product_image:{type:String},
    product_cost:{type:Number},
    product_code:{type:Number},
    product_desc:{type:String},
    discount_percent:{type:Number}
})

var userSchema=new Schema({
    firstName:{type:String},
    lastName:{type:String},
    password:{type:String},
    email:{type:String},
    phone:{type:Number},
    user_role:{type:String}
});

const User = connectionOne.model('userdetails', userSchema); 
const Product = connectionOne.model('products', productSchema); 
const Cart = connectionOne.model('Carts', cartSchema); 
const Order = connectionOne.model('Orders', purchasesSchema); 


// module.exports = User;

module.exports = {
    User,
    Product,
    Cart,
    Order
};