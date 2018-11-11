const Product=require('../models/product.js').Product


const route=require('express').Router()

route.get('/' ,(req,res) =>{
  Product.findAll()
    .then((products) => {res.status(200).send(products)})
    .catch((err) =>{res.status(500).send({error:"Could not retrieve products"})})

})

route.post('/add' ,(req,res) =>{
  if(isNaN(req.body.price))
  {
    return res.status(403).send({
      error:"Price is not valid number"})

  }
  Product.create({
    imgpath:req.body.imgpath,
    description:req.body.description,
    price:parseFloat(req.body.price),
    title:req.body.title,
  }).then((products)=>{ res.status(201).send(products)})
    .catch((err) =>{res.status(501).send({error:"Error creating products"})})

})
module.exports={route}
