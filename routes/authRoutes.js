const express = require('express') ;
const router = express.Router() ;
const passport = require('passport')
const User = require('../models/User') ;

// signup Page
router.get('/register', (req, res)=>{
    res.render('auth/signup') ;
})

// to store data of user in DB
router.post('/register', async (req, res)=>{
    let {username, email, password, role} = req.body ;
    const user = new User({email, username, role}) ;
    const newUser = await User.register(user, password) ;
    res.redirect('/login') ;
})


// Login Form
router.get('/login', (req, res)=>{
    res.render('auth/login') ;
})

// To login ecommerce
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res)=>{
    // console.log(req.user, 'xyz');
    req.flash('success', 'Welcome Back!!') ;
    res.redirect('/products') ;
})


// To logout
router.get('/logout', (req, res)=>{
    ()=>{
        req.logout() ;
    }

    req.flash('success', 'Logged Out Successfully') ;
    res.redirect('/login') ;
})

module.exports = router ;