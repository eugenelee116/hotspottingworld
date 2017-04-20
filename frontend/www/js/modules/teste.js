angular.module( 'hotspotting.teste', [
  'ui.router',
  'angular-storage',
  'angular-jwt'
])
.config(function($stateProvider) {
  $stateProvider.state('app.teste', {
    url: '/teste',
    views: {
      'menuContent': {
        templateUrl: 'templates/teste.html',
        controller: 'TesteCtrl'
      }
    },
    data: {
      requiresLogin: true
    }
  });
})
.controller( 'TesteCtrl', function TesteController( $scope, $http, store, jwtHelper) {

  $scope.jwt = store.get('jwt');
  $scope.decodedJwt = jwtHelper.decodeToken($scope.jwt);

  $scope.callAnonymousApi = function() {
    // Just call the API as you'd do using $http
    callApi('Anonymous', 'http://localhost:3000/api/random-quote');
  }

  $scope.callSecuredApi = function() {
    callApi('Secured', 'http://localhost:3000/api/protected/random-quote');
  }

  function callApi(type, url) {
    $scope.response = null;
    $scope.api = type;
    $http({
      url: url,
      method: 'GET'
    }).then(function(quote) {
      $scope.response = quote.data;
    }, function(error) {
      $scope.response = error.data;
    });
  }

});
