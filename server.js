const express=require('express')
const server=express()
const path=require('path')

const expressHbs=require('express-handlebars')
const session=require('express-session')
const passport=require('./passport')
const flash=require('connect-flash')
const validator=require('express-validator')

const  SequelizeStore=require('connect-session-sequelize')(session.Store)
const Sequelize=require('sequelize')

const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended:true}))
const SERVER_PORT=process.env.PORT || 7098
server.use(validator())
server.use(cookieParser())
// view engine setup
server.engine('.hbs',expressHbs({defaultLayout:'layout', extname:'.hbs'}))
server.set('view engine','.hbs')
//require('./config/passport')

const sequelize=new Sequelize('shopdb','shopdb','shopdb',{
  host:'localhost',
  dialect:'mysql',
})
/*const myStore=new SequelizeStore({
  db:sequelize,
  checkExpirationInterval: 15 * 60 * 1000

})*/
server.use(session({
  secret:'supersecret' ,
  resave:false ,
  saveUninitialised:false,
  store: new SequelizeStore({
    db: sequelize
  }),
proxy:true,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000
}))
// myStore.sync()
server.use(flash())
server.use(passport.initialize())
server.use(passport.session())
server.use('/public',express.static(path.join(__dirname,'public')))


server.use(function(req,res,next){
  res.locals.login=req.isAuthenticated()
  res.locals.session=req.session
  next()
})
server.use('/user',require('./routes/user.js').route)

server.use('/',require('./routes/index.js').route)



server.listen(SERVER_PORT,()=> {
  console.log('Server started at http://localhost:7098')
})
