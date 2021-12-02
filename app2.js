const Koa = require('koa');

// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'medicine'
});

//connection.connect();

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            }
            else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                })
            }
        })
    })
}

const app = new Koa();
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    // ctx.body.xxxx = 5;
    await next();
});

router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async (ctx, next) => {

    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});


/*router.get('/mysql',async (ctx,next)=>{
    ctx.response.body = `<h1>mysql</h1>
      <form action="/select" method = "post">
          <p>Id: <input id = "id" value =""></p>
          <p><input type ="submit" value="submit"></p>
          `
})*/

/*router.get('/select/:id ',async(ctx,next)=>{
    var 
       
})*/

//POST请求
router.post('/signin', async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

router.get('/query-user/:id', async (ctx, next) => {
    const id = ctx.params.id;

    const data = await query(`SELECT * FROM USER WHERE ID=${id}`);
    console.log('id', id, ctx.request.body);
    ctx.response.body = data;
})

router.post('/add-user', async (ctx, next) => {
    const id = ctx.request.body.id;
    const Username = ctx.request.body.userName;
    const role = ctx.request.body.role;
     const data = await query(`INSERT INTO USER(id,userName,role) VALUES(7,'小黄',1)`);
    console.log('id','username','role', id,Username,role,ctx.request.body);
    ctx.response.body = `<div>addd=${data}</div>`
})

router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
});

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);
console.log('app started at port 3000...');
