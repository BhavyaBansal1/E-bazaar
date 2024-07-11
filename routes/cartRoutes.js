const express = require('express') ;
const router = express.Router() ;
const {isLoggedIn} = require('../middleware') ;
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/user/cart', isLoggedIn, async (req, res)=>{
    let user = await User.findById(req.user._id).populate('cart') ;
    res.render('cart/cart', {user}) ;
})
router.delete('/cart/delete/:itemId', async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user is logged in and user ID is available in req.user
        const itemId = req.params.itemId;

        // Find the user and update the cart
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.cart = user.cart.filter(item => item._id.toString() !== itemId);
        await user.save();

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/user/:productId/add', isLoggedIn, async (req, res)=>{
    let {productId} = req.params ;
    let userId = req.user._id ;
    
    let product = await Product.findById(productId) ;
    let user = await User.findById(userId) ;
    user.cart.push(product) ;
    user.save() ;
    res.redirect('/user/cart') ;
})

module.exports= router ;