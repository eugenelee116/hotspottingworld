angular.module( 'hotspotting.products', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('app.products', {
    url: '/products',
    views: {
      'menuContent': {
        templateUrl: 'templates/products.html',
        controller: 'ProductsCtrl'
      }
    },
    data: {
      requiresLogin: false
    }
  });
})
.controller( 'ProductsCtrl', function ProductsController( $rootScope, $scope, $state, multipartForm, $ionicLoading, $compile, $timeout, PostService) {

  $scope.mainProduct = {};
  $scope.products = {};

  if($scope.tagId){
    PostService.GetProducts($scope.tagId).then(function(items){
      $scope.products = items;
      $scope.mainProduct = items[0];
    });
  }

  $scope.goToBuy = function(url){
    $rootScope.closeProducts();
    $state.go('app.buy', {"url": url});
  }

  $scope.swapProduct = function(product){
    $scope.mainProduct = product;
  }

});
