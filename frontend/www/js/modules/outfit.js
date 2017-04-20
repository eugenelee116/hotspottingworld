angular.module( 'hotspotting.outfit', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider
  .state('app.outfit', {
    url: '/outfit/:outfitId',
    views: {
      'menuContent': {
        templateUrl: 'templates/outfit.html',
        controller: 'OutfitCtrl'
      }
    },
    data: {
      requiresLogin: false
    },
    params: {
        outfit: null
    }
  });
})
.controller( 'OutfitCtrl', function OutfitController( $rootScope, $scope, $http, store, $state, $timeout, $stateParams, PostService) {

  $scope.outfitId = $stateParams.outfitId;
  if($stateParams.outfit){
    $scope.item = $stateParams.outfit;
  } else{
    PostService.GetOutfit($scope.outfitId, $rootScope.user.userId).then(function(outfit){
      $scope.item = outfit[0];
    });
  }

  $scope.toggleTags = function(event){

    //var parent = $(event.target).parent().parent().parent().prev();
    var parent = $(event.target).parent().parent().siblings()
    parent.find(".taggd-item").toggleClass("active");
    parent.find(".taggd-item").toggleClass("hide-tag");
    //parent.find(".taggd-item-hover").toggleClass("show");
    $(event.target).toggleClass("active")
  }

  //Get outfit post age
  $scope.getTime = function(date){

    var date = new Date(date);
    var currentDate = new Date();
    var milisecondsDiff = currentDate-date;
    var secondsDiff = milisecondsDiff/1000;
    var minutesDiff = secondsDiff/60;
    var hoursDiff = minutesDiff/60;
    var daysDiff = hoursDiff/24;

    if(minutesDiff<60){
      return Math.round(hoursDiff)+"m";
    } else if(hoursDiff<24){
      return Math.round(hoursDiff)+"h";
    } else{
      return Math.round(daysDiff)+"d";
    }
  }

  $scope.toggleActions = function($event){
    var actions = $($event.target).next();
    actions.slideToggle( "fast" );
  }

  //Add outfit to favourites
  $scope.addToFavourites = function($event, outfit_id){

    var $btn = $($event.target);
    PostService.PostFavourite($rootScope.user.userId, outfit_id).then(function(items) {
      if (items){
        var index = "#fav_"+outfit_id;
        angular.element(index).text(items.numfavourites);
        if(items.isfavourite==0){
          $rootScope.user.numfavourites++;
          $btn.addClass('active');
        } else{
          $rootScope.user.numfavourites--;
          $btn.removeClass('active');
        }
      }
    });
  };

});
