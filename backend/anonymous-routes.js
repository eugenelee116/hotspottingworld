var express = require('express'),
    quoter = require('./quoter'),
    db = require('./db-connect');

var app = module.exports = express.Router();
/**
 * @api {get} /outfits/:outfitId Get specific outfit
 * @apiName GetOutfitById
 * @apiGroup Public
 *
 * @apiSuccess {json} results JSON object containing  list of outfits.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": [{
 *			"id_outfit": 71,
 *			"celebrity_id": 19,
 *			"image_url": "http://hotspotting.com/uploads/Oliviaphotoshoot.jpg",
 *			"description": "Holts Muse photo shoot",
 *			"date": "2015-10-30T01:47:10.000Z",
 *			"id_celebrity": 19,
 *			"celebrity": "Olivia Palermo",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Screen%20Shot%202014-10-25%20at%201.38.55%20PM.jpg",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/olivia-palermo-banner.jpg",
 *			"favourites": 2,
 *			"following": 2,
 *			"tags": [{
 *				"id_tag": 8,
 *				"outfit_id": 71,
 *				"garment_id": 5,
 *				"look_url": "http://www.saksfifthavenue.com/main/ProductDetail.jsp?PRODUCT%3C%3Eprd_id=845524446848539&site_refer=SHOP002&prod_id=0400087499775&CA_6C15C=500002830010084907",
 *				"less_url": "http://www.shoptiques.com/products/ella-moss-sunburst-pleated-top/122878",
 *				"position_x": "0.415",
 *				"position_y": "0.323",
 *				"garment": "Tops"
 *			}]
 *		}]
 *     }
 */
app.get('/outfit/:outfitId', function (req, res) {
    var outfitId = req.params.outfitId;
    var serverurl = 'http://' + req.headers.host;
    var query = "SELECT * FROM alloutfits WHERE id_outfit = ?";
    db.pool.query(query, outfitId, function (err, outfits) {
        if (err) {
            res.send({"error": err});
        } else {
            addTagsAndRespond(serverurl, outfits, res);
        }
    });
});

/**
 * @api {get} /outfits Get outfits
 * @apiName GetOutfits
 * @apiGroup Public
 *
 * @apiParam {Number} lastDate Last retrieved outfit.
 * @apiParam {Number} limit Max number of results.
 *
 * @apiSuccess {json} results JSON object containing  list of outfits and relevant products information.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": [{
 *          "id_outfit":123,
 *          "celebrity_id":34,
 *          "image_url":"http://52.77.208.178/uploads/jessica_simpson_1.jpg",
 *          "description":"Dressed in black",
 *          "date":"2015-12-19T07:01:30.000Z",
 *          "id_celebrity":34,
 *          "celebrity":"Jessica Simpson",
 *          "thumbnail_url":"http://52.77.208.178/uploads/jessica_simpson_ava.jpg",
 *          "picture_url":"pictures/celebrities/JessicaSimpson.jpg",
 *          "favourites":23,
 *          "following":10,
 *          "likes":23,
 *          "tags":[{
 *              "id_tag":353,
 *              "outfit_id":123,
 *              "garment_id":2,
 *              "look_url":"http://www.barneys.com/Fendi-Peekaboo-Large-Satchel-504220532.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-6MQkBhcyUqnwljuhNlVsFg",
 *              "less_url":"",
 *              "position_x":"0.307",
 *              "position_y":"0.549",
 *              "id_garment":2,
 *              "category_id":2,
 *              "gender":"woman",
 *              "garment":"Bags",
 *              "image_url":"http://52.77.208.178/pictures/app/woman/BAGS.jpg",
 *              "icon":"http://52.77.208.178/pictures/app/tags/BAGS.png",
 *              "id_product":1,
 *              "price":7250,
 *              "brand":"Fendi",
 *              "svg_icon":"http://52.77.208.178/pictures/app/tags/BAGS.svg"
 *              }]
 *          }]
 *     }
 */
app.get('/outfits', function (req, res, next) {
    var lastDate = req.query.lastDate;
    var limit = req.query.limit;
    var query;
    var outfits = [];
    var serverurl = 'http://' + req.headers.host;
    if (!lastDate && !limit) {
        query = "SELECT a.*,"
        + "(SELECT COUNT(*) FROM favourites f WHERE a.id_outfit=f.outfit_id) AS likes "
        + "FROM alloutfits a";
    } else if (!lastDate) {
        query = "SELECT * FROM alloutfits LIMIT " + limit;
    } else {
        query = "SELECT * FROM alloutfits WHERE date < '" + lastDate + "' LIMIT " + limit;
    }
    ;

    db.pool.query(query, function (err, outfits, fields) {
        if (err) {
            console.log(query + " : " + err);
            res.send({"error": err});
        } else {
            if (outfits == "") {
                res.send({"results": ""});
            } else {
                addTagsAndRespond(serverurl, outfits, res);
            }
        }
    });
});

/**
 * @api {get} /outfits/refresh Get new outfits
 * @apiName GetNewOutfits
 * @apiGroup Public
 *
 * @apiParam {Number} firstId First retrieved outfit.
 *
 * @apiSuccess {json} results JSON object containing  list of outfits.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": [{
 *			"id_outfit": 71,
 *			"celebrity_id": 19,
 *			"image_url": "http://hotspotting.com/uploads/Oliviaphotoshoot.jpg",
 *			"description": "Holts Muse photo shoot",
 *			"date": "2015-10-30T01:47:10.000Z",
 *			"id_celebrity": 19,
 *			"celebrity": "Olivia Palermo",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Screen%20Shot%202014-10-25%20at%201.38.55%20PM.jpg",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/olivia-palermo-banner.jpg",
 *			"favourites": 2,
 *			"following": 2,
 *			"tags": [{
 *				"id_tag": 8,
 *				"outfit_id": 71,
 *				"garment_id": 5,
 *				"look_url": "http://www.saksfifthavenue.com/main/ProductDetail.jsp?PRODUCT%3C%3Eprd_id=845524446848539&site_refer=SHOP002&prod_id=0400087499775&CA_6C15C=500002830010084907",
 *				"less_url": "http://www.shoptiques.com/products/ella-moss-sunburst-pleated-top/122878",
 *				"position_x": "0.415",
 *				"position_y": "0.323",
 *				"garment": "Tops",
 *			    "image_url":"http://52.77.208.178/pictures/app/woman/BAGS.jpg",
 *              "icon":"http://52.77.208.178/pictures/app/tags/BAGS.png",
 *              "price":7250,"brand":"Fendi",
 *              "svg_icon":"http://52.77.208.178/pictures/app/tags/BAGS.svg"
 *			}]
 *		}]
 *     }
 */
app.get('/outfits/refresh', function (req, res) {
    var firstId = req.query.firstId;
    var serverurl = 'http://' + req.headers.host;
    if (firstId) {
        db.pool.query("SELECT * FROM alloutfits WHERE id_outfit > ?", firstId, function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {
                if (outfits.length > 0) {
                    addTagsAndRespond(serverurl, outfits, res);
                } else {
                    res.send({results: ""});
                }
            }
        });
    } else {
        res.send({"results": ""});
    }

});

/**
 * @api {get} /outfits/:name Get celebrity outfits
 * @apiName GetCelebrityOutfits
 * @apiGroup Public
 *
 * @apiParam {String} name Celebrity name.
 * @apiParam {Number} lastDate Last retrieved outfit.
 * @apiParam {Number} limit Max number of results.
 *
 * @apiSuccess {json} results JSON object containing list of celebrity outfits.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": [{
 *          "id_outfit":41,
 *          "celebrity_id":9,
 *          "image_url":"http://52.77.208.178/uploads/FergiePinkDress.jpg",
 *          "description":"Avon fragrance launch in New York",
 *          "date":"2015-10-30T00:10:32.000Z",
 *          "thumbnail_url":"https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/580876_10151221535253676_851063930_n.jpg?itok=W27Mt0h7",
 *          "favourites":7,
 *          "tags":[{
 *              "id_tag":10,
 *              "outfit_id":41,
 *              "garment_id":1,
 *              "look_url":"http://www.neimanmarcus.com/en-pt/Victoria-Beckham-One-Shoulder-Asymmetric-Seamed-Sheath-Dress-victoria-beckham-one-shoulder/prod180830051___/p.prod?&ecid=NMALRJ84DHJLQkR4&CS_003=5630585",
 *              "less_url":"http://www.lastcall.com/Cut25-by-Yigal-Azrouel-Gathered-One-Shoulder-Dress/prod34080118/p.prod?ecid=LCALRFeed&ncx=n&uEm=%%affiliates%%&ci_src=14110925&ci_sku=sku32580127",
 *              "position_x":"0.434",
 *              "position_y":"0.545",
 *              "id_garment":1,
 *              "category_id":1,
 *              "gender":"woman",
 *              "garment":"Dresses",
 *              "image_url":"http://52.77.208.178/pictures/app/woman/DRESSES.jpg",
 *              "icon":"http://52.77.208.178/pictures/app/tags/DRESSES.png",
 *              "id_product":43,
 *              "price":946,
 *              "brand":"Victoria Beckham ",
 *              "svg_icon":"http://52.77.208.178/pictures/app/tags/DRESSES.svg"
 *              }]
 *		}]
 *     }
 */
app.get('/outfits/:name', function (req, res) {
    var name = req.params.name;
    var lastDate = req.query.lastDate;
    var limit = req.query.limit;
    var serverurl = 'http://' + req.headers.host;
    if (lastDate && limit) {
        var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites FROM outfits o "
            + "LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
            + "WHERE c.celebrity = ? AND date < '?' GROUP BY id_outfit ORDER BY o.date DESC LIMIT " + limit;

        db.pool.query(query, [name, lastDate], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {

                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    } else if (limit) {
        var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites FROM outfits o "
            + "LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
            + "WHERE c.celebrity = ? GROUP BY id_outfit ORDER BY o.date DESC LIMIT " + limit;
        db.pool.query(query, [name], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {

                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    } else if (lastDate) {
        var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites FROM outfits o "
            + "LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
            + "WHERE c.celebrity = ? AND date < '?' GROUP BY id_outfit ORDER BY o.date DESC";

        db.pool.query(query, [name, lastDate], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {

                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    } else {
        var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites FROM outfits o "
            + "LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
            + "WHERE c.celebrity = ? GROUP BY id_outfit ORDER BY o.date DESC";

        db.pool.query(query, [name], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {

                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    }
    ;
});

/**
 * @api {get} /products/:tagId Get products
 * @apiName GetProductsByTag
 * @apiGroup Public
 *
 * @apiParam {Number} tagId tagID.
 *
 * @apiSuccess {json} results JSON object containing list of products.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results":[{
 *          "id_product":1,
 *          "tag_id":353,
 *          "image":"http://52.77.208.178/pictures/products/jessicasimpson_bag_barneys_7250.jpg",
 *          "brand":"Fendi",
 *          "price":7250,
 *          "url":"http://www.barneys.com/Fendi-Peekaboo-Large-Satchel-504220532.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-6MQkBhcyUqnwljuhNlVsFg",
 *          "color":"#d8cbc5"
 *		}]
 *     }
 */
app.get('/products/:tagId', function (req, res) {
    var tagId = req.params.tagId;
    var query = "SELECT * FROM products WHERE tag_id = ? ORDER BY id_product ASC";
    var serverurl = 'http://' + req.headers.host;
    db.pool.query(query, [tagId], function (err, products) {
        if (err) {
            res.send({"error": err});
        } else {
            for (var i = 0; i < products.length; i++) {
                products[i].image = serverurl + '/' + products[i].image;
            }
            res.send({"results": products});
        }
    });

});

/**
 * @api {get} /garments Get all garments
 * @apiName GetGarments
 * @apiGroup Public
 *
 * @apiSuccess {json} results JSON object containing list of garments.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      	"results": [{
 *          	"id_garment":43,
 *          	"category_id":2,
 *          	"gender":"man",
 *          	"garment":"Watches",
 *          	"image_url":"http://52.77.208.178/pictures/app/man/WATCHES.jpg",
 *          	"icon":"http://52.77.208.178/pictures/app/tags/SHORTS.png",
 *          	"svg_icon":"http://52.77.208.178/pictures/app/tags/SHORTS.svg"
 *			}]
 *     }
 */
app.get('/garments', function (req, res) {
    var gender = req.params.gender;
    db.pool.query("SELECT * FROM garments ORDER BY garment DESC", gender, function (err, garments) {
        if (err) {
            res.send({"error": err});
        } else {
            var serverurl = 'http://' + req.headers.host;
            for (var i = 0; i < garments.length; i++) {
                garments[i].svg_icon = serverurl + '/' + garments[i].icon;
                garments[i].icon = serverurl + '/' + garments[i].icon.substr(0, garments[i].icon.length - 3) + "png";
                garments[i].image_url = serverurl + '/' + garments[i].image_url;
            }
            res.send({"results": garments});
        }
    });
});

/**
 * @api {get} /garments/:gender Get garments by gender
 * @apiName GetGarmentsByGender
 * @apiGroup Public
 *
 * @apiParam {String} name Celebrity name.
 *
 * @apiSuccess {json} results JSON object containing list of garments by gender.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      	"results": [{
 *      	    "id_garment":43,
 *      	    "category_id":2,
 *      	    "gender":"man",
 *      	    "garment":"Watches",
 *      	    "image_url":"http://52.77.208.178/pictures/app/man/WATCHES.jpg",
 *      	    "icon":"http://52.77.208.178/pictures/app/tags/SHORTS.png",
 *      	    "svg_icon":"http://52.77.208.178/pictures/app/tags/SHORTS.svg"
 *      	}]
 *     }
 */
app.get('/garments/:gender', function (req, res) {
    var gender = req.params.gender;
    db.pool.query("SELECT * FROM garments WHERE gender = ? ORDER BY garment DESC", gender, function (err, garments) {
        if (err) {
            res.send({"error": err});
        } else {
            var serverurl = 'http://' + req.headers.host;
            for (var i = 0; i < garments.length; i++) {
                garments[i].svg_icon = serverurl + '/' + garments[i].icon;
                garments[i].icon = serverurl + '/' + garments[i].icon.substr(0, garments[i].icon.length - 3) + "png";
                garments[i].image_url = serverurl + '/' + garments[i].image_url;
            }
            res.send({"results": garments});
        }
    });
});

/**
 * @api {get} /garments/used Get used garments
 * @apiName GetUsedGarments
 * @apiGroup Public
 *
 * @apiSuccess {json} results JSON object containing list of garments.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      	"results": [{
 *				"count": 3,
 *				"id_garment": 5,
 *				"category_id": 1,
 *				"garment": "Tops",
 *				"image_url": "http://hotspotting.com/pictures/app/tops.jpg"
 *			},
 *			{
 *				"count": 2,
 *				"id_garment": 4,
 *				"category_id": 2,
 *				"garment": "Glasses",
 *				"image_url": "http://hotspotting.com/pictures/app/glasses.jpg"
 *			}]
 *     }
 */
app.get('/garments/used', function (req, res) {
    db.pool.query("SELECT count(*) As 'count', g.* FROM `tags` t, garments g WHERE g.id_garment = t.garment_id "
    + "GROUP BY id_garment ORDER BY count DESC, id_garment DESC", function (err, garments) {
        if (err) {
            res.send({"error": err});
        } else {
            var serverurl = 'http://' + req.headers.host;
            for (var i = 0; i < garments.length; i++) {
                garments[i].svg_icon = serverurl + '/' + garments[i].icon;
                garments[i].icon = serverurl + '/' + garments[i].icon.substr(0, garments[i].icon.length - 3) + "png";
                garments[i].image_url = serverurl + '/' + garments[i].image_url;
            }
            res.send({"results": garments});
        }
    });
});

/**
 * @api {get} all/garments/:id Get all products by garments
 * @apiName GetGarmentsProducts
 * @apiGroup Public
 *
 * @apiSuccess {json} results JSON object containing list of products.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      	"results":[{
 *      	    "id_product":43,
 *      	    "tag_id":10,
 *      	    "image":"http://52.77.208.178/pictures/products/fergie_dresses_victoriabeckham_946.jpg",
 *      	    "brand":"Victoria Beckham ",
 *      	    "price":946,
 *      	    "url":"http://www.neimanmarcus.com/en-pt/Victoria-Beckham-One-Shoulder-Asymmetric-Seamed-Sheath-Dress-victoria-beckham-one-shoulder/prod180830051___/p.prod?&ecid=NMALRJ84DHJLQkR4&CS_003=5630585",
 *      	    "color":"#ee9fc2"
 *      	}]
 *     }
 */
app.get('/all/garments/:id', function (req, res) {

    var garmentID = req.params.id;
    var serverurl = 'http://' + req.headers.host;
    db.pool.query("SELECT a.* FROM `products` a, tags, garments WHERE a.tag_id = tags.id_tag AND tags.garment_id = garments.id_garment AND garments.id_garment=?", [garmentID], function (err, products) {
        if (err) {
            res.send({"error": err});
        } else {
            for (var i = 0; i < products.length; i++) {
                products[i].image = serverurl + '/' + products[i].image;
            }
            addTagsAndRespond(serverurl, products, res);
            res.send({"results": products});
        }
    });

});

/**
 * @api {get} all/garments/:id Get men's products by garments
 * @apiName GetMensGarmentsProducts
 * @apiGroup Public
 *
 * @apiSuccess {json} results JSON object containing list of products.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      	"results":[{
 *      	    "id_product":43,
 *          	"tag_id":10,
 *      	    "image":"http://52.77.208.178/pictures/products/fergie_dresses_victoriabeckham_946.jpg",
 *      	    "brand":"Victoria Beckham ",
 *      	    "price":946,
 *      	    "url":"http://www.neimanmarcus.com/en-pt/Victoria-Beckham-One-Shoulder-Asymmetric-Seamed-Sheath-Dress-victoria-beckham-one-shoulder/prod180830051___/p.prod?&ecid=NMALRJ84DHJLQkR4&CS_003=5630585",
 *      	    "color":"#ee9fc2"
 *      	}]
 *     }
 */

app.get('/men/garments/:id', function (req, res) {
    var garmentID = req.params.id;
    var serverurl = 'http://' + req.headers.host;
    db.pool.query("SELECT a.* FROM `products` a, tags, garments WHERE a.tag_id = tags.id_tag AND tags.garment_id = garments.id_garment AND garments.id_garment=? AND garments.gender='man'", [garmentID], function (err, products) {
        if (err) {
            res.send({"error": err});
        } else {
            for (var i = 0; i < products.length; i++) {
                products[i].image = serverurl + '/' + products[i].image;
            }
            addTagsAndRespond(serverurl, products, res);
            res.send({"results": products});
        }
    });
});

/**
 * @api {get} all/garments/:id Get women's products by garments
 * @apiName GetWomensGarmentsProducts
 * @apiGroup Public
 *
 * @apiSuccess {json} results JSON object containing list of products.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      	"results":[{
 *      	    "id_product":43,
 *      	    "tag_id":10,
 *      	    "image":"http://52.77.208.178/pictures/products/fergie_dresses_victoriabeckham_946.jpg",
 *      	    "brand":"Victoria Beckham ",
 *      	    "price":946,
 *      	    "url":"http://www.neimanmarcus.com/en-pt/Victoria-Beckham-One-Shoulder-Asymmetric-Seamed-Sheath-Dress-victoria-beckham-one-shoulder/prod180830051___/p.prod?&ecid=NMALRJ84DHJLQkR4&CS_003=5630585",
 *      	    "color":"#ee9fc2"
 *      	}]
 *     }
 */

app.get('/women/garments/:id', function (req, res) {

    var garmentID = req.params.id;
    var serverurl = 'http://' + req.headers.host;
    db.pool.query("SELECT a.* FROM `products` a, tags, garments WHERE a.tag_id = tags.id_tag AND tags.garment_id = garments.id_garment AND garments.id_garment=? AND garments.gender='woman'", [garmentID], function (err, products) {
        if (err) {
            res.send({"error": err});
        } else {
            for (var i = 0; i < products.length; i++) {
                products[i].image = serverurl + '/' + products[i].image;
            }
            addTagsAndRespond(serverurl, products, res);
            res.send({"results": products});
        }
    });

});

/**
 * @api {get} /outfits/browse/:garment Get outfits by garment type
 * @apiName GetOutfitsByGarment
 * @apiGroup Public
 *
 * @apiParam {Number} lastDate Last retrieved outfit.
 * @apiParam {Number} limit Max number of results.
 *
 * @apiSuccess {json} results JSON object containing list of outfits by garment type
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      	"results": [{
 *         	    "id_outfit":119,
 *         	    "celebrity_id":15,
 *         	    "image_url":"http://52.77.208.178/uploads/gigi_hadid_1.jpg",
 *         	    "description":"Gigi Hadid looking good.",
 *         	    "date":"2015-12-19T03:47:14.000Z",
 *         	    "id_celebrity":15,"celebrity":"Gigi Hadid",
 *         	    "thumbnail_url":"https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/GIGI%20profile%20.jpg",
 *         	    "picture_url":"pictures/celebrities/GigiHadid.jpg",
 *         	    "favourites":7,
 *         	    "following":4,
 *         	    "tags":[{
 *         	        "id_tag":318,
 *         	        "outfit_id":119,
 *         	        "garment_id":4,
 *         	        "look_url":"http://www.revolveclothing.com/rayban-metal-flash-lense-aviator-in-matte-gold-orange-flash/dp/RAYB-UG6/?d=U&currency=USD&utm_campaign=57486&utm_medium=affiliate&source=ir&utm_source=ir",
 *         	        "less_url":"",
 *         	        "position_x":"0.663",
 *         	        "position_y":"0.108",
 *         	        "id_garment":4,
 *         	        "category_id":2,
 *         	        "gender":"woman",
 *         	        "garment":"Glasses",
 *         	        "image_url":"http://52.77.208.178/pictures/app/woman/GLASSES.jpg",
 *         	        "icon":"http://52.77.208.178/pictures/app/tags/GLASSES.png",
 *         	        "id_product":11,
 *         	        "price":160,
 *         	        "brand":"Ray-Ban",
 *         	        "svg_icon":"http://52.77.208.178/pictures/app/tags/GLASSES.svg"
 *         	        }]
 *			}]
 *     }
 */
app.get('/outfits/browse/:garment', function (req, res) {
    var garment = req.params.garment;
    var lastDate = req.query.lastDate;
    var limit = req.query.limit;
    var serverurl = 'http://' + req.headers.host;
    if (lastDate && limit) {
        db.pool.query("SELECT a.* FROM `alloutfits` a, tags, garments WHERE a.id_outfit = tags.outfit_id AND tags.garment_id = garments.id_garment AND garments.garment=? AND a.date < '?' ORDER BY a.date DESC LIMIT " + limit, [garment, lastDate], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {
                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    } else if (limit) {
        db.pool.query("SELECT a.* FROM `alloutfits` a, tags, garments WHERE a.id_outfit = tags.outfit_id AND tags.garment_id = garments.id_garment AND garments.garment=? ORDER BY a.date DESC LIMIT " + limit, [garment], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {
                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    } else if (lastDate) {
        db.pool.query("SELECT a.* FROM `alloutfits` a, tags, garments WHERE a.id_outfit = tags.outfit_id AND tags.garment_id = garments.id_garment AND garments.garment=? AND a.date < '?' ORDER BY a.date DESC", [garment, lastDate], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {
                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    } else {
        db.pool.query("SELECT a.* FROM `alloutfits` a, tags, garments WHERE a.id_outfit = tags.outfit_id AND tags.garment_id = garments.id_garment AND garments.garment=? ORDER BY a.date DESC", [garment], function (err, outfits) {
            if (err) {
                res.send({"error": err});
            } else {
                addTagsAndRespond(serverurl, outfits, res);
            }
        });
    }
    ;
});

/**
 * @api {get} /celebrity/:name Get celebrity
 * @apiName GetCelebrity
 * @apiGroup Public
 *
 * @apiParam {String} name Celebrity name.
 *
 * @apiSuccess {json} results JSON object containing the celebrity info
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		"results": [{
 *			"id_celebrity": 9,
 *			"celebrity": "Fergie",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/580876_10151221535253676_851063930_n.jpg?itok=W27Mt0h7",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/fergie-banner.jpg",
 *			"following": 0
 *		}]
 *     }
 */
app.get('/celebrity/:name', function (req, res) {
    var name = req.params.name;
    var query = "SELECT *,(select count(*) from celebrities c, following f where c.id_celebrity=f.celebrity_id and c.celebrity = ?) as followers FROM celebrities"
        + " WHERE celebrity = ? ";
    var serverurl = 'http://' + req.headers.host;
    db.pool.query(query, [name, name], function (err, celebrities) {
        if (err) {
            res.send({"error": err});
        } else {
            for (var i = 0; i < celebrities.length; i++) {
                if (celebrities[i].picture_url && celebrities[i].picture_url.substring(0, 4) != 'http')
                    celebrities[i].picture_url = serverurl + '/' + celebrities[i].picture_url;
                if (celebrities[i].thumbnail_url && celebrities[i].thumbnail_url.substring(0, 4) != 'http')
                    celebrities[i].thumbnail_url = serverurl + '/' + celebrities[i].thumbnail_url;
            }
            res.send({"results": celebrities});
        }
    });
});

/**
 * @api {get} /celebrities Get celebrities
 * @apiName GetCelebrities
 * @apiGroup Public
 *
 * @apiSuccess {json} results JSON object containing list of celebrities
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		"results": [{
 *			"id_celebrity": 1,
 *			"celebrity": "Chrissy Teigen",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_mobile_1x/public/celebs/Screen%20Shot%202014-10-25%20at%201.45.17%20PM.jpg?itok=Swtx7GCP",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/chrissy-teigen-banner.jpg"
 *		},
 *		{
 *			"id_celebrity": 2,
 *			"celebrity": "Ariana Grande",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_mobile_1x/public/celebs/ArianaGrande.jpg?itok=1YHnRxMq",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/ariana-grande-banner.jpg"
 *		}]
 *     }
 */
app.get('/celebrities', function (req, res) {
    var serverurl = 'http://' + req.headers.host;
    var query = "SELECT c.*, count(f.celebrity_id) AS followers FROM celebrities c "
        + "LEFT JOIN following f ON c.id_celebrity = f.celebrity_id GROUP BY id_celebrity";
    db.pool.query(query, function (err, celebrities) {
        if (err) {
            res.send({"error": err});
        } else {
            for (var i = 0; i < celebrities.length; i++) {
                if (celebrities[i].picture_url && celebrities[i].picture_url.substring(0, 4) != 'http')
                    celebrities[i].picture_url = serverurl + '/' + celebrities[i].picture_url;
                if (celebrities[i].thumbnail_url && celebrities[i].thumbnail_url.substring(0, 4) != 'http')
                    celebrities[i].thumbnail_url = serverurl + '/' + celebrities[i].thumbnail_url;
            }
            res.send({"results": celebrities});
        }
    });
});

/**
 * @api {get} /celebrities/top Get top celebrities
 * @apiName GetCelebritiesTop
 * @apiGroup Public
 *
 * @apiParam {Number} limit Max number of results.
 *
 * @apiSuccess {json} results JSON object containing list of celebrities
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *		"results": [{
 *			"id_celebrity": 1,
 *			"celebrity": "Chrissy Teigen",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_mobile_1x/public/celebs/Screen%20Shot%202014-10-25%20at%201.45.17%20PM.jpg?itok=Swtx7GCP",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/chrissy-teigen-banner.jpg"
 *		},
 *		{
 *			"id_celebrity": 2,
 *			"celebrity": "Ariana Grande",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_mobile_1x/public/celebs/ArianaGrande.jpg?itok=1YHnRxMq",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/ariana-grande-banner.jpg"
 *		}]
 *     }
 */
app.get('/celebrities/top', function (req, res) {
    var limit = req.query.limit;
    var serverurl = 'http://' + req.headers.host;
    if (limit) {
        db.pool.query("SELECT count(f.celebrity_id) AS 'followers', c.* FROM following f, celebrities c "
        + "WHERE c.id_celebrity=f.celebrity_id GROUP BY celebrity_id ORDER BY followers DESC, celebrity_id DESC LIMIT " + limit, function (err, celebrities) {
            if (err) {
                res.send({"error": err});
            } else {
                for (var i = 0; i < celebrities.length; i++) {
                    if (celebrities[i].picture_url && celebrities[i].picture_url.substring(0, 4) != 'http')
                        celebrities[i].picture_url = serverurl + '/' + celebrities[i].picture_url;
                    if (celebrities[i].thumbnail_url && celebrities[i].thumbnail_url.substring(0, 4) != 'http')
                        celebrities[i].thumbnail_url = serverurl + '/' + celebrities[i].thumbnail_url;
                }
                res.send({"results": celebrities});
            }
        });
    } else {
        db.pool.query("SELECT count(f.celebrity_id) AS 'followers', c.* FROM following f, celebrities c "
        + "WHERE c.id_celebrity=f.celebrity_id GROUP BY celebrity_id ORDER BY followers DESC, celebrity_id DESC", function (err, celebrities) {
            if (err) {
                res.send({"error": err});
            } else {
                for (var i = 0; i < celebrities.length; i++) {
                    if (celebrities[i].picture_url && celebrities[i].picture_url.substring(0, 4) != 'http')
                        celebrities[i].picture_url = serverurl + '/' + celebrities[i].picture_url;
                    if (celebrities[i].thumbnail_url && celebrities[i].thumbnail_url.substring(0, 4) != 'http')
                        celebrities[i].thumbnail_url = serverurl + '/' + celebrities[i].thumbnail_url;
                }
                res.send({"results": celebrities});
            }
        });
    }
});

//TO REMOVE BELOW THIS MESSAGE

function addTagsAndRespond(serverurl, outfits, res) {
    if (outfits) {
        var count = 1,
            query = "SELECT tgo.* ,p.id_product, p.price, p.brand FROM (SELECT t.*, g.* FROM tags t, outfits o, garments g WHERE t.outfit_id=o.id_outfit AND t.garment_id=g.id_garment AND o.id_outfit=?) " +
                "AS tgo LEFT JOIN products p ON tgo.id_tag=p.tag_id"
        outfits.forEach(function (outfit) {
            db.pool.query(query, outfit.id_outfit, function (err, tags) {
                if (err) {
                    res.send({"error": err});
                } else {
                    for (var i = 0; i < tags.length; i++) {
                        tags[i].image_url = serverurl + '/' + tags[i].image_url;
                        tags[i].svg_icon = serverurl + '/' + tags[i].icon;
                        tags[i].icon = serverurl + '/' + tags[i].icon.substr(0, tags[i].icon.length - 3) + "png";
                    }
                    outfit["tags"] = tags;
                    if (outfit["image_url"] && outfit["image_url"].substring(0, 4) != 'http')
                        outfit["image_url"] = serverurl + '/' + outfit["image_url"];
                    if (outfit["thumbnail_url"] && outfit["thumbnail_url"].substring(0, 4) != 'http')
                        outfit["thumbnail_url"] = serverurl + '/' + outfit["thumbnail_url"];

                    if (count == outfits.length) {
                        res.send({"results": outfits});
                    }
                    count++;
                }
            });
        });
    } else {
        res.send({"results": ""});
    }
}
