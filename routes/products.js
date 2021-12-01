const router = require("express").Router();
const products = require("../models/products.model");


/*
fetches all the products available in the  database
*/
router.route("/products").get((req,res)=>{
    try{
        const data = products.find({});
        if(data.length>=0)
         res.status(200).json({
            status:"success",
            products:data
        })
    }
    catch{
        res.status(200).json({
            status:"fail",
            erroMessage:"some error occured fetching the products"
    
    }
});