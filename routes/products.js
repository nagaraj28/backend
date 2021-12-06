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
fetch product by id
*/
router.route("/product/:productid").get(async(req,res)=>{
    try{
        const productId = req.params.productid;
        console.log("fetching all the products for e-store")
        const data =await products.findOne({"_id":productId});
        if(data)
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
fetch product by given id's
*/
router.route("/productdetails").post(async(req,res)=>{
    try{
        const productIds = req.body.productids;
        console.log("fetching all the products for e-store")
        const data =await products.find({"_id":{$in:[...productIds]}});
        if(data)
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
fetch  all the brands
*/
router.route("/brands").get(async(req,res)=>{
    try{
        const brands =await products.distinct("brand");
        if(brands)
        res.status(200).json({
            status:"success",
            data:brands
        });
        else
        throw(brands)
    }
    catch(err){
        console.log(err);
        res.status(404).json({
            status:"fail",
            errorMessage:err
        })
    }
})

/* 
fetch  all the categories
*/
router.route("/categories").get(async(req,res)=>{
    try{
        const categories =await products.distinct("category");
        if(categories)
        res.status(200).json({
            status:"success",
            data:categories
        });
        else
        throw(categories)
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            errorMessage:err
        })
    }
})


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