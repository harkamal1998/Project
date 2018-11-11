const passport=require('passport')
const bCrypt=require('bcrypt-nodejs')
const User=require('./models/user').User
const LocalStrategy=require('passport-local').Strategy
passport.serializeUser( (user,done)=>{
  done(null,user.id)
})
passport.deserializeUser((id,done)=>{
  User.findById(id).then( (user)=>{
    done(null,user)
  }).catch(done)
})
passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
  req.checkBody('email','Invalid email').notEmpty().isEmail()
  req.checkBody('password','Invalid password').notEmpty().isLength({min:4})
  let errors=req.validationErrors()
  if(errors){
    let messages=[]
errors.forEach(function(error){
  messages.push(error.msg)
})
    return done(null,false,req.flash('error',messages))
  }
    var generateHash = function (password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    }
    User.findOne({
      where :
        {email:email}
    }).then(function (user) {
      if (user) {
        return done(null, false, {message: 'Email is already in use.'})
      }
      let userPassword = generateHash(password)
      let data = {
        email: email,
        password: userPassword
      }
      User.create(data).then((newUser) => {
          return done(null, newUser)
        }
      )
    })
  }))

passport.use('local-signin', new LocalStrategy(

  {usernameField: 'email',

    passwordField: 'password',

    passReqToCallback: true
  },


  function(req, email, password, done) {

    req.checkBody('email','Invalid email').notEmpty().isEmail()
    req.checkBody('password','Invalid password').notEmpty()
    let errors=req.validationErrors()
    if(errors){
      let messages=[]
      errors.forEach(function(error){
        messages.push(error.msg)
      })
      return done(null,false,req.flash('error',messages))
    }
    var isValidPassword = function(userpass, password) {

      return bCrypt.compareSync(password, userpass);

    }

    User.findOne({
      where: {
        email: email
      }
    }).then(function(user) {

      if (!user) {

        return done(null, false, {
          message: 'Email does not exist'
        });

      }

      if (!isValidPassword(user.password, password)) {

        return done(null, false, {
          message: 'Incorrect password.'
        });

      }


      var userinfo = user.get();
      return done(null, userinfo);


    }).catch(function(err) {

      console.log("Error:", err);

      return done(null, false, {
        message: 'Something went wrong with your Signin'
      });

    });


  }

));
exports=module.exports=passport


