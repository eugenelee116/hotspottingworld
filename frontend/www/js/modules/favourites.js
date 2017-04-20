angular.module( 'hotspotting.favourites', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('app.favourites', {
    url: '/favourites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favourites.html',
        controller: 'FavouritesCtrl'
      }
    },
    data: {
      requiresLogin: true
    }
  });
})
.controller( 'FavouritesCtrl', function FavouritesController( $rootScope, $scope, $http, store, $state, $stateParams, PostService) {

  ionic.Platform.ready(function(){
    $scope.platform = ionic.Platform.platforms[0];
  });

  //$scope.items = [];
  $scope.lastDate;
  $scope.hasMoreItems = false;
  var limit = 8;

  PostService.GetFavouriteOutfits($rootScope.user.userId, limit).then(function(items){
    var feedSize = items.length;
    $rootScope.user.favourites = items;
    if(feedSize<limit){
      $scope.hasMoreItems = false;
    } else{
        $scope.hasMoreItems = true;
    }
    $scope.lastDate = items[feedSize-1].date;
  });

  $scope.loadMore = function(){
    PostService.GetMoreFavouriteOutfits($rootScope.user.userId, $scope.lastDate, limit).then(function(items) {
      var listSize = items.length;
      if(listSize>0){
        $rootScope.user.favourites = $rootScope.user.favourites.concat(items);
        if(listSize<limit){
          $scope.hasMoreItems = false;
        }
        $scope.lastDate = items[listSize-1].date;
      } else{
        $scope.hasMoreItems = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.goToOutfit = function(outfit){
    console.log(outfit);
    $state.go('app.outfit', {"outfitId": outfit.id_outfit,"outfit": outfit});
  };

});
