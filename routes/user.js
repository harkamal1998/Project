const route=require('express').Router();
const passport=require('../passport');
const User=require('../models/user').User
const  csrf=require('csurf')
const csrfProtection=csrf()
route.use(csrfProtection)

route.get('/profile',isLoggedIn,(req,res)=>{
  res.render('user/profile')
})
route.get('/logout',isLoggedIn,function(req,res,next){
  req.logout()
  res.redirect('/')
})


route.use('/',notLoggedIn,function(req,res,next){
   next();
 })

route.get('/signup',(req,res)=>{
  let messages=req.flash('error')
  res.render('user/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0})
})

route.post('/signup' ,passport.authenticate('local-signup',{

    failureRedirect:'/user/signup',

    failureFlash:true
  }),function(req,res,next){
  if(req.session.oldUrl){
    let oldUrl=req.session.oldUrl
    req.session.oldUrl=null
    res.redirect(oldUrl)

  }
  else{
    res.redirect('/user/profile')
  }
  }
)


route.get('/signin',function(req,res){
  let messages=req.flash('error')
  res.render('user/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0})
})

route.post('/signin',passport.authenticate('local-signin',{

  failureRedirect:'/user/signin',
  failureFlash:true
}),function(req,res,next){
  if(req.session.oldUrl){
    let oldUrl=req.session.oldUrl
    req.session.oldUrl=null
    res.redirect(oldUrl)

  }
  else{
    res.redirect('/user/profile')
  }
})





module.exports={route}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}
function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}
