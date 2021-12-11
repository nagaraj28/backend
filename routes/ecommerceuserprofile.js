const router = require('express').Router();
const ecommerceUserProfile = require(".././models/ecommerceuserprofile.model");
const cart = require(".././models/cart.model");
const wishlist = require(".././models/wishlist.model");
const addresses = require(".././models/addresses.model");
const orders = require(".././models/order.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();


/* 
login to the site
*/
router.route('/login').post(async(req,res)=>{
    try{
    //   console.log(email);
      const email = req.body.email;
      const password = req.body.password;
      let userProfile = await ecommerceUserProfile.findOne({
                "email":email
            });
      if(userProfile){
        const isMatch = await bcrypt.compare(password, userProfile.password);
        if(isMatch){
            const token = jwt.sign({
                 userid: userProfile._id ,
                 email:userProfile.email,
                 username:userProfile.username
                }, process.env.JWT_SECRET);
                     res.status(200).json({
                         status:"success",
                         token
                     });
                 }
                 else{
                     res.status(200).json({
                        status:"fail",
                        errorMessage:"incorrect password,please enter valid credentials"
                     });
                 }
            }
            else{
                res.status(200).json({
                    status:"fail",
                    message:"email doesn't exist"
                });
            }
        }
        catch(err){
            console.log("error logging in ecommerce",err);
            res.status(404).json({
                        status:"fail",
                        message:err
                    });
        }
});

/* 
sign up into the site
*/

router.route('/signup').post(async(req,res)=>{
    try{
        const email = req.body.email;
        const passwordBody = req.body.password;
        const username  = req.body.fullname;
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(passwordBody, salt);
        let userProfile = await ecommerceUserProfile.find({
                     "email":email
                 },
            {
             email:1,_id:0   
            }
                 );
        if(userProfile.length<=0){
            const userCreated =new ecommerceUserProfile({
                            username,
                            email,
                            password
                        });
                        userCreated.save().then((user)=>{
                            res.status(200).json({
                                status:"success",
                                message:"registration Successful!"
                             })
                        }).catch(err=>{
                            res.status(200).json({
                                status:"fail",
                                message:"some error occured during registering,please try again!"
                            });
                        });
        }
        else{
            res.status(200).json({
                status:"fail",
                message:"email already exists!"
            });
        }
    }
    catch(err){
        console.log("error signing up user in ecommerce",err);
        res.status(404).json({
                    status:"fail",
                    message:"error logging-in"
                });
    }
});
    


/*
get cart items
*/

    router.route("/getcart/:userid").get(async(req,res)=>{
      try{
          const userId = req.params.userid;
        //   console.log(userId);
          const cartData  = await cart.find({userid:userId},{cartproducts:1,_id:0});
          if(cartData){
              res.status(200).json({
                  status:"success",
                  data:cartData
              });
          }
          else
          throw(cartData);
      }  
      catch(err){
        // console.log(err);
        res.status(400).json({
            status:"fail",
            data:err
        });
      }
    })
    

    /*
add cart items
*/

router.route("/addcart").post(async(req,res)=>{
    try{
        const userId = req.body.userid;
        const quantity = req.body.quantity; 
        // console.log(userId,quantity,req.body.productid);
        const productId =req.body.productid;
        // console.log(productId);
            const cartAdded= await cart.findOneAndUpdate({
            userid:userId
        },{$addToSet:{
            cartproducts:{
                productid:productId,
                quantity:quantity
            }
        } 
    },
        {upsert:true}
        );
        res.status(200).json({
            status:"success",
            data:cartAdded
        });
        }
    catch(err){
        // console.log(err);
        res.status(400).json({
            status:"fail",
            errorMessage:err
        });
        // console.log(err);
    }
});

/*
delete cart items
*/
router.route("/deletefromcart").delete(async(req,res)=>{
    
try{
    console.log(req.body);
    const userId =req.body.userid;
    const productId =req.body.productid;
    const removingFromCart =await cart.findOneAndUpdate({userid:userId},
        {
            $pull:{
                cartproducts:{
                    productid:productId
                }
            }
        }
        )
        res.status(200).json({
            status:"success",
            data:removingFromCart
        })
}
catch(err){
    // console.log(err);
    res.status(400).json({
        status:"fail",
        errorMessage:err
    })
}    
})

/*
modify cart items
*/

router.route("/updatecart").put(async(req,res)=>{
    try{
        const userId = req.body.userid;
        const productId = req.body.productid;
        const quantity = req.body.quantity;
        const updatedCart = await cart.findOneAndUpdate({userid:userId,"cartproducts.productid":productId},
            {"cartproducts.$.quantity":quantity}
            );
        if(updatedCart){
            res.status(200).json({
                status:"success",
                data:updatedCart
            })
        }
        else
        throw(updatedCart);
    }
    catch(err){
        console.log(err);
        res.status(400).json({
        status:"fail",
        errorMessage:err
    })
    }
});

/*
delete total cart items
*/

router.route("/deleteallcart/:userid").delete(async(req,res)=>{
    try{
        const userId = req.params.userid;
        const deleteAllCartProducts = await cart.findOneAndDelete({userid:userId});
        if(deleteAllCartProducts)
        res.status(200).json({
            status:"success",
            data:deleteAllCartProducts
        });
        else
        throw(deleteAllCartProducts);
    }catch(err){
        res.status(400).json({
            status:"fail",
            errorMessage:err
        })
    }
});

/* 
add items to wishlist
*/

router.route("/addwishlist").post(async(req,res)=>{
    try{
        const userId = req.body.userid;
        // console.log(userId,quantity,req.body.productid);
        const productId =req.body.productid;
        // console.log(productId);
            const wishlistAdded= await wishlist.findOneAndUpdate({
            userid:userId
        },{$addToSet:{
            wishlistproducts:{
                productid:productId
                        }
        } 
    },
        {upsert:true}
        );
        res.status(200).json({
            status:"success",
            data:wishlistAdded
        });
        }
    catch(err){
        // console.log(err);
        res.status(400).json({
            status:"fail",
            errorMessage:err
        });
        // console.log(err);
    }
});


/* 
get wishlist items

*/

router.route("/getwishlist/:userid").get(async(req,res)=>{
    try{
        const userId = req.params.userid;
      //   console.log(userId);
        const wishlistData  = await wishlist.find({userid:userId},{wishlistproducts:1,_id:0});
        // console.log(wishlistData);
        if(wishlistData){
            res.status(200).json({
                status:"success",
                data:wishlistData
            });
        }
        else
        throw(wishlistData);
    }  
    catch(err){
       console.log(err);
      res.status(400).json({
          status:"fail",
          errorMessage:err
      });
    }
  })
  
/* 
remove items from wishlist
*/
router.route("/deletefromwishlist").delete(async(req,res)=>{
    
    try{
        const userId =req.body.userid;
        const productId =req.body.productid;
        const removingFromWishlist =await wishlist.findOneAndUpdate({userid:userId},
            {
                $pull:{
                    wishlistproducts:{
                        productid:productId
                    }
                }
            }
            )
            res.status(200).json({
                status:"success",
                data:removingFromWishlist
            })
    }
    catch(err){
        // console.log(err);
        res.status(400).json({
            status:"fail",
            errorMessage:err
        })
    }    
    })

    /*
delete total wishlist items
*/

router.route("/deleteallwishlist/:userid").delete(async(req,res)=>{
    try{
        const userId = req.params.userid;
        const deleteAllWishlistProducts = await wishlist.findOneAndDelete({userid:userId});
        if(deleteAllWishlistProducts)
        res.status(200).json({
            status:"success",
            data:deleteAllWishlistProducts
        });
        else
        throw(deleteAllWishlistProducts);
    }catch(err){
        res.status(400).json({
            status:"fail",
            errorMessage:err
        })
    }
});


/*
add address
*/


/*
edit address
*/

/*
delete address
*/

/*
get address list
*/

router.route("/getaddresses/:userid").get(async(req,res)=>{
    try{
        const userId = req.params.userid;
      //   console.log(userId);
        const addressData  = await addresses.find({userid:userId},{addresslist:1,_id:0});
        if(addressData){
            res.status(200).json({
                status:"success",
                data:addressData
            });
        }
        else
        throw(addressData);
    }  
    catch(err){
      // console.log(err);
      res.status(400).json({
          status:"fail",
          data:err
      });
    }
  })
  

  /*
add address for a user
*/

router.route("/addaddress").post(async(req,res)=>{
  try{
      const userId = req.body.userid;
      // console.log(userId,quantity,req.body.productid);
      const street = req.body.street;
      const city = req.body.city;
      const state = req.body.state;
      const zipcode = req.body.zipcode;
      const phoneno = req.body.phoneno;
      const name = req.body.name;


      // console.log(productId);
          const addressAdded = await addresses.findOneAndUpdate({
          userid:userId
      },{$addToSet:{
          addresslist:{
             street,
             city,
             state,
             phoneno,
             zipcode,
             name
          }
      } 
  },
      {upsert:true}
      );
      res.status(200).json({
          status:"success",
          data:addressAdded
      });
      }
  catch(err){
      // console.log(err);
      res.status(400).json({
          status:"fail",
          errorMessage:err
      });
      // console.log(err);
  }
});

/*
delete address 
 */
router.route("/deleteaddress").delete(async(req,res)=>{
  
try{
  const userId = req.body.userid;
  const addressId = req.body._id;
  const removingFromAddresses =await addresses.findOneAndUpdate({userid:userId},
      {
          $pull:{
              addresslist:{
                "_id":addressId
              }
          }
      }
      );
      res.status(200).json({
          status:"success",
          data:removingFromAddresses
      });
}
catch(err){
  // console.log(err);
  res.status(400).json({
      status:"fail",
      errorMessage:err
  })
}    
})

/*
edit address from address-list
*/

router.route("/editaddress").put(async(req,res)=>{
  try{
    const userId = req.body.userid;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const zipcode = req.body.zipcode;
    const phoneno = req.body.phoneno;
    const name = req.body.name;
    const _id = req.body._id;
    console.log(userId,street,city,state,zipcode,phoneno,name,_id);
    const updatedAddress = await addresses.findOneAndUpdate({userid:userId,"addresslist._id":_id},
    {"addresslist.$.street":street,
    "addresslist.$.city":city,
    "addresslist.$.state":state,
    "addresslist.$.zipcode":zipcode,
    "addresslist.$.phoneno":phoneno,
    "addresslist.$.name":name,
    }
    );
   
      if(updatedAddress){
          res.status(200).json({
              status:"success",
              data:updatedAddress
          })
      }
      else
      throw(updatedAddress);
  }
  catch(err){
      console.log(err);
      res.status(400).json({
      status:"fail",
      errorMessage:err
  })
  }
})

    /*
delete total addresses items
*/

router.route("/deletealladdresses/:userid").delete(async(req,res)=>{
    try{
        const userId = req.params.userid;
        const deleteAllAddressesProducts = await addresses.findOneAndDelete({userid:userId});
        if(deleteAllAddressesProducts)
        res.status(200).json({
            status:"success",
            data:deleteAllAddressesProducts
        });
        else
        throw(deleteAllAddressesProducts);
    }catch(err){
        res.status(400).json({
            status:"fail",
            errorMessage:err
        })
    }
});

/*
get all the orders for user
*/

router.route('/getorders/:userid').get(async(req,res)=>{

   try{
        const orderedData =await orders.findOne({userid:req.params.userid});
        res.status(200).json({
            status:"success",
            data:orderedData
        });
    }catch(err){
        console.log('error fetching data',err);
        res.status(400).json({
            status:"fail",
            errorMessage:err
        });
    }
});

/* 
insert into orders
*/

router.route("/placeorder").post(async(req,res)=>{
    try{
        const userId = req.body.userid;
        const orderAdded= await orders.findOneAndUpdate({
            userid:userId
        },{$push:{
            orderedProducts:{
              order:req.body.products,
              addressDelivered:req.body.address
                        }
        } 
    },
        {upsert:true}
        );
        res.status(200).json({
            status:"success",
            data:orderAdded
        });
    }catch(err){
            console.log("error in inserting ordered data",err);
            res.status(400).json({
                status:"fail",
                data:err
            });
    }
});
module.exports = router;