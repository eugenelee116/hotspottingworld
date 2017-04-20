// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var myApp = angular.module('hotspotting', [
  'ionic',
  'ngCordova',
  'angular-jwt',
  'angular-storage',
  'ngAnimate',
  'hotspotting.feed',
  'hotspotting.celebrity',
  'hotspotting.following',
  'hotspotting.favourites',
  'hotspotting.browse',
  'hotspotting.upload',
  'hotspotting.account',
  'hotspotting.outfit',
  'wu.masonry','ngResource',
  'hotspotting.buy',
  'hotspotting.products'
  ])

//.run(function($ionicPlatform, $rootScope) {
.run(function($ionicPlatform, $rootScope, $state, $ionicPopup, $cordovaNetwork, $animate, $compile, store, jwtHelper) {

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    //CHECK FOR INTERNET CONNECTION
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.confirm({
          title: "Internet Disconnected",
          content: "The internet is disconnected on your device."
        })
        /*.then(function(result) {
          if(!result) {
            ionic.Platform.exitApp();
          }
        })*/;
      }
    }

    //CHECK FOR INTERNET CONNECTION
    if ($cordovaNetwork.isOffline()) {
         $ionicPopup.confirm({
            title: "Internet is not working",
            content: "Internet is not working on your device."
         });
      }

  });

  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (to.data && to.data.requiresLogin) {
      if (!store.get('jwt') || jwtHelper.isTokenExpired(store.get('jwt'))) {
        e.preventDefault();
        $state.go('app.feed');
      }
    }
  });

  $rootScope.initUser = function(jwt){

    var decodedJwt = jwtHelper.decodeToken(jwt);

    $rootScope.user = {
      "userId": "",
      "username": "",
      "email": "",
      "fullname": "",
      "picture": "",
      "numfavourites": "",
      "favourites": [],
      "numfollowing": "",
      "following": []
    };

    $rootScope.user.userId = decodedJwt.userId;
    $rootScope.user.username = decodedJwt.username;
    $rootScope.user.email = decodedJwt.email;
    $rootScope.user.fullname = decodedJwt.fullname;
    $rootScope.user.picture = decodedJwt.picture;
    $rootScope.user.numfollowing = decodedJwt.numfollowing;
    $rootScope.user.numfavourites = decodedJwt.numfavourites;

    $(".admin-bar").css('display', 'block');


  }

  if (store.get('jwt') && !jwtHelper.isTokenExpired(store.get('jwt'))) {
    $rootScope.initUser(store.get('jwt'));
  } else{
    $rootScope.user = {
      "userId": null,
      "username": null,
      "email": null,
      "fullname": null,
      "picture": null,
      "numfavourites": null,
      "favourites": null,
      "numfollowing": null,
      "following": null
    };
  }

  // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { // your check here
      $ionicPopup.confirm({
        title: 'Are you sure?',
        template: 'Are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);

})

//.config(function($stateProvider, $urlRouterProvider) {
.config( function myAppConfig ($stateProvider, $urlRouterProvider, jwtInterceptorProvider, $httpProvider, $locationProvider, $ionicConfigProvider) {

  //$ionicConfigProvider.views.transition('none');

  $urlRouterProvider.otherwise('/');

  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('jwt');
  }

  $httpProvider.interceptors.push('jwtInterceptor');

  $stateProvider
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	});
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/feed');
  // use the HTML5 History API
  //$locationProvider.html5Mode(true);
})
.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $http, $state, $ionicLoading, $ionicPopup, $window, PostService, jwtHelper, store) {

  //var BASE_URL = "http://52.11.166.255:3000/api/";
  var BASE_URL = "/api/";

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  ionic.Platform.ready(function(){
    $rootScope.platform = ionic.Platform.platforms[0];
  });

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  // Open the login modal
  $rootScope.openLogin = function() {
    $scope.loginModal.show();
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  $scope.submitLogin = function() {
    if($scope.loginData.email && $scope.loginData.password){
      $http({
        url: BASE_URL+'login',
        method: 'POST',
        data: $scope.loginData
      }).then(function(response) {

        var jwt = response.data.id_token;
        $rootScope.initUser(jwt);
        store.set('jwt', jwt);

        $scope.closeLogin();

        $state.go('app.feed');
        $window.location.reload(true);

      }, function(error) {
        $ionicLoading.show({ template: error.data, noBackdrop: true, duration: 1000 });
      });
    } else{
       $ionicLoading.show({ template: "One or more fields are missing!", noBackdrop: true, duration: 1000 });
    }
  }

  $scope.switchToSignup = function(){
     $scope.closeLogin();
     $scope.openSignup();
  }

  // Form data for the login modal
  $scope.signupData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.signupModal = modal;
  });

  // Open the login modal
  $rootScope.openSignup = function() {
    $scope.signupModal.show();
  };

  // Triggered in the login modal to close it
  $scope.closeSignup = function() {
    $scope.signupModal.hide();
    $scope.signupData = {};
  };

  $scope.submitSignup = function() {

    if($scope.signupData.username && $scope.signupData.password && $scope.signupData.confirm){

      if($scope.signupData.password == $scope.signupData.confirm){

        $ionicLoading.show({
          template: 'Signing up...'
        });

        $http({
          url: BASE_URL+'signup',
          method: 'POST',
          data: $scope.signupData
        }).then(function(response) {

          $ionicLoading.hide();

          var jwt = response.data.id_token;
          $rootScope.initUser(jwt);
          store.set('jwt', jwt);

          $scope.closeSignup();
          $window.location.reload(true);
        }, function(error) {

          $ionicLoading.hide();

          $ionicLoading.show({ template: error.data, noBackdrop: true, duration: 1000 });
        });
      } else{
        $ionicLoading.show({ template: "Passwords do not match!", noBackdrop: true, duration: 1000 });
      }
    } else{
      $ionicLoading.show({ template: "One or more fields are missing!", noBackdrop: true, duration: 1000 });
    }
  }

  $scope.switchToLogin = function(){
     $scope.closeSignup();
     $scope.openLogin();
  }

  $scope.logout = function(){
    $rootScope.user = null;
    store.remove('jwt');
  }

  // Form data for the upload modal
  $scope.uploadData = {};

  // Open the upload modal
  $rootScope.openUpload = function(item) {
    if(item){
      $scope.editItem = item;
    }
    // Create the upload modal that we will use later
    $ionicModal.fromTemplateUrl('templates/upload.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.uploadModal = modal;
      $scope.uploadModal.show();
      initUpload();
    });
  };

  // Triggered in the upload modal to close it
  $scope.closeUpload = function() {
    $scope.uploadModal.remove();
    $scope.uploadData = {};
  };

  $scope.deleteItem = function(outfitId, items, index) {

    $ionicPopup.show({
      title: 'Are you sure?',
      template: 'Are you sure you want to delete this outfit?',
      scope: $scope,
      buttons: [
        {
          text: '',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.removeItem(outfitId, items, index);
          }
        },
        {
          text: '',
          onTap: function(e) {
            return true;
          }
        }
      ]
    });

  }

  $scope.removeItem = function(outfitId, items, index){
    PostService.DeleteOutfit(outfitId).then(function(results) {
      if(results.error){
        $ionicLoading.show({ template: results.error.code, noBackdrop: true, duration: 1000 });
      } else{
        items.splice(index, 1);
      }
    });
  }

  // Form data for the upload modal
  $scope.uploadData = {};

  // Open the upload modal
  $rootScope.openProducts = function(tagId) {

    if(tagId){
      $scope.tagId = tagId;
    }

    // Create the upload modal that we will use later
    $ionicModal.fromTemplateUrl('templates/products.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.uploadProducts = modal;
      $scope.uploadProducts.show();
    });
  };

  // Triggered in the upload modal to close it
  $rootScope.closeProducts = function() {
    $scope.uploadProducts.remove();
    $scope.uploadProducts = {};
  };

  $scope.goToFollowing = function(){
    //#/app/user/{{userId}}/following
    $state.go('app.following', {});
  }

  $scope.goToFavourites = function(){
    //#/app/user/{{userId}}/following
    $state.go('app.favourites', {});
  }

  $scope.goToBrowse = function(){
    //#/app/user/{{userId}}/following
    $state.go('app.gender');
  }
  $scope.goToAccount = function(){
    $state.go('app.account');
  }

})

.controller('HeaderCtrl', function HeaderController( $rootScope, $scope, $state, $ionicPlatform, $ionicHistory, PostService) {

  $scope.celebrities = [];

  PostService.GetCelebrityNames().then(function(items){
        $scope.celebrities = items;
      });

  //When user types in the celebrity input
  //we search for celebrity names that match the user input
  //and add the matching names to the autocomplete
  $scope.onChange = function(term){
    var results = new Array();

    if(term){

      var searchTerm = term.toUpperCase();

      if ( $( ".bar.bar-subheader" ).is( ":hidden" ) ) {
        $scope.openSearch();
      }

      for (i = 0; i < $scope.celebrities.length; ++i) {
        var item = $scope.celebrities[i];
        var name = item.celebrity.toUpperCase();
        if (name.substring(0, searchTerm.length) === searchTerm) {
          results.push(item);
        }
      }

      $scope.results = results;

    } else{

      if($scope.platform == 'browser'){
        $scope.closeSearch();
      }

    }
  }

  //Opens celebrity search functionality
  $scope.openSearch = function(){
    $( ".bar.bar-subheader" ).slideDown( "fast" );

    //Binds event for back button
    $scope.deregisterSearch = $ionicPlatform.registerBackButtonAction(
      function() {
         $scope.closeSearch();
      }, 251);
    //$scope.$on('$destroy', $scope.deregisterSearch());
  }

  $scope.closeSearch = function(){
    $( ".bar.bar-subheader" ).slideUp( "fast" );
    $scope.searchTerm = "";
    $scope.results = {};
    //$scope.deregisterSearch();
  }

  $scope.toggleSearch = function(){
    if ( $( ".bar.bar-subheader" ).is( ":hidden" ) ) {
      $scope.openSearch();
    } else{
      $scope.closeSearch();
    }
  }

  $scope.onBlur = function(){
    $scope.results = {};
  }

  function setSearchResultsHeight(){
    var windowHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    var headerHeight = $(".bar-header").outerHeight();
    var subHeaderHeight = $("#txtSearch").outerHeight();

    var searchResultsHeight = windowHeight - headerHeight - subHeaderHeight;
    $('#searchResults').css('height', searchResultsHeight);
  }
  setSearchResultsHeight();

  $scope.goToCelebrity = function(item){
    $state.go('app.celebrity', {"name": item.celebrity, "item": item});
  };

  $scope.goToFeed = function(){
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.feed');
  };

  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      $scope.closeSearch();
  })

});
