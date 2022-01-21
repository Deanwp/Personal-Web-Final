const express = require('express')
const app = express()
const port = 4000
const db = require('./connection/db')
const session = require('express-session')
const flash = require('express-flash')
const bcrypt = require('bcrypt')
const { request, response } = require('express')
const uploads = require('./middlewares/fileUpload')

app.set('view engine', 'hbs');
app.use('/public',express.static(__dirname +'/public'))
app.use('/uploads',express.static(__dirname +'/uploads'))
app.use(express.urlencoded({extended: false}))
app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000, // 2 jam
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    }))
app.use(flash())

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function getFullTime(time) {
    let date = time.getDate()
    let months = time.getMonth()
    let year = time.getFullYear()
    let hours = time.getHours()
    let minutes = time.getMinutes()

    let fullTime = `${date} ${month[months]} ${year} ${hours}:${minutes} WIB`

    return fullTime
}

function getDistanceTIme(time) {
    let timePost = time
    let timeNow = new Date()
    let distance = timeNow - timePost

    let milisecond = 1000
    let second = 60
    let minutes = 60
    let hour = 23
    
    let distanceDay = Math.floor(distance / (milisecond * second * minutes * hour))
    let distanceHour = Math.floor(distance / (milisecond * second * minutes))
    let distanceMinute = Math.floor(distance / (milisecond * second))
    let distanceSecond = Math.floor(distance / milisecond)
    
    if (distanceDay >= 1) {
        return`${distanceDay} day ago`;
    }   else if (distanceHour >= 1) {
            return`${distanceHour} hour ago`;
        } else if (distanceMinute >= 1) {
                return`${distanceMinute} minute ago`
            } else {
                return `${distanceSecond} second ago`
            }
}

app.get('/', function(req,res) {
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(`SELECT * FROM tb_project`, function(err,result) {
            if (err) throw err
            let data = result.rows
            res.render("index", {project : data, isLogin: req.session.isLogin, user:req.session.user})
        })
    })
    
})

app.get('/ContactForm', function(req,res) {
    res.render("ContactForm", {isLogin: req.session.isLogin, user:req.session.user})
})

app.get('/blog', function(req,res) {

    db.connect(function(err,client,done) {
        if (err) throw err
        let query = 'SELECT tb_blog.id, tb_blog.title, tb_blog.content, tb_blog.images, tb_blog.post_at, tb_user.name AS author, tb_blog.author_id FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id'
        client.query(query,function(err,result) {
            if (err) throw err
            
            let dataBlogs = result.rows.map(function (data) {
                return {
                    ...data,
                    isLogin: req.session.isLogin,
                    postAt: getFullTime(data.post_at),
                    distanceTime: getDistanceTIme(data.post_at),
                }
            })
        res.render("blog", {blogs: dataBlogs, isLogin: req.session.isLogin, user:req.session.user,})
        })
    })
})

app.post('/blog',uploads.single('inputImages'), function (req,res) {
    
    let data = req.body
    let image= req.file.filename
    let authorId = req.session.user.id
    let query = `INSERT INTO tb_blog(title, content, images, author_id) VALUES('${data.inputTitle}','${data.inputContent}','${image}','${authorId}')`
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function(err,result) {
            if (err) throw err
        req.flash('success', 'Posted!')
        res.redirect('/blog') 
        })
    })
})

app.get('/delete-blog/:id', function (req,res) {
    let id = req.params.id
    let query = `DELETE FROM tb_blog WHERE id = ${id}`
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function(err,result) {
            if (err) throw err
            req.flash('success', 'Deleted!')
            res.redirect('/blog')
        })
    })
})

app.get('/edit-post/:id', function(req,res) {
    if(!req.session.isLogin){
        req.flash('danger', "Please Login!")
        return res.redirect('/login')
    }
    let id = req.params.id
    let query = `SELECT * FROM tb_blog where id = ${id}`
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function(err,result) {
            if (err) throw err
            let data=result.rows[0]
            res.render('edit-post',{blog:data})
        })
    })
})

app.post('/edit-post/:id',uploads.single('updateImages'), function (req,res) {
    let id = req.params.id
    let data = req.body
    let image= req.file.filename
    let query=`UPDATE tb_blog SET title='${data.updateTitle}', images='${image}', content='${data.updateContent}' WHERE id = ${id};`
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function(err,result) {
            if (err) throw err
        req.flash('success', 'Edited!')
        res.redirect('/blog')
        })
    })
}) 

app.get('/add-blog', function(req,res) {
    if(!req.session.isLogin){
        req.flash('danger', "Please Login!")
        return res.redirect('/login')
    }
    res.render("add-blog", {isLogin: req.session.isLogin, user:req.session.user,})
})

app.get('/register', function(req,res) {
    res.render("register")
})

app.post('/register', function(req,res) {
    const{addEmail,addName,addPassword} = req.body
    const hashedPassword = bcrypt.hashSync(addPassword, 10)
    let query = `INSERT INTO tb_user(name, email, password) VALUES('${addName}','${addEmail}','${hashedPassword}')`
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function(err,result) {
            if (err) throw err
        req.flash('success', 'User Created Successfully!') 
        res.redirect('/login')
        })
    })
})

app.get('/login', function(req,res) {
    res.render("login")
})

app.post('/login', function(req,res) {
    const{addEmail,addPassword} = req.body
    let query = `SELECT * FROM tb_user WHERE email ='${addEmail}'`
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function(err,result) {
            if (err) throw err
            if (result.rows.length == 0) {
                req.flash('danger', "email or password is incorrect!")
                return res.redirect('/login')
            }
            const isMatch = bcrypt.compareSync(addPassword,result.rows[0].password)
            if (isMatch) {
                req.session.isLogin = true
                req.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email
                }
                req.flash('success', 'You are successfully logged in!')
                res.redirect('/blog')   
            } else{
                req.flash('danger', 'password is incorrect!')
                res.redirect('/login')
            }
        })
    })
})

app.get('/logout', function(req, res){
    req.session.destroy()

    res.redirect('/blog')
})

app.get('/blog-detail/:id', (req,res) => {
    let id = req.params.id
    let query = `SELECT tb_blog.id, tb_blog.title, tb_blog.content, tb_blog.images, tb_blog.post_at, tb_user.name AS author, tb_blog.author_id FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id WHERE tb_blog.id = ${id}`
    db.connect(function (err, client, done) {
        if (err) throw err
        client.query(query, function(err,result) {
            if (err) throw err
            let dataBlog = result.rows.map(function (data) {
                return {
                    ...data,
                    isLogin: req.session.isLogin,
                    postAt: getFullTime(data.post_at),
                    distanceTime: getDistanceTIme(data.post_at),
                }
            })
            res.render('blog-detail', {id:id, blogs:dataBlog[0], isLogin: req.session.isLogin, user:req.session.user})
        })
    })
})

app.listen(port, function() {
    console.log(`server starting on port ${port}`);
})      