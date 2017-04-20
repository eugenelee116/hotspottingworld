angular.module( 'hotspotting.celebrity', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('app.celebrity', {
    url: '/celebrity/:name',
    views: {
      'menuContent': {
        templateUrl: 'templates/celebrity.html',
        controller: 'CelebrityCtrl'
      }
    },
    data: {
      requiresLogin: false
    },
    params: {
        item: null
    }
  });
})
.controller( 'CelebrityCtrl', function CelebrityController( $rootScope, $scope, $http, store, $state, $stateParams, PostService) {

  $scope.celebrity = $stateParams.name;
  PostService.GetCelebrityInfo($scope.celebrity, $rootScope.user.userId).then(function(items){
      $scope.picture = items[0].picture_url;
      $scope.celebrity_id = items[0].id_celebrity;
      $scope.followers = items[0].followers;
      $scope.isFollowing = items[0].isfollowing;

  });

  //$scope.items = [];
  $scope.lastDate;
  $scope.hasMoreItems = true;
  var limit = 4;

  PostService.GetCelebrityOutfits($scope.celebrity, limit, $rootScope.user.userId).then(function(items){
    var feedSize = items.length;
    $scope.items = items;
    if(feedSize<limit){
      $scope.hasMoreItems = false;
    }
    $scope.lastDate = items[feedSize-1].date;
  });

  $scope.loadMore = function(){
    console.log("Entered load more function with LatsId="+$scope.lastPostId);
    PostService.GetMoreCelebrityOutfits($scope.celebrity, $scope.lastDate, limit, $rootScope.user.userId).then(function(items) {
      var listSize = items.length;
      console.log("Load More Results Size: " + listSize);
      if(listSize>0){
        $scope.items = $scope.items.concat(items);
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

  $scope.followCelebrity = function(){
    PostService.PostFollowing($rootScope.user.userId, $scope.celebrity_id).then(function(items) {
      if (items){
        $scope.followers = items.followers;
        console.log(items);

        if(items.isfollowing==0){
          $rootScope.user.numfollowing++;
          $('.following-celebrity-follow-button').removeClass('following-btn-active');
        } else{
          $rootScope.user.numfollowing--;
          $('.following-celebrity-follow-button').addClass('following-btn-active');
        }
      }
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

  //Fixes .celebrity-header to the top
  $( "ion-content" ).scroll(function() {
    var st = $(this).scrollTop();
    //$('.celebrity-header').css('top', st);
    //$('.celebrity-header-follow').css('top', st);
  });

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
