myApp.service('multipartForm', ['$http', function($http){
	//var BASE_URL = "http://52.11.166.255:3000/api/";
	var BASE_URL = "/api/";

	return {
		NewOutfit: function(data){
			var url = BASE_URL+'protected/outfit'
			var fd = new FormData();
			for(var key in data)
				fd.append(key, data[key]);
			return $http.post(url, fd, {
				transformRequest: angular.indentity,
				headers: { 'Content-Type': undefined }
			}).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		UpdateOutfit: function(data, outfitId){
			var url = BASE_URL+'protected/outfit/'+outfitId;
			var fd = new FormData();
			for(var key in data)
				fd.append(key, data[key]);
			return $http.put(url, fd, {
				transformRequest: angular.indentity,
				headers: { 'Content-Type': undefined }
			}).then(function(response){
				items = response.data.results;
				return items;
			});
		},
		UpdateAccount: function(data, userId){
			var url = BASE_URL+'protected/user/'+userId;
			var fd = new FormData();
			for(var key in data)
				fd.append(key, data[key]);
			return $http.put(url, fd, {
				transformRequest: angular.indentity,
				headers: { 'Content-Type': undefined }
			}).then(function(response){
				return response;
			});
		}

	}

}]);
