var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

var Product = require('./model/product');
var WishList = require('./model/wishList');
var Cart = require('./model/cart');
var SaleItem = require('./model/saleItem');

//middleware that is specific to this Router
router.use(function timeLog(req, res, next){
  console.log("Time: ", Date.now());
  next();
});

//define the home page route
router.get('/', function(req, res){
  res.send("Birds home page");
});

//define the about routes
router.get('/about', function(req, res){
  res.send("About Birds");
});


/****************PRODUCT*****************/
router.post('/product', function(request, response){
  var product = new Product(request.body);
  product.save(function(err, savedProduct){
    if(err){
      response.status(500).send({error: "Could not save product"});
    }else{
      response.status(200).send(savedProduct);
    }
  })
});

router.get('/product', function(request, response){
   Product.find({},function(err, products){
     //因为多线程，所以必须这么写
     if(err){
       response.status(500).send({error: "Could not fetch products"});
     }else{
       response.send(products);
     }
   })
 });

 /****************WISHLISTS*****************/
router.get('/wishlist', function(request, response){
  WishList.find({}).populate({path: 'products', model:'Product'}).exec(function(err, wishLists){
    if(err) {
      response.status(500).send({error:"Could not fetch wishlists"});
    }else{
      response.status(200).send(wishLists);
    }
  })
});


router.post('/wishlist',function(request, response){
  var wishList = new WishList();
   wishList.title = request.body.title;

   wishList.save(function(err, newWishList){
     if(err){
       response.status(500).send({error:"Could not create wishList!"});
     }else{
       response.send(newWishList);
     }
     });
});

router.put('/wishlist/product/add', function(request, response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if (err) {
      response.status(500).send({error:"Could not add item to wishlist"});
    } else {
        WishList.update({_id:request.body.wishListId}, {$addToSet:{products: product._id}}, function(err, wishList){
          if (err) {
            response.status(500).send({error:"Could not add item to wishlist"});
          } else{
            response.send("Successfully added to wishlist");
          }
      });
    }
  });
});

/****************CART*****************/
router.get('/cart', function(request, response){
  Cart.find({}).populate({path: 'products', model:'Product'}).exec(function(err, cart){
    if(err) {
      response.status(500).send({error:"Could not fetch wishlists"});
    }else{
      response.status(200).send(cart);
    }
  })
});

router.post('/cart',function(request, response){
  var cart = new Cart();

   cart.save(function(err, newCart){
     if(err){
       response.status(500).send({error:"Could not create Cart!"});
     }else{
       response.send(newCart);
     }
     });
});

router.put('/cart/product/add', function(request, response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if (err) {
      response.status(500).send({error:"Could not add item to cart"});
    } else {
        Cart.update({_id:request.body.cartId}, {$addToSet:{products: product._id}}, function(err, cart){
          if (err) {
            response.status(500).send({error:"Could not add item to cart"});
          } else{
            response.send("Successfully added to cart");
          }
      });
    }
  });
});
router.delete('/cart/product/remove', function(request,response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if (err) {
      response.status(500).send({error:"Could not remove item from cart!"});
    } else {
        Cart.update({_id:request.body.cartId}, {$pull:{products: product._id}}, function(err, cart){
          if (err) {
            response.status(500).send({error:"Could not remove item from cart!"});
          } else{
            response.send("Successfully remove item from cart!");
          }
      });
    }
  });
})

/************************SALEITEM**************************/
router.get('/sale-item', function(request, response){
  SaleItem.find({}).populate({path: 'products', model:'Product'}).populate({path:'relatedItem', model:'Product'}).exec(function(err, saleItem){
    if(err) {
      response.status(500).send({error:"Could not fetch Sale Items!"});
    }else{
      response.status(200).send(saleItem);
    }
  })
});

router.post('/sale-item',function(request, response){
  var saleItem = new SaleItem();

   saleItem.save(function(err, newSaleItem){
     if(err){
       response.status(500).send({error:"Could not create SaleItem!"});
     }else{
       response.send(newSaleItem);
     }
     });
});

router.put('/sale-item/product/add', function(request, response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if (err) {
      response.status(500).send({error:"Could not add item to saleItem!"});
    } else {
        SaleItem.update({_id:request.body.saleItemId}, {$addToSet:{products: product._id}}, function(err, saleItem){
          if (err) {
            response.status(500).send({error:"Could not add item to saleItem"});
          } else{
            response.send("Successfully added to saleItem");
          }
      });
    }
  });
});
router.delete('/sale-item/product/remove', function(request,response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if (err) {
      response.status(500).send({error:"Could not remove item from saleItem!"});
    } else {
        SaleItem.update({_id:request.body.saleItemId}, {$pull:{products: product._id}}, function(err, saleItem){
          if (err) {
            response.status(500).send({error:"Could not remove item from saleItem!"});
          } else{
            response.send("Successfully remove item from saleItem!");
          }
      });
    }
  });
})

router.put('/sale-item/related-item/add', function(request, response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if (err) {
      response.status(500).send({error:"Could not add item to relatedItem!"});
    } else {
        SaleItem.update({_id:request.body.saleItemId}, {$addToSet:{relatedItem: product._id}}, function(err, saleItem){
          if (err) {
            response.status(500).send({error:"Could not add item to saleItem"});
          } else{
            response.send("Successfully added to saleItem");
          }
      });
    }
  });
});
router.delete('/sale-item/related-item/remove', function(request,response){
  Product.findOne({_id:request.body.productId}, function(err, product){
    if (err) {
      response.status(500).send({error:"Could not remove item from relatedItem!"});
    } else {
        SaleItem.update({_id:request.body.saleItemId}, {$pull:{relatedItem: product._id}}, function(err, saleItem){
          if (err) {
            response.status(500).send({error:"Could not remove item from relatedItem!"});
          } else{
            response.send("Successfully remove item from relatedItem!");
          }
      });
    }
  });
})




module.exports = router;
