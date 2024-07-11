const express= require('express') ;
const app = express() ;
const path = require('path') ;
const mongoose = require('mongoose') ;
const EjsMate = require('ejs-mate') ;
const methodOverride = require('method-override') ;
const session = require('express-session') ;
const flash = require('connect-flash') ;
const passport = require('passport') ;
const LocalStrategy = require('passport-local')

const User = require('./models/User')

const productRoutes = require('./routes/productRoutes') ;
const reviewRoutes = require('./routes/reviewRoutes') ;
const authRoutes = require('./routes/authRoutes')
const cartRoutes = require('./routes/cartRoutes') ;

const seed = require('./seed') ;
const seedDB = require('./seed') ;


app.engine('ejs', EjsMate) ;
app.set('view engine', 'ejs') ;
app.set('views', path.join(__dirname, 'views')) ;

app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(express.urlencoded({extended: true})) ;
app.use(methodOverride('_method')) ;
app.use(flash())

// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true ,
    cookie : {
        httpOnly: true ,
        expires : Date.now() + 24*60*60*7*1000,
        maxAge : 24*60*60*7*1000
    }
}))

app.use(passport.initialize()) ;
app.use(passport.session()) ;
passport.serializeUser(User.serializeUser()) ;
passport.deserializeUser(User.deserializeUser()) ;

// middleware for every page
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// passport middleware
passport.use(new LocalStrategy(User.authenticate()));

mongoose.connect('mongodb://127.0.0.1:27017/shopping')
.then(()=>{
    console.log('DB connected') ;
})
.catch(()=>{
    console.log('Something went Wrong') ;
})

// seeding Database
// seedDB() ;

app.use(productRoutes) ;
app.use(reviewRoutes) ;
app.use(authRoutes) ;
app.use(cartRoutes) ;
app.get('*', (req, res)=>{
    res.render('error', {err: 'You have hit Wrong Routes'}) ;
})

app.listen(3000, ()=>{
    console.log('port 3000') ;
})