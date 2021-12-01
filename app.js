const Koa = require('koa');
const Router = require('koa-router');
//npdeconst mysql = require('mysql')

const app = new Koa();
const router = new Router();
var mysql      = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '123456789',
  database : 'medicine'
});
 
//connection.connect();
 
let query = function(sql,addSqlParams,values){
    return new Promise((resolve,reject) =>{
        pool.getConnection(function(err,connection){
            if(err){
                reject(err)
            }
            else{
                connection.query(sql,values,(err,rows)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(rows)
                    }
                    connection.release();
                })
            }
        })
    })
}
//查


async function getData(){
    let sql = 'SELECT * FROM USER'
   // let data = await query(sql)
    app.use(async (ctx) => {
        let data = await query(sql);
        ctx.body = {
          
            "data": data,
            
        }
        
    })
  
}

async function insertData(){
    let sql = 'INSERT INTO USER(id,userName,role) VALUES(4,"小黄",1)';
   // var addSqlParams = ['4','小黄','1'];
    let data = await query(sql)
    
}



insertData();
getData(); 

app.use(router.routes()) 
   .use(router.allowedMethods());



app.listen(8000)
console.log('koa2 is starting at port 8000');
