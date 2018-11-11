const sequelize=require('sequelize')
const db=new sequelize('shopdb','shopdb','shopdb', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    mi: 0,
    max: 5
  }
})

const User=db.define('users',{
  id:{
    type:sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  email:{
    type:sequelize.STRING,
     allowNull:false},
  password:{
    type:sequelize.STRING,
    allowNull:false
  }
})
const Order=db.define('orders',{
  address:{
    type:sequelize.STRING,
    allowNull:false
  },
  name:{
    type:sequelize.STRING,
    allowNull:false},

})
Order.belongsTo(User)


db.sync(()=>
{console.log("Database has been synced")})
  .catch((error)=>{
    console.log(error)
    console.log('error creating database')
  })

module.exports={Order}
module.exports={User}
