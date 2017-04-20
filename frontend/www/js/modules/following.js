angular.module( 'hotspotting.following', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('app.following', {
    url: '/following',
    views: {
      'menuContent': {
        templateUrl: 'templates/following.html',
        controller: 'FollowingCtrl'
      }
    },
    data: {
      requiresLogin: true
    }
  });
})
.controller( 'FollowingCtrl', function FollowingController( $rootScope, $scope, $http, store, $state, $stateParams, PostService) {

  ionic.Platform.ready(function(){
    $scope.platform = ionic.Platform.platforms[0];
  });

  $scope.lastDate;
  $scope.hasMoreItems = false;
  var limit = 4;

  PostService.GetFollowedCelebrities($rootScope.user.userId, limit).then(function(items){
    var feedSize = items.length;
    if(items.length>0){
      $rootScope.user.following = items;
      if(feedSize<limit){
        $scope.hasMoreItems = false;
      } else{
          $scope.hasMoreItems = true;
        }
      $scope.lastDate = items[feedSize-1].date;
    } else{

      $scope.hasMoreItems = false;
    }
  });

  $scope.loadMoreFollowed = function(){
    PostService.GetMoreFollowedCelebrities($rootScope.user.userId, $scope.lastDate, limit).then(function(items) {
      var listSize = items.length;
      if(listSize>0){
        $rootScope.user.following = $rootScope.user.following.concat(items);
        if(listSize<limit){
          $scope.hasMoreItems = false;
        }
        $scope.lastDate = items[listSize-1].id_celebrity;
      } else{
        $scope.hasMoreItems = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.toBeRemoved = []
  $scope.followCelebrity = function(celebrityId, index){
    console.log(index);
    PostService.PostFollowing($rootScope.user.userId, celebrityId).then(function(results) {
      if (results){

        var target = "#following-celebrity-"+celebrityId;
        if(results.isfollowing==1){
          $(target).removeClass( "following-btn-active" );
          $scope.toBeRemoved.push(index);
        } else if(results.isfollowing==0){
          $(target).addClass( "following-btn-active" );
          $scope.toBeRemoved = jQuery.grep($scope.toBeRemoved, function(value) {
            return value != index;
          });
        }

        $rootScope.user.following[index].followers = results.followers;
        //$rootScope.user.following.splice(index, 1);

        //$scope.numFollowing = items.numfollowing;
        console.log(results);
      }
    });
  }

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if(fromState.name=="app.following" && $scope.toBeRemoved.length>0){
      $.each($scope.toBeRemoved, function( index, value ) {
        $rootScope.user.following.splice(value, 1);
        $rootScope.user.numfollowing--;
      });
      $scope.toBeRemoved = [];
    }
  })

});
