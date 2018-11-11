const sequelize=require('sequelize')
const db=new sequelize('shopdb','shopdb','shopdb',{
  host:'localhost',
  dialect:'mysql',
 pool:{
    min:0,
   max:5
 }
})
const Product=db.define('products',{
  id:{
    type:sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  imgpath:{
    type:sequelize.STRING,
    allowNull:false
  },
  title:{
    type:sequelize.STRING,
    allowNull:false
  },
  price:{
    type:sequelize.FLOAT,
    allowNull:false,
    default:0.0
  },
  description:{
    type:sequelize.STRING,
    allowNull:false
  }
})
db.sync(()=>
{console.log("Database has been synced")})
  .catch(()=>{
    console.log('error creating database')
  })

module.exports={Product}
