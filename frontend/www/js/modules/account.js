angular.module( 'hotspotting.account', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    },
    data: {
      requiresLogin: true
    }
  });
})
.controller( 'AccountCtrl', function AccountController( $rootScope, $scope, $state, $ionicLoading, multipartForm, store) {

  $scope.accountInfo = {"fullname": "", "email": ""};
  $scope.accountInfo.fullname = $rootScope.user.fullname;
  $scope.accountInfo.email = $rootScope.user.email;

  $scope.UpdateAccount = function(){

    multipartForm.UpdateAccount($scope.accountInfo, $rootScope.user.userId).then(function(response) {
      if(response.error){
        $ionicLoading.show({ template: response.error.code, noBackdrop: true, duration: 1000 });
      } else{
        $ionicLoading.show({ template: "Account saved!", noBackdrop: true, duration: 1000 });

        var jwt = response.data.id_token;
        $rootScope.initUser(jwt);
        store.set('jwt', jwt);
        console.log($rootScope.user.picture);
      }
    });
  }

  $scope.returnToFeed = function(){
    $state.go('app.feed');
    //window.location.href = "#/app/fedd";
  }

  $scope.triggerLoadPicture = function(){
    $( "#input-picture" ).trigger( "click" );
  }

  var inputPicture = $('#input-picture');
  inputPicture.change(function() {
    var el=inputPicture.get(0);
    if(el.files.length>0){
      loadPreview(el.files[0])

    }
  });

  function loadPreview(file){
    var i= 0,
    reader=new FileReader();

    reader.onloadend=function(){

      var img=new Image();
      img.src=reader.result;
      inputPicture.attr('src', img.src);

      $('#img-picture').attr('src', img.src);

    };
    reader.readAsDataURL(file);
  }

});
