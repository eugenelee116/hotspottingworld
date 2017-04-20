angular.module( 'hotspotting.browse', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider
  .state('app.gender', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/gender.html',
        controller: 'GenderCtrl'
      }
    },
    data: {
      requiresLogin: false
    }
  })
  .state('app.garments', {
    url: '/browse/:gender',
    views: {
      'menuContent': {
        templateUrl: 'templates/garments.html',
        controller: 'GarmentsCtrl'
      }
    },
    data: {
      requiresLogin: false
    }
  })
  .state('app.browse', {
    url: '/browse/:gender/:garment',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html',
        controller: 'BrowseCtrl'
      }
    },
    data: {
      requiresLogin: false
    }
  });
})
.controller( 'GenderCtrl', function GenderController( $scope, $http, store, $state, $timeout, $ionicLoading, PostService) {

  function setGenderHeight(){
    var windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var headerHeight = $(".bar-header").outerHeight();

    var genderHeight = (windowHeight - headerHeight) / 2;
    $('.gender').css('height', genderHeight);
  }

  if($scope.platform == 'webview'){
    setGenderHeight();
  }

  $scope.goToGarments = function(gender){
    $state.go('app.garments', {"gender": gender});
  }

})
.controller( 'GarmentsCtrl', function GarmentsController( $scope, $stateParams, $state, $ionicLoading, $compile, PostService) {

  $scope.param = {gender: $stateParams.gender};
  $scope.items = [];
  $scope.womanItems = [];
  $scope.manItems = [];

  if($scope.param.gender=='woman'){
    //$ionicLoading.show({template: 'Loading...'});
    PostService.GetGarments("woman").then(function(items){
      if(items.length>0){
        //preloadWomanImages(items);
        $scope.womanItems = items;
        $scope.items = $scope.womanItems;
      }
      PostService.GetGarments("man").then(function(items){
        if(items.length>0){
          //preloadManImages(items);
          $scope.manItems = items;
        }
      });
    });
  } else{
    //$ionicLoading.show({template: 'Loading...'});
    PostService.GetGarments("man").then(function(items){
      if(items.length>0){
        //preloadManImages(items);
        $scope.manItems = items;
        $scope.items = $scope.manItems;
      }
      PostService.GetGarments("woman").then(function(items){
        if(items.length>0){
          //preloadWomanImages(items);
          $scope.womanItems = items;
        }
      });
    });
  }

  function preloadWomanImages(items) {

    var the_images = [];
    for (var i = 0; i < items.length; i++) {
      the_images.push(items[i].image_url);
    }

    jQuery.imgpreload(the_images,
    {
      all: function(){
        $scope.womanItems = items;
        $scope.$apply();
        initMasonry();
        $('.grid-item img').css({'width': '100%', 'height': '100%'});
      }
    });

  }

   function preloadManImages(items) {

    var the_images = [];
    for (var i = 0; i < items.length; i++) {
      the_images.push(items[i].image_url);
    }

    jQuery.imgpreload(the_images,
    {
      all: function(){
        $scope.manItems = items;
        $scope.$apply();
        initMasonry();
        $('.grid-item img').css({'width': '100%', 'height': '100%'});
      }
    });

  }

  function initMasonry(){

    var grid = document.querySelector('.grid');
    if($scope.param.gender=='woman'){
      $scope.items = $scope.womanItems;
      //var grid = document.querySelector('#womanGrid');
      //$('#toggle-woman').addClass( "active" );
      //$('#toggle-man').removeClass( "active" );
    } else{
      $scope.items = $scope.manItems;
      //var grid = document.querySelector('#manGrid');
      //$('#toggle-woman').removeClass( "active" );
      //$('#toggle-man').addClass( "active" );
    }
    var msnry;

    imagesLoaded( grid, function() {
      // init Isotope after all images have loaded
      msnry = new Masonry( grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
      });
    });

    $ionicLoading.hide();
  }

  $scope.goToBrowse = function(garment){
    console.log("Go to browse");
    $state.go('app.browse', {"gender": $scope.param.gender, "garment": garment});
  }

  $scope.toggleGender = function(gender){
    $ionicLoading.show({template: 'Loading...'});
    $scope.param.gender = gender;
    initMasonry();
    //$compile($('.grid'))($scope);
  }

})
.controller( 'BrowseCtrl', function BrowseController( $scope, $http, store, $state, $timeout, $stateParams, PostService) {

  $scope.gender = $stateParams.gender;
  $scope.garment = $stateParams.garment;
  $scope.items = [];

  //Get garment oufits
  PostService.GetGarmentOutfits($scope.garment).then(function(items){
    console.log("Started loading garment outfits...");
    if(items.length>0){
      $scope.items = items;
    }
    console.log("Finished Loading garment outfits!");
  });

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

});
