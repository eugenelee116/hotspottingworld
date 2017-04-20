angular.module( 'hotspotting.buy', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('app.buy', {
    url: '/buy',
    views: {
      'menuContent': {
        templateUrl: 'templates/buy.html',
        controller: 'BuyCtrl'
      }
    },
    data: {
      requiresLogin: false
    },
    params: {
        url: null
    }
  });
})
.controller( 'BuyCtrl', function BuyController( $scope, $stateParams, $sce) {

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.url = {src:$stateParams.url, title:"Egghead.io AngularJS Binding"};

});
