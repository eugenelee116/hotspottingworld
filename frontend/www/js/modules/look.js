angular.module( 'hotspotting.look', [
  'ui.router'
])
.config(function($stateProvider) {
  $stateProvider.state('app.look', {
    url: '/look',
    views: {
      'menuContent': {
        templateUrl: 'templates/look.html',
        controller: 'LookCtrl'
      }
    },
    params: {'look': null},
    data: {
      requiresLogin: false
    }
  });
})
.controller( 'LookCtrl', function LookController( $scope, $stateParams ) {


  $scope.url = $stateParams.look;
  console.log($scope.url);

  /*$(document).ready(function() {
    $(".main-container").html("<iframe src='"+$scope.url+"' width='100%' height='100%'><iframe>");
  });*/
});
