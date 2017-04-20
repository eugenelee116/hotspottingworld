var express = require('express'),
    _       = require('lodash'),
    jwt     = require('express-jwt'),
    jwtToken= require('jsonwebtoken'),
    multer  = require('multer'),
    config  = require('./config'),
    quoter  = require('./quoter'),
    db      = require('./db-connect');

var app = module.exports = express.Router();

var jwtCheck = jwt({
  secret: config.secret
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage }),
uploadFields = upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'thumb', maxCount: 1 }]);
var userUpload = upload.fields([{ name: 'picture', maxCount: 1 }]);

app.use('/protected', jwtCheck);

/**
 * @api {put} /protected/user/:userId Update user profile
 * @apiName UpdateUser
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 * @apiParam {String} fullname User fullname.
 * @apiParam {String} email User email.
 * @apiParam {File} picture User picture.
 *
 * @apiSuccess {String} status Request status.
 */
app.put('/protected/user/:userId', userUpload, function (req, res, next) {
	var userId = req.params.userId,
	fullname = req.body.fullname,
	email = req.body.email;
    var serverurl='http://'+req.headers.host;
	if(req.files['picture']){
		var path = req.files['picture'][0].destination;
		var name = req.files['picture'][0].originalname;
		var picture = '/uploads/'+name;

		query = "UPDATE users SET email = ?, fullname = ?, profile_picture = ? WHERE id_user = ?";
		db.pool.query(query, [email, fullname, picture, userId], function(err, result) {
			if (err) {
				res.send({"results": {"error": err}});
			} else{
				getUser(serverurl,res, userId);
			}
		});
	} else{
		query = "UPDATE users SET email = ?, fullname = ? WHERE id_user = ?";
		db.pool.query(query, [email, fullname, userId], function(err, result) {
			if (err) {
				res.send({"results": {"error": err}});
			} else{
				getUser(serverurl,res, userId);
			}
		});
	}
});

function getUser(serverurl,res, userId){
	var query = "SELECT u.*, (SELECT COUNT(*) FROM following o WHERE u.id_user=o.user_id) AS numfollowing, "
    +"(SELECT COUNT(*) FROM favourites a WHERE u.id_user=a.user_id) AS numfavourites "
    +"FROM users u, following o , favourites a WHERE u.id_user=? GROUP BY u.id_user";

    db.pool.query(query, userId, function(err, results) {
		if (err) {
			res.send({"results": {"error": err}});
		} else{
			var profile = {};
		    profile.userId = results[0].id_user;
		    profile.email = results[0].email;
		    profile.fullname = results[0].fullname;
            if(results[0].profile_picture.length>0)
                profile.picture = serverurl+'/'+results[0].profile_picture;
            else
                profile.picture="";
		    profile.numfollowing = results[0].numfollowing;
		    profile.numfavourites = results[0].numfavourites;

		    res.status(201).send({
		      id_token: createToken(profile)
		    });
		}
	});
}

/**
 * @api {post} /protected/outfit Add outfit
 * @apiName AddOutifit
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} celebrity celebrity name.
 * @apiParam {String} description Outfit description.
 * @apiParam {File} file Outfit image.
 *
 * @apiSuccess {String} status Request status.
 */
app.post('/protected/outfit', uploadFields, function (req, res, next) {
	var celebrity = req.body.celebrity,
	description = req.body.description,
	date = req.body.date,
	tags = req.body.tags;
    var serverurl='http://'+req.headers.host;
	//var path = req.files['photo'][0].destination.split("www/")[1];
	var path = req.files['photo'][0].destination;
	var photoName = req.files['photo'][0].originalname;
	var photo = 'uploads/'+photoName;

	db.pool.query("SELECT * FROM celebrities WHERE celebrity LIKE ?", [celebrity], function(err, results) {
		if (err) {

			res.send({"results": {"error": err}});
		} else{
			if(results.length>0){
				var id = results[0].id_celebrity;
				insertOutfit(serverurl,res, id, photo, description, date, tags);
			}else{
				if(req.files['thumb']){
					var thumbName = req.files['thumb'][0].originalname;
					var thumb = path+thumbName;

				}

				db.pool.query("INSERT INTO celebrities (celebrity, thumbnail_url) VALUES (?, ?)", [celebrity, thumb], function(err, result) {
					if (err) {
						res.send({"results": {"error": err}});
					} else{
						var celebrity_id = result.insertId
						insertOutfit(serverurl,res, celebrity_id, photo, description, date, tags);
					}
				});
			}
		}
	});
});

function insertOutfit(serverurl,res, id, photo, description, date, tags){

	db.pool.query("INSERT INTO outfits (celebrity_id, image_url, description, date) VALUES (?,?,?,?)", [id,photo,description,date], function(err, result) {
		if (err) {
			res.send({"results": {"error": err}});
		} else{
			var outfitId = result.insertId;
			if(tags){
				var jsonTags = JSON.parse(tags);
				var count = 0;
				jsonTags.forEach(function(tag) {
					var query = "INSERT INTO tags (outfit_id, garment_id, look_url, less_url, position_x, position_y) "
						+"VALUES (?, ?, ?, ?, ?, ?)";
					db.pool.query(query, [outfitId, tag.text, tag.look, tag.less, tag.x, tag.y], function(err, result) {
						if (err) {
							res.send({"results": {"error": err}});
						} else{
							count++;
							if(count==jsonTags.length){
								getOutfit(serverurl,outfitId, res);
							}
						}
					});
				});
			} else{
				getOutfit(serverurl,outfitId, res);
			}
		}
	});
}

/**
 * @api {put} /protected/outfit/:outfitId Update outfit
 * @apiName UpdateOutifit
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} celebrity Celebrity name.
 * @apiParam {String} description Outfit description.
 * @apiParam {File} photo Outfit image.
 * @apiParam {File} thumb Celebrity profile picture.
 *
 * @apiSuccess {json} results JSON object containing updated outfit.
 */
app.put('/protected/outfit/:outfitId', uploadFields, function (req, res, next) {
	var outfitId = req.params.outfitId,
	celebrity = req.body.celebrity,
	description = req.body.description,
	date = req.body.date,
	tags = req.body.tags;

	//Checks if celebrity exists
	db.pool.query("SELECT * FROM celebrities WHERE celebrity LIKE ?", [celebrity], function(err, results) {
		if (err) {
			res.send({"results": {"error": err}});
		} else{
			if(results.length>0){ //If exists updates outfit
				var celebrity_id = results[0].id_celebrity;
				updateOutfit(req, res, outfitId, celebrity_id, req.files['photo'], description, date, tags);
			}else{ //If does not exist, create celebrity and updates outfit
				if(req.files['thumb']){
					var thumbName = req.files['thumb'][0].originalname;
					var thumb = path+thumbName;
				}
				db.pool.query("INSERT INTO celebrities (celebrity, thumbnail_url) VALUES (?, ?)", [celebrity, thumb], function(err, result) {
					if (err) {
						res.send({"results": {"error": err}});
					} else{
						var celebrity_id = result.insertId
						updateOutfit(req, res, outfitId, celebrity_id, req.files['photo'], description, date, tags);
					}
				});
			}
		}
	});
});

function updateOutfit(req, res, outfitId, celebrityId, photo, description, date, tags){
    var serverurl='http://'+req.headers.host;
	if(req.files['photo']){
		var path = req.files['photo'][0].destination,
		photoName = req.files['photo'][0].originalname,
		photo = 'uploads/'+photoName;
		query = "UPDATE outfits SET celebrity_id = ?, image_url = ?, description = ?, date = ? WHERE id_outfit = ?";

		db.pool.query(query, [celebrityId, photo, description, date, outfitId], function(err, result) {
			if (err) {
				res.send({"results": {"error": err}});
			} else{
				updateTags(serverurl,res, outfitId, tags);
			}
		});
	} else{
		query = "UPDATE outfits SET celebrity_id = ?, description = ?, date = ? WHERE id_outfit = ?";
		db.pool.query(query, [celebrityId, description, date, outfitId], function(err, result) {
			if (err) {
				res.send({"results": {"error": err}});
			} else{
				updateTags(serverurl,res, outfitId, tags);
			}
		});
	}
}

function updateTags(serverurl,res, outfitId, tags){

	db.pool.query("DELETE FROM tags WHERE outfit_id = ?", [outfitId], function(err, results) {
		if (err) {
			res.send({"results": {"error": err}});
		} else{
			var jsonTags = JSON.parse(tags);
			if(jsonTags && jsonTags.length>0){
				var count = 0;
				jsonTags.forEach(function(tag) {
					var query = "INSERT INTO tags (outfit_id, garment_id, look_url, less_url, position_x, position_y) "
						+"VALUES (?, ?, ?, ?, ?, ?)";

					db.pool.query(query, [outfitId, tag.text, tag.look, tag.less, tag.x, tag.y], function(err, result) {
						if (err) {
							res.send({"results": {"error": err}});
						} else{
							count++;
							if(count==jsonTags.length){
								getOutfit(serverurl,outfitId, res);
							}
						}
					});
				});
			} else{
				getOutfit(serverurl,outfitId, res);
			}
		}
	});
}

function getOutfit(serverurl,outfitId, res){

	var query = "SELECT * FROM alloutfits WHERE id_outfit = ? ";
	db.pool.query(query, [outfitId], function(err, outfits, fields) {
		if (err) {
			res.send({"error":err});
		} else{
			if(outfits == ""){
				res.send({"results":""});
			} else{
				addTagsAndRespond(serverurl,outfits, res);
			}
		}
	});

}

/***** OUTFITS *****/

/**
 * @api {get} /protected/user/:userId/outfits Get outfits by user
 * @apiName GetOutfitsByUser
 * @apiGroup Private
 *
 * @apiParam {Number} lastDate Last retrieved outfit.
 * @apiParam {Number} limit Max number of results.
 *
 * @apiSuccess {json} results JSON object containing  list of outfits.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": [{
            "id_outfit": 123,
            "celebrity_id": 34,
            "image_url": "http://52.77.208.178/uploads/jessica_simpson_1.jpg",
            "description": "Dressed in black",
            "date": "2015-12-19T07:01:30.000Z",
            "id_celebrity": 34,
            "celebrity": "Jessica Simpson",
            "thumbnail_url": "http://52.77.208.178/uploads/jessica_simpson_ava.jpg",
            "picture_url": "pictures/celebrities/JessicaSimpson.jpg",
            "favourites": 23,
            "following": 10,
            "isfavourite": 157,
            "tags": [{
                    "id_tag": 353,
                    "outfit_id": 123,
                    "garment_id": 2,
                    "look_url": "http://www.barneys.com/Fendi-Peekaboo-Large-Satchel-504220532.html?utm_source=J84DHJLQkR4&utm_medium=affiliate&siteID=J84DHJLQkR4-6MQkBhcyUqnwljuhNlVsFg",
                    "less_url": "",
                    "position_x": "0.307",
                    "position_y": "0.549",
                    "id_garment": 2,
                    "category_id": 2,
                    "gender": "woman",
                    "garment": "Bags",
                    "image_url": "http://52.77.208.178/pictures/app/woman/BAGS.jpg",
                    "icon": "http://52.77.208.178/pictures/app/tags/BAGS.png",
                    "id_product": 1,
                    "price": 7250,
                    "brand": "Fendi",
                    "svg_icon": "http://52.77.208.178/pictures/app/tags/BAGS.svg"
 *			    }]
 *		    }]
 *     }
 */
app.get('/protected/user/:userId/outfits', function(req, res, next) {
	var lastDate = req.query.lastDate;
	var limit = req.query.limit;
	var userId = req.params.userId;
	var query;
	var outfits = [];
    var serverurl='http://'+req.headers.host;
	if(!lastDate && !limit){
		query = "SELECT a.*, temp.user_id as isfavourite FROM alloutfits a "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON a.id_outfit=temp.outfit_id "
		+"ORDER BY a.id_outfit DESC";
	} else if(!lastDate){
		query = "SELECT a.*, temp.user_id as isfavourite FROM alloutfits a "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON a.id_outfit=temp.outfit_id "
		+"ORDER BY a.id_outfit DESC LIMIT "+limit;
	} else{
		query = "SELECT a.*, temp.user_id as isfavourite FROM alloutfits a "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON a.id_outfit=temp.outfit_id "
		+"WHERE date < '"+lastDate+"' ORDER BY a.id_outfit DESC LIMIT "+limit;
	};

	db.pool.query(query, userId, function(err, outfits, fields) {
		if (err) {
			res.send({"error":err});
		} else{
			if(outfits == ""){
				res.send({"results":""});
			} else{
                for(var i=0;i<outfits.length;i++) {
                    if(!outfits[i].isfavourite)
                        outfits[i].isfavourite=0;
                }
				addTagsAndRespond(serverurl,outfits, res);
			}
		}
	});
});

/**
 * @api {get} /protected/user/:userId/outfit/:outfitId Get specific outfit by user
 * @apiName GetOutfitByUser
 * @apiGroup Private
 *
 * @apiParam {String} userId User ID.
 * @apiParam {Number} lastDate Last retrieved outfit.
 * @apiParam {Number} limit Max number of results.
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
app.get('/protected/user/:userId/outfit/:outfitId', function(req, res) {
	var outfitId = req.params.outfitId;
    var serverurl='http://'+req.headers.host;
	var userId = req.params.userId;
	var query = "SELECT a.*, temp.user_id as isfavourite FROM alloutfits a "
	+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON a.id_outfit=temp.outfit_id "
	+"WHERE id_outfit = ? ORDER BY a.id_outfit DESC";

	db.pool.query(query, [userId, outfitId], function(err, outfits) {
		if (err) {
			res.send({"error":err});
		} else{
			addTagsAndRespond(serverurl,outfits, res);
		}
	});
});

/**
 * @api {get} /protected/user/:userId/outfits/:name Get celebrity outfits by user
 * @apiName GetCelebrityOutfitsByUSer
 * @apiGroup Private
 *
 * @apiParam {String} userId User ID.
 * @apiParam {String} name Celebrity name.
 * @apiParam {Number} lastDate Last retrieved outfit.
 * @apiParam {Number} limit Max number of results.
 *
 * @apiSuccess {json} results JSON object containing list of celebrity outfits.
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
app.get('/protected/user/:userId/outfits/:name', function(req, res) {
	var userId = req.params.userId;
	var name = req.params.name;
	var lastDate = req.query.lastDate;
	var limit = req.query.limit;
    var serverurl='http://'+req.headers.host;
	if(lastDate && limit){
		/*var query = "SELECT o.*, c.thumbnail_url, count(temp.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.outfit_id "
		+"WHERE c.celebrity = ? AND date < '?' GROUP BY id_outfit ORDER BY o.date DESC LIMIT "+limit;*/

		var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.outfit_id "
		+"WHERE c.celebrity = ? AND date < '?' GROUP BY id_outfit ORDER BY o.date DESC LIMIT "+limit;

		db.pool.query(query, [userId, name, lastDate], function(err, outfits) {
			if (err) {
				res.send({"error":err});
			} else{
				addTagsAndRespond(serverurl,outfits, res);
			}
		});
	} else if(limit){
		/*var query = "SELECT o.*, c.thumbnail_url, count(temp.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.outfit_id "
		+"WHERE c.celebrity = ? GROUP BY id_outfit ORDER BY o.date DESC LIMIT "+limit;*/

		var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.outfit_id "
		+"WHERE c.celebrity = ? GROUP BY id_outfit ORDER BY o.date DESC LIMIT "+limit;

			db.pool.query(query, [userId, name], function(err, outfits) {
			if (err) {
				res.send({"error":err});
			} else{
				addTagsAndRespond(serverurl,outfits, res);
			}
		});
	} else if(lastDate){
		/*var query = "SELECT o.*, c.thumbnail_url, count(temp.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.outfit_id "
		+"WHERE c.celebrity = ? AND date < '?' GROUP BY id_outfit ORDER BY o.date DESC";*/

		var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.outfit_id "
		+"WHERE c.celebrity = ? AND date < '?' GROUP BY id_outfit ORDER BY o.date DESC";

		db.pool.query(query, [userId, name, lastDate], function(err, outfits) {
			if (err) {
				res.send({"error":err});
			} else{
				addTagsAndRespond(serverurl,outfits, res);
			}
		});
	} else{
		/*var query = "SELECT o.*, c.thumbnail_url, count(temp.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.out
		.....................................fit_id "
		+"WHERE c.celebrity = ? GROUP BY id_outfit ORDER BY o.date DESC";*/

		var query = "SELECT o.*, c.thumbnail_url, count(f.outfit_id) AS favourites, temp.user_id as isfavourite "
		+"FROM outfits o LEFT JOIN celebrities c ON o.celebrity_id=c.id_celebrity "
		+"LEFT JOIN favourites f ON o.id_outfit = f.outfit_id "
		+"LEFT JOIN (SELECT * FROM favourites WHERE favourites.user_id=?) AS temp ON o.id_outfit = temp.outfit_id "
		+"WHERE c.celebrity = ? GROUP BY id_outfit ORDER BY o.date DESC";

		db.pool.query(query, [userId, name], function(err, outfits) {
			if (err) {
				res.send({"error":query});
			} else{
				addTagsAndRespond(serverurl,outfits, res);
			}
		});
	};
});

/**
 * @api {delete} /protected/outfit/:outfitId Delete outfit
 * @apiName DeleteOutifit
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 *
 * @apiSuccess {String} results "Outfit was successfuly removed!"
 */
app.delete('/protected/outfit/:outfitId', function (req, res, next) {
	var outfitId = req.params.outfitId;
	db.pool.query("DELETE FROM tags WHERE outfit_id = ?", [outfitId], function(err, results) {
		if (err) {
			res.send({"results": {"error": err}});
		} else{
			db.pool.query("DELETE FROM outfits WHERE id_outfit = ?", [outfitId], function(err, results) {
				if (err) {
					res.send({"results": {"error": err}});
				} else{
					res.send({"results": "Outfit was successfuly removed!"});
				}
			});
		}
	});
});

/**
 * @api {get} /protected/user/:userId/information Get user information
 * @apiName GetUserInformation
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 *  *
 * @apiSuccess {json} results JSON object containing user information.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results":[{
 *          "fullname":"nnnnrrrrrr",
 *          "email":"a@a.pl",
 *          "profile_picture":"http://52.77.208.178/img/USER.png",
 *          "followers":24,"favorites":0}]}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "UnauthorizedError: No Authorization header was found"
 *     }
 */
app.get('/protected/user/:userId/information', function(req, res) {
    var serverurl='http://'+req.headers.host;
    var userId = req.params.userId;
    var query = "SELECT u.fullname, u.email, u.profile_picture, "
        +"(SELECT COUNT(*) FROM following f  WHERE f.user_id=u.id_user) AS followers, "
        +"(SELECT COUNT(*) FROM favourites v WHERE v.user_id=u.id_user) AS favorites "
        +"FROM users u where u.id_user = ?";

    db.pool.query(query,[userId],function(err, results) {
        if (err) {
            res.send({"error":err});
        } else{
            for(var i=0;i<results.length;i++)
                results[i].profile_picture=serverurl+'/'+results[i].profile_picture;
            res.send({"results":results});
        }
    });

});

/**
 * @api {get} /protected/user/:userId/favourites Get user favourites
 * @apiName GetUserFavourite
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 * @apiParam {Number} lastDate Last retrieved outfit.
 * @apiParam {Number} limit Max number of results..
 *
 * @apiSuccess {json} results JSON object containing user favourites.
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
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "UnauthorizedError: No Authorization header was found"
 *     }
 */
app.get('/protected/user/:userId/favourites', function(req, res) {
	var userId = req.params.userId;
	var lastDate = req.query.lastDate;
	var limit = req.query.limit;
    var serverurl='http://'+req.headers.host;
	if(lastDate && limit){
		var query = "SELECT o.*, c.*, (SELECT COUNT(*) FROM favourites f WHERE o.id_outfit=f.outfit_id GROUP BY f.outfit_id) AS favourites "
		+"FROM favourites f, outfits o, users u, celebrities c WHERE f.outfit_id=o.id_outfit AND f.user_id = u.id_user "
		+"AND c.id_celebrity=o.celebrity_id AND f.user_id = ? AND date < '?' ORDER BY o.date DESC LIMIT "+limit;

		db.pool.query(query, [userId, lastDate], function(err, outfits) {
			if (err) {
				res.send({"error1":err});
			} else{
                if(outfits.length>0)
                    addTagsAndRespond(serverurl,outfits, res);
                else
                    res.send({"results":[]});
			}
		});
	} else if(lastDate){
		var query = "SELECT o.*, c.*, (SELECT COUNT(*) FROM favourites f WHERE o.id_outfit=f.outfit_id GROUP BY f.outfit_id) AS favourites "
		+"FROM favourites f, outfits o, users u, celebrities c WHERE f.outfit_id=o.id_outfit AND f.user_id = u.id_user "
		+"AND c.id_celebrity=o.celebrity_id AND f.user_id = ? AND date < '?' ORDER BY o.date DESC";

		db.pool.query(query, [userId, lastDate], function(err, outfits) {
			if (err) {
				res.send({"error2":err});
			} else{
                if(outfits.length>0)
                    addTagsAndRespond(serverurl,outfits, res);
                else
                    res.send({"results":[]});
			}
		});
	} else if(limit){
		var query = "SELECT o.*, c.*, (SELECT COUNT(*) FROM favourites f WHERE o.id_outfit=f.outfit_id GROUP BY f.outfit_id) AS favourites "
		+"FROM favourites f, outfits o, users u, celebrities c WHERE f.outfit_id=o.id_outfit AND f.user_id = u.id_user "
		+"AND c.id_celebrity=o.celebrity_id AND f.user_id = ? ORDER BY o.date DESC LIMIT "+limit;

		db.pool.query(query, [userId], function(err, outfits) {
			if (err) {
				res.send({"error3":err});
			} else{
                if(outfits.length>0)
                    addTagsAndRespond(serverurl,outfits, res);
                else
                    res.send({"results":[]});
			}
		});
	} else{
		var query = "SELECT o.*, c.*, (SELECT COUNT(*) FROM favourites f WHERE o.id_outfit=f.outfit_id GROUP BY f.outfit_id) AS favourites "
		+"FROM favourites f, outfits o, users u, celebrities c WHERE f.outfit_id=o.id_outfit AND f.user_id = u.id_user "
		+"AND c.id_celebrity=o.celebrity_id AND f.user_id = ? ORDER BY o.date DESC";

		db.pool.query(query, [userId], function(err, outfits) {
			if (err) {
				res.send({"error4":err});
			} else{
                if(outfits.length>0)
                    addTagsAndRespond(serverurl,outfits, res);
                else
                    res.send({"results":[]});

			}
		});
	}
});

/**
 * @api {get} /protected/user/:userId/favourites Get user's recent favourites
 * @apiName GetRecentLikes
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 * @apiParam {Number} limit Max number of results..
 *
 * @apiSuccess {json} results JSON object containing recent user likes.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "results": [
            {
                "id_outfit": 3,
                "celebrity_id": 9,
                "image_url": "uploads/spl1153043_023.jpg",
                "description": "Fergie promotes her footwear at Lord & Taylor.",
                "date": "2015-10-17T14:30:38.000Z"
            },
            {
                "id_outfit": 6,
                "celebrity_id": 12,
                "image_url": "uploads/FFN_Thorne_Bella_JKING_semi_100815_51874151.jpg",
                "description": "Bella rocks a leather mini dress at the Vancouver airport.",
                "date": "2015-10-18T14:36:19.000Z"
            }
        ]}
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "UnauthorizedError: No Authorization header was found"
 *     }
 */
app.get('/protected/user/:userId/recentlikes', function(req, res) {
    var userId = req.params.userId;
    var limit = req.query.limit;
     if(limit){
        var query = "SELECT o.* "
            +"FROM favourites f, outfits o WHERE f.outfit_id=o.id_outfit "
            +"AND f.user_id = ? ORDER BY f.id_favourite DESC LIMIT "+limit;

        db.pool.query(query, [userId], function(err, outfits) {
            if (err) {
                res.send({"error3":err});
            } else{
                if(outfits.length>0)
                    res.send({"results":outfits});
                else
                    res.send({"results":[]});
            }
        });
    } else{
         var query = "SELECT o.* "
             +"FROM favourites f, outfits o WHERE f.outfit_id=o.id_outfit "
             +"AND f.user_id = ? ORDER BY f.id_favourite DESC";

        db.pool.query(query, [userId], function(err, outfits) {
            if (err) {
                res.send({"error4":err});
            } else{
                if(outfits.length>0)
                    res.send({"results":outfits});
                else
                    res.send({"results":[]});

            }
        });
    }
});

/**
 * @api {post} /protected/user/:userId/favourite/:outfitId Adds or removes outfit favourite
 * @apiName ToggleOutfitFavourite
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 * @apiParam {String} outfitId Outfit ID.
 *
 * @apiSuccess {json} results JSON object containing request result and outfit number of favourites.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": {
 *			"isfavourite": 1,
 *			"numfavourites": 1
 *		}
 *     }
 */
app.post('/protected/user/:userId/favourite/:outfitId', function(req, res) {
	var userId = req.params.userId;
	var outfitId = req.params.outfitId;
	var result ;
	var query = "SELECT COUNT(*) AS isfavourite, "
		+"(SELECT COUNT(*) FROM favourites f, outfits o WHERE o.id_outfit=f.outfit_id AND f.outfit_id = ?) AS numfavourites "
		+"FROM favourites f, outfits o, users u WHERE f.outfit_id = o.id_outfit AND f.user_id = u.id_user "
		+"AND f.user_id = ? AND f.outfit_id = ?";

	db.pool.query(query, [outfitId, userId, outfitId], function(err, rows) {
		if (err) {
			res.send({"error":err});
		} else{

			var isfavourite = rows[0].isfavourite;
			var numfavourites = rows[0].numfavourites;

			if(isfavourite>0){

				db.pool.query('DELETE FROM favourites WHERE user_id = ? AND outfit_id = ?', [userId, outfitId],function (err, result) {
					if (err) {
						res.send({"error":err});
					} else{
						if(result.affectedRows>0){
                            isfavourite=0;
							numfavourites--;
							result = {"isfavourite": isfavourite, "numfavourites": numfavourites};
							res.send({"results":result});
						}
					}
				});
			} else{
				db.pool.query('INSERT INTO favourites (user_id, outfit_id) VALUES (?, ?)', [userId, outfitId],function (err, result) {
					if (err) {
						res.send({"error":err});
					} else{
						if(result.affectedRows){
                            isfavourite=1;
							numfavourites++;
							result = {"isfavourite": isfavourite, "numfavourites": numfavourites};
							res.send({"results":result});
						}
					}
				});
			}
		}
	});
});

/**
 * @api {get} /protected/user/:userId/following Get user followed celebrities
 * @apiName GetUserFollowing
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 *
 * @apiSuccess {json} results JSON object containing user favourites.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": [{
 *			"id_celebrity": 3,
 *			"celebrity": "Taylor Swift",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Taylor%20S.jpg?itok=OtOFGZSM",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/taylor-swift-banner.jpg",
 *			"numfollowing": 1
 *		},
 *		{
 *			"id_celebrity": 6,
 *			"celebrity": "Kendall Jenner",
 *			"thumbnail_url": "https://swavy.com/sites/default/files/styles/wa_celeb_page_celeb_1x/public/celebs/Screen%20Shot%202014-10-07%20at%208.16.52%20AM.jpg",
 *			"picture_url": "http://hotspotting.com/pictures/celebrities/kendall-jenner-banner.jpg",
 *			"numfollowing": 1
 *		}]
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "UnauthorizedError: No Authorization header was found"
 *     }
 */
app.get('/protected/user/:userId/following', function(req, res) {
	var userId = req.params.userId;
	var query = "SELECT c.* , "
		+"(SELECT COUNT(*) FROM following f WHERE c.id_celebrity=f.celebrity_id GROUP BY f.celebrity_id) AS followers "
		+"FROM following f, celebrities c, users u WHERE f.celebrity_id = c.id_celebrity AND f.user_id = u.id_user AND f.user_id = ?";

	db.pool.query(query, [userId], function(err, results) {
		if (err) {
			res.send({"error":err});
		} else{
			res.send({"results":results});
		}
	});
});

/**
 * @api {get} /protected/user/:userId/isfollowing Checks whether the user likes the celebrity
 * @apiName Checksfollowing
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 *@apiParam {String} celebrityId Celebrity ID.
 *
 * @apiSuccess {json} results JSON object containing user favourites.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": "true"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "UnauthorizedError: No Authorization header was found"
 *     }
 */
app.get('/protected/user/:userId/isfollowing/:celebrityId', function(req, res) {
    var userId = req.params.userId;
    var celebrityId = req.params.celebrityId;
    var query = "SELECT count(*) as likecount FROM following WHERE user_id = ? AND celebrity_id = ?";

    db.pool.query(query, [userId,celebrityId], function(err, results) {
        if (err) {
            res.send({"error":err});
        } else{
            if(results[0].likecount>0)
                res.send({"results":"true"});
            else
                res.send({"results":"false"});
        }
    });
});

/**
 * @api {post} /protected/user/:userId/follow/:celebrityId Follows or unfollows celebrity
 * @apiName ToggleCelebrityFollowing
 * @apiGroup Private
 *
 * @apiHeader {String} Authorization Authorization token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
 *     }
 *
 * @apiParam {String} userId User ID.
 * @apiParam {String} celebrityId Celebrity ID.
 *
 * @apiSuccess {json} results JSON object containing request result and outfit number of following.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "results": {
 *			"isfollowing": 1,
 *			"numfollowing": 1
 *		}
 *     }
 */
app.post('/protected/user/:userId/follow/:celebrityId', function(req, res) {
	var userId = req.params.userId;
	var celebrityId = req.params.celebrityId;
	var result ;

	var query = "SELECT COUNT(*) AS isfollowing, "
		+"(SELECT COUNT(*) FROM following f WHERE f.celebrity_id = ?) AS followers "
		+"FROM following f, users u WHERE f.user_id = u.id_user AND f.user_id = ? AND f.celebrity_id = ?";

	db.pool.query(query, [celebrityId, userId, celebrityId], function(err, rows) {
		if (err) {
			res.send({"error":err});
		} else{

			var isfollowing = rows[0].isfollowing;
			var followers = rows[0].followers;

			if(isfollowing>0){

				db.pool.query('DELETE FROM following WHERE user_id = ? AND celebrity_id = ?', [userId, celebrityId],function (err, result) {
					if (err) {
						res.send({"error":err});
					} else{
						if(result.affectedRows>0){
                            isfollowing=0;
							followers--;
							result = {"isfollowing": isfollowing, "followers": followers};
							res.send({"results":result});
						}
					}
				});
			} else{
				db.pool.query('INSERT INTO following (user_id, celebrity_id) VALUES (?, ?)', [userId, celebrityId],function (err, result) {
					if (err) {
						res.send({"error":err});
					} else{
						if(result.affectedRows){
                            isfollowing=1;
							followers++;
							result = {"isfollowing": isfollowing, "followers": followers};
							res.send({"results":result});
						}
					}
				});
			}
		}
	});
});

/**
 * @api {get} /protected/user/:userId/celebrity/:name Get celebrity with user logged in
 * @apiName GetCelebrity
 * @apiGroup Private
 *
 * @apiParam {String} userId User ID.
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
 *			"following": 0,
 *			"isfollowing": 0,
 *		}]
 *     }
 */
app.get('/protected/user/:userId/celebrity/:name', function(req, res) {
	var name = req.params.name;
	var userId = req.params.userId;
    var serverurl='http://'+req.headers.host;
	var query = "SELECT c.*, count(f.id_following) AS followers, count(x.id_user) AS isfollowing "
	+"FROM celebrities c LEFT JOIN following f ON c.id_celebrity=f.celebrity_id "
	+"LEFT JOIN (SELECT * FROM users WHERE users.id_user=?) AS x ON f.user_id=x.id_user "
	+"WHERE c.celebrity= ? GROUP BY id_celebrity"

	db.pool.query(query, [userId, name], function(err, celebrities) {
    	if (err) {
        	res.send({"error":err});
		} else{
            for(var i=0;i<celebrities.length;i++) {
                if (celebrities[i].picture_url && celebrities[i].picture_url.substring(0, 4) != 'http')
                    celebrities[i].picture_url = serverurl + '/' + celebrities[i].picture_url;
                if (celebrities[i].thumbnail_url && celebrities[i].thumbnail_url.substring(0, 4) != 'http')
                    celebrities[i].thumbnail_url = serverurl + '/' + celebrities[i].thumbnail_url;
            }
			res.send({"results":celebrities});
        }
	});
});

function addTagsAndRespond(serverurl,outfits, res){
  if(outfits){
    var count = 1,
    	//query = "SELECT t.*, g.* FROM tags t, outfits o, garments g "
    	//	+"WHERE t.outfit_id=o.id_outfit AND t.garment_id=g.id_garment AND o.id_outfit=?"
        query = "SELECT tgo.* ,p.id_product, p.price, p.brand FROM (SELECT t.*, g.* FROM tags t, outfits o, garments g WHERE t.outfit_id=o.id_outfit AND t.garment_id=g.id_garment AND o.id_outfit=?) " +
            "AS tgo LEFT JOIN products p ON tgo.id_tag=p.tag_id"
    outfits.forEach(function(outfit) {
      //db.pool.query("SELECT t.* FROM tags t, outfits o WHERE t.outfit_id=o.id_outfit AND o.id_outfit=?", outfit.id_outfit, function(err, tags) {
      	db.pool.query(query, outfit.id_outfit, function(err, tags) {
        if (err) {
          	res.send({"error":err});
        } else{
            for(var i=0;i<tags.length;i++) {
                tags[i].image_url =  serverurl+'/'+tags[i].image_url;
                tags[i].svg_icon = serverurl+'/'+tags[i].icon;
                tags[i].icon = serverurl+'/'+tags[i].icon.substr(0,tags[i].icon.length-3)+"png";
            }
            outfit["tags"] = tags;
            if(outfit["image_url"]&&outfit["image_url"].substring(0,4)!='http')
                outfit["image_url"]=serverurl+'/'+outfit["image_url"];
            if(outfit["thumbnail_url"]&&outfit["thumbnail_url"].substring(0,4)!='http')
                outfit["thumbnail_url"]=serverurl+'/'+outfit["thumbnail_url"];
          if(count==outfits.length){
            res.send({"results":outfits});
          }
          count++;
        }
      });
    });
  } else{
    res.send({"results":""});
  }
}

function createToken(data) {
	var token = jwtToken.sign(_.omit(data, 'password'), config.secret, { expiresIn: 36000 });
  return token;
}
