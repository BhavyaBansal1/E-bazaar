const express = require('express') ;
const router = express.Router() ;
const Product = require('../models/Product');
const Review = require('../models/Review');
const {validateReview, isLoggedIn} = require('../middleware') ;

router.post('/products/:id/review', isLoggedIn, validateReview, async (req, res)=>{
    try{
        let {id} = req.params ;
        let {rating, comment} = req.body ;

        let foundProduct = await Product.findById(id) ;
        let review = new Review({rating, comment}) ;

        foundProduct.reviews.push(review) ;
        await review.save() ;
        await foundProduct.save() ;

        req.flash('success', 'Review Added Successfully') ;
        res.redirect(`/products/${id}`) ;
    }
    catch(e){
        res.status(500).render('error', {err : e.message}) ;
    }
})


module.exports = router ;