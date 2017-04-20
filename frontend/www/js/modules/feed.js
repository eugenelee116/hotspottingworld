angular.module( 'hotspotting.feed', [
  'ui.router',
  'angular-storage',
  'ngAnimate'/*,
  'infinite-scroll'*/
])
.config(function($stateProvider) {
  $stateProvider.state('app.feed', {
    url: '/feed',
    views: {
      'menuContent': {
        templateUrl: 'templates/feed.html',
        controller: 'FeedCtrl'
      }
    },
    data: {
      requiresLogin: false
    }
  });
})
.controller( 'FeedCtrl',
  function FeedController( $scope, $http, store, $state, $timeout, $ionicLoading, $rootScope, $ionicModal, PostService) {

  $scope.showFooter = true;
  $rootScope.outfits = [];
  $scope.topCelebrities = [];
  $scope.firstId = 0;
  $scope.lastDate = 0;
  $scope.hasMoreItems = false;
  $scope.busy = false;
  $scope.isMenuOpen = false;
  var limit = 4;

  //Get first feed
  PostService.GetFeed(limit, $rootScope.user.userId).then(function(items){
    var feedSize = items.length;
    $rootScope.outfits = items;
    $scope.firstId = items[0].id_outfit;
    $scope.lastDate = items[feedSize-1].date;
    if(feedSize<limit){
      $scope.hasMoreItems = false;
    } else{
      $scope.hasMoreItems = true;
    }
  });

   //Get first feed
  PostService.GetTopCelebrities(3).then(function(items){
    if(items.length>0){
      $scope.topCelebrities = items;
    }
  });

  //Add more outfits to feed
  $scope.loadMore = function(){
    $scope.busy = true;
    $("#loadingMore").show();
    $("#loadingMore").slideDown();
    PostService.GetMoreOutfits($scope.lastDate, limit, $rootScope.user.userId).then(function(items) {
      var listSize = items.length;
      if(listSize>0){
        $.preloadImages(items);
      } else{
        $scope.hasMoreItems = false;
        $("#loadingMore").hide();
        $ionicLoading.show({ template: 'No more outfits!', noBackdrop: true, duration: 2000 });
        $("#loadingMore").slideUp();
      }

    });
  };

  $.preloadImages = function(items) {

    var the_images = [];
    for (var i = 0; i < items.length; i++) {
      the_images.push(items[i].image_url);
    }

    jQuery.imgpreload(the_images,
    {
      all: function()
      {
        var listSize = the_images.length;
        $rootScope.outfits = $rootScope.outfits.concat(items);
        $scope.$apply();
        if(listSize<limit){
          $scope.hasMoreItems = false;
        }
        $scope.lastDate = items[listSize-1].date;
        $scope.busy = false;
        $("#loadingMore").slideUp();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    });

  }

  //Refresh feed
  $scope.doRefresh = function(){
    PostService.GetFreshOutfits($scope.firstId).then(function(items) {
      if (items){
        var temp = items.concat($rootScope.outfits);
        $rootScope.outfits = temp;
        //$rootScope.outfits.unshift(items)
        $scope.firstId = items[0].id_outfit;
      }
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

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

  //Detects click event
  $scope.getClick = function(event){

    var btn = $( "#btnExplore" ),
    width = btn.outerWidth(),
    height = btn.outerHeight(),
    position = btn.position() ,
    left = position.left,
    right = left + width,
    top = position.top,
    bottom = top + height;

    var offsetX = event.offsetX;
    var offsetY = event.offsetY;

    if(offsetX>=left && offsetX<=right && offsetY>=top && offsetY<=bottom){
      //$scope.scrollToFeed();
      //$('body').scrollTo('.feed-body');
      $('ion-content').animate({
          scrollTop: $('.feed-body').offset().top - $('.bar-header').outerHeight()
        }, 500);
    }
  };

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
      $scope.showInformation=function(){
          alert('showInfor');
      }
  $scope.toggleTags = function(event){

    //var parent = $(event.target).parent().parent().parent().prev();
    var parent = $(event.target).parent().parent().siblings()
    parent.find(".taggd-item").toggleClass("active");
    parent.find(".taggd-item").toggleClass("hide-tag");
    //parent.find(".taggd-item-hover").toggleClass("show");
    $(event.target).toggleClass("active")
  }
  $scope.celebrities;
  $scope.results;

  //Gets list of all celebrities names
  $scope.getCelebrities = function(){

    if(!$scope.celebrities){
      PostService.GetCelebrityNames().then(function(items){
        $scope.celebrities = items;
      });
    }
  }
  $scope.getCelebrities();

  $scope.menuOpen = function(){
    if(!$scope.isMenuOpen && $scope.platform == 'browser'){
      $( "#bgHeader" ).slideDown( "fast" );
      $( ".bar-header" ).css( "opacity", 0 );
      $( ".bar-header" ).fadeTo( 600 , 1);
      $scope.isMenuOpen = true;
    }
  }

  $scope.menuClose = function(){
    if($scope.isMenuOpen && $scope.platform == 'browser'){
      $( "#bgHeader" ).slideUp( "fast" );
      $( ".bar-header" ).css( "opacity", 0 );
      $( ".bar-header" ).fadeTo( 600 , 1);
      $scope.isMenuOpen = false;
    }
  }

  $scope.toggleActions = function($event){
    var actions = $($event.target).next();
    //alert(actions);
    actions.slideToggle( "fast" );
  }

  /***** PRELOAD GARMENTS *****/
  PostService.GetGarments("woman").then(function(items){
    if(items.length>0){
      $.preloadGarments(items);
    }
  });
  PostService.GetGarments("man").then(function(items){
    if(items.length>0){
      $.preloadGarments(items);
    }
  });

  $.preloadGarments = function(items) {
    var the_images = [];
    for (var i = 0; i < items.length; i++) {
      the_images.push(items[i].image_url);
    }

    jQuery.imgpreload(the_images,
    {
      all: function()
      {
        console.log("Garments Preloaded");
      }
    });
  }
  /**************************************/

})
.directive('infiniteScroll', [ "$window", function ($window) {
        return {
            link:function (scope, element, attrs) {
                var isOpen = attrs.isMenuOpen;
                var offset = parseInt(attrs.threshold) || 0;
                var e = element[0];

                element.bind('scroll', function (event) {

                    var windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
                    var headerHeight = $(".bar-header").outerHeight();

                    //if(headerHeight + headerHeight + e.scrollTop >= windowHeight){
                    if(headerHeight + e.scrollTop >= windowHeight){
                      scope.$apply(attrs.menuOpen);
                      $('.header-body').hide();
                    } else{
                      scope.$apply(attrs.menuClose);
                      $('.header-body').show();
                    }

                    if (scope.$eval(attrs.canLoad) && !scope.$eval(attrs.isBusy) && e.scrollTop + e.offsetHeight >= e.scrollHeight - offset) {
                        scope.$apply(attrs.infiniteScroll);
                    }
                });
            }
        };
}]);
