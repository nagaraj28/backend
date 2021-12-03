const router = require("express").Router();
const products = require("../models/products.model");


/*
fetches all the products available in the  database
*/
router.route("/").get(async(req,res)=>{
    try{
        console.log("fetching all the products for e-store")
        const data =await products.find({});
        if(data.length>=0)
         res.status(200).json({
            status:"success",
            products:data
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            erroMessage:err,
    });
}
}
);

/*
add  the products into  database
*/
router.route("/").post(async(req,res)=>{
    try{
        
         const data =await products.insertMany(req.body.products)
         res.status(200).json({
            status:"success",
            products:data
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            erroMessage:err,
    });
}
}
);


module.exports = router;