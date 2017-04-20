angular.module( 'hotspotting.upload', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('app.upload', {
    url: '/upload',
    views: {
      'menuContent': {
        templateUrl: 'templates/upload.html',
        controller: 'UploadCtrl'
      }
    },
    data: {
      requiresLogin: false
    }
  });
})
.controller( 'UploadCtrl', function UploadController( $rootScope, $scope, multipartForm, $ionicLoading, $compile, $timeout, PostService) {

  $scope.celebrities;
  $scope.garments = [];
  $scope.womanGarments = [];
  $scope.manGarments = [];
  $scope.results;

  PostService.GetCelebrityNames().then(function(items){
    $scope.celebrities = items;
  });

  PostService.GetGarments('woman').then(function(items){
    $scope.womanGarments = items;
  });
  PostService.GetGarments('man').then(function(items){
    $scope.manGarments = items;
  });

  if($scope.editItem){
    $scope.uploadData.celebrity = $scope.editItem.celebrity;
    $scope.uploadData.date = $scope.editItem.date;
    $scope.uploadData.description = $scope.editItem.description;
  }

  //Get outfit post age
  $scope.getTime = function(){
    var currentDate;

    if($scope.uploadData.date){
      currentDate = $scope.uploadData.date.split("T");
    } else{
       currentDate = new Date().toISOString().split("T");
    }

    var date = currentDate[0];
    var time = currentDate[1].split(".")[0];

    return date+" "+time;
  }
  $scope.uploadData.date = $scope.getTime();

  $scope.SubmitUpload = function(){

    $scope.uploadData.tags = $('#output').val();
    multipartForm.NewOutfit($scope.uploadData).then(function(result) {
      if(result.error){
        $ionicLoading.show({ template: result.error.code, noBackdrop: true, duration: 1000 });
        console.log(result.error);
      } else{
        $ionicLoading.show({ template: "Successfuly added new outfit!", noBackdrop: true, duration: 1000 });
        console.log(result);

        //var temp = result.concat($scope.outfits);
        //$scope.outfits = temp;
        $scope.outfits.splice(0, 0, result[0]);

        clearUpload();
        $scope.uploadData = {};
        $scope.editItem = {};
      }
    });
  }

   $scope.UpdateOutfit = function(){

    $scope.uploadData.tags = $('#output').val();
    multipartForm.UpdateOutfit($scope.uploadData, $scope.editItem.id_outfit).then(function(result) {
      if(result.error){
        $ionicLoading.show({ template: result.error.code, noBackdrop: true, duration: 1000 });
        console.log(result.error);
      } else{
        $ionicLoading.show({ template: "Outfit was successfully updated!", noBackdrop: true, duration: 1000 });

        angular.copy(result[0], $scope.editItem);
        var outfit_id = "#outfit-"+$scope.editItem.id_outfit;
        var $image = $(outfit_id).clone();
        var $wrapper = $(outfit_id).parent().parent();
        $wrapper.empty();
        $image.attr('ng-src', $scope.editItem.image_url);
        $image.attr('src', $scope.editItem.image_url);
        $image.attr('tags', JSON.stringify($scope.editItem.tags));
        //console.log($scope.editItem.tags);
        $wrapper.append($image);
        $compile($image)($scope);
      }
    });
  }

  //Gets list of all celebrities names
  $scope.getCelebrities = function(){

    if(!$scope.celebrities){
      PostService.GetCelebrityNames().then(function(items){
        $scope.celebrities = items;
        console.log($scope.celebrities);
      });
    }
  }

  //When user types in the celebrity input
  //we search for celebrity names that match the user input
  //and add the matching names to the autocomplete
  $scope.searchTerm = function(){
    var term = $scope.uploadData.celebrity.toUpperCase();
    var results = new Array();

    for (i = 0; i < $scope.celebrities.length; ++i) {
      var name = $scope.celebrities[i].celebrity;
      if ( term!="" && (name.substring(0, term.length).toUpperCase() === term) ) {
        results.push($scope.celebrities[i]);
      }

      if ( term!="" && (name.toUpperCase() != term) ) {
        //$("#upload-thumb").attr('src', '');
        $("#preview-thumb").removeAttr('src');
        //$( ".upload-button.thumb" ).show();
      }
    }

    $scope.results = results;
  }

  $scope.onBlur = function(){
    $timeout(function() {
      $scope.results = {};
    }, 200);

  }

  //Gets celebrity name from autocomplete and adds it to the celebrity input
  $scope.selectCelebrity = function(result){

    $scope.uploadData.celebrity = result.celebrity;
    //$( ".upload-button.thumb" ).hide();
    $("#preview-thumb").attr('src', result.thumbnail_url);
    $scope.results = {};
  }

  $scope.triggerLoadImage = function(){
    $( "#input-image" ).trigger( "click" );
  }

  $scope.triggerLoadThumb = function(){
    $( "#input-thumb" ).trigger( "click" );
  }

});
