myApp.factory('PostService', function($http){
	//var BASE_URL = "http://52.11.166.255:3000/api/";
	var BASE_URL = "/api/";
	var items = [];

	return {
		GetFeed: function(limit, userId){
			if(userId){
				var url = BASE_URL+'protected/user/'+userId+'/outfits?limit='+limit;
			}else{
				var url = BASE_URL+'outfits?limit='+limit;
			}

			return $http.get(url).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetFreshOutfits: function(firstId, userId){
			if(userId){
				var url = BASE_URL+'protected/user/'+userId+'/outfits/refresh?firstId='+firstId;
			}else{
				var url = BASE_URL+'outfits/refresh?firstId='+firstId;
			}

			return $http.get(url).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetMoreOutfits: function(lastDate, limit, userId){
			if(userId){
				var url = BASE_URL+'protected/user/'+userId+'/outfits?lastDate='+lastDate+'&limit='+limit;
			}else{
				var url = BASE_URL+'outfits?lastDate='+lastDate+'&limit='+limit;
			}

			return $http.get(url).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetOutfit: function(outfitId, userId){
			if(userId){
				var url = BASE_URL+'protected/user/'+userId+'/outfit/'+outfitId;
			}else{
				var url = BASE_URL+'outfit/'+outfitId;
			}

			return $http.get(url).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetCelebrityInfo: function(celebrityName, userId){
			if(userId){
				var url = BASE_URL+'protected/user/'+userId+'/celebrity/'+celebrityName;
			}else{
				var url = BASE_URL+'celebrity/'+celebrityName;
			}

			return $http.get(url).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetCelebrityOutfits: function(celebrityId, limit, userId){
			if(userId){
				var url = BASE_URL+'protected/user/'+userId+'/outfits/'+celebrityId+'?&limit='+limit;
			}else{
				var url = BASE_URL+'outfits/'+celebrityId+'?&limit='+limit;
			}

			return $http.get(url).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetMoreCelebrityOutfits: function(celebrityId, lastDate, limit, userId){
			if(userId){
				var url = BASE_URL+'protected/user/'+userId+'/outfits/'+celebrityId+'?lastDate='+lastDate+'&limit='+limit;
			}else{
				var url = BASE_URL+'outfits/'+celebrityId+'?lastDate='+lastDate+'&limit='+limit;
			}

			return $http.get(url).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetProducts: function(tagId){
			return $http.get(BASE_URL+'products/'+tagId).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetCelebrityNames: function(){
			return $http.get(BASE_URL+'celebrities').then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetTopCelebrities: function(limit){
			return $http.get(BASE_URL+'celebrities/top?limit='+limit).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetFavouriteOutfits: function(userId, limit){
			return $http.get(BASE_URL+'protected/user/'+userId+'/favourites/?limit='+limit).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetMoreFavouriteOutfits: function(userId, lastDate, limit){
			return $http.get(BASE_URL+'protected/user/'+userId+'/favourites/?lastDate='+lastDate+'&limit='+limit).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetFollowedCelebrities: function(userId, limit){
			return $http.get(BASE_URL+'protected/user/'+userId+'/following/?limit='+limit).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetMoreFollowedCelebrities: function(userId, lastDate, limit){
			return $http.get(BASE_URL+'protected/user/'+userId+'/following/?lastDate='+lastDate+'&limit='+limit).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetGarments: function(gender){
			return $http.get(BASE_URL+'garments/'+gender).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetUsedGarments: function(gender){
			return $http.get(BASE_URL+'garments/used').then(function(response){
				items = response.data.results;
				return items;
			});
		},
		GetGarmentOutfits: function(garment){
			return $http.get(BASE_URL+'outfits/browse/'+garment).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		PostFavourite: function(user_id, post_id){
			return $http.post(BASE_URL+'protected/user/'+user_id+'/favourite/'+post_id).then(function(response){
				return response.data.results;
			});
		},
		PostFollowing: function(user_id, celebrityId){
			return $http.post(BASE_URL+'protected/user/'+user_id+'/follow/'+celebrityId).then(function(response){
				return response.data.results;
			});
		},
		DeleteOutfit: function(outfitId){
			return $http.delete(BASE_URL+'protected/outfit/'+outfitId).then(function(response){
				return response.data.results;
			});
		}
	}
});
