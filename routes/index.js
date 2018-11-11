const route=require('express').Router();
const Cart=require('../models/cart')
 const Products=require('../models/product').Product


route.use('/products',require('./product_seeder.js').route)
route.get('/',(req,res)=>
{  let successMsg=req.flash('success')[0]
  Products.findAll().then((docs)=>{
    let productChunks=[];
    let chunksize=3;
    for(let i=0;i<docs.length;i+=chunksize){
      productChunks.push(docs.slice(i,i+chunksize))
    }
  res.render('shop/index',{title:"Shopping Cart",products:productChunks,successMsg:successMsg,noMessage:!successMsg})})}

)

route.get('/add-to-cart/:id',function(req,res){
  let productId=req.params.id;
  let cart=new Cart(req.session.cart ? req.session.cart : {} )

  Products.findById(productId).then (function(product){
   /* if(err){

     console.log(err)
      return res.redirect('/')
    }*/

    cart.add(product,product.id)
    req.session.cart=cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

route.get('/reduce/:id',(req,res,next)=>{
  let productId=req.params.id;
  let cart=new Cart(req.session.cart ? req.session.cart : {} )
  cart.reduceByOne(productId)
  req.session.cart=cart
  res.redirect('/shopping-cart')
})

route.get('/remove/:id',(req,res,next)=>{
  let productId=req.params.id;
  let cart=new Cart(req.session.cart ? req.session.cart : {} )
  cart.removeItem(productId)
  req.session.cart=cart
  res.redirect('/shopping-cart')
})

route.get('/shopping-cart',function(req,res,next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null})
  }
  let cart=new Cart(req.session.cart)
  res.render('shop/shopping-cart',{products:cart.generateArray(), totalPrice:cart.totalPrice})
})


route.get('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  let cart=new Cart(req.session.cart)
  let errMsg=req.flash('error')[0]
  res.render('shop/checkout',{total:cart.totalPrice,errMsg:errMsg,noErrors:!errMsg})
})


route.post('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart')
  }
  let cart=new Cart(req.session.cart)


  let stripe = require("stripe")("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

  stripe.charges.create({
    amount: cart.totalPrice /(68.25),
    currency: "INR",
    source: req.body.stripeToken ,
    description: " TestCharge"
  }, {
    idempotency_key: "c2OLAbrYQFn9ehlK"
  }, function( err,charge) {
    /*if(err){
      req.flash('error',err.message)
      console.log(err)
      return res.redirect('/checkout')
    }*/
      req.flash('success','Successfully bought products!!')
      req.session.cart=null
      res.redirect('/')})



})

module.exports={route}
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl=req.url
  res.redirect('/user/signin')
}
