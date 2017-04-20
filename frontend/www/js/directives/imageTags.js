myApp.directive( 'imageTags', function( $rootScope, $window, $parse, $ionicActionSheet, $state ) {
   return {
       restrict: 'A',
       link: function( $scope, elem, attrs ) {
          elem.bind('load', function() {
            $scope.busy = false;
            $("#loadingMore").hide();
            addTags(elem, attrs);
          });

        function addTags(elem, attrs){

          var tags = JSON.parse(attrs.tags);
          var data = [];
          var options = {
              align: {
                x: 'left',
                y: 'center'
              },
              offset: {
                left: 45,
              },
              handlers: {
                click: function( e, data ) {
                  //showActionSheet(data.look, data.less);
                  $rootScope.openProducts(data.tagId);
                },
                /*
                mouseenter: 'show',
                mouseleave: 'hide'
                */
              }
            };

            for (i = 0; i < tags.length; i++) {
              data.push({
                x: tags[i].position_x,
                y: tags[i].position_y,
                text: tags[i].garment,
                look: tags[i].look_url,
                less: tags[i].less_url,
                icon: tags[i].svg_icon,
                tagId: tags[i].id_tag
              });
            }

            var tags = elem.taggd(options, data);
            //tags.show();
        }

        function showActionSheet(look, less) {

          var btns = [];
          if(look.length>0){
            btns.push({ text: 'BUY' });
          }
          if(less.length>0){
            btns.push({ text: 'BUY FOR LESS' });
          }

          var props = {
            statusbar: {
              color: '#1B1A1A'
            },
            toolbar: {
              height: 44,
              color: '#1B1A1A'
            },
            title: {
              color: '#ffffff',
              showPageTitle: true
            },
            closeButton: {
              image: 'close',
              imagePressed: 'close_pressed',
              align: 'right',
              event: 'closePressed'
            },
            customButtons: [
              {
                image: 'launcher',
                imagePressed: 'launcher_pressed',
                align: 'left',
                event: 'sharePressed'
              }
            ],
            "browserProgress": {
              "showProgress": true,
              "progressBgColor": "#016585",
              "progressColor": "#FFAA16"
            },
            backButtonCanClose: true
          };

         // Show the action sheet
          var hideSheet = $ionicActionSheet.show({
            buttons: btns,
            cancelText: 'Cancel',
            cancel: function() {
              // add cancel code..
            },
            buttonClicked: function(index) {

              switch (index){
                case 0:
                  if ($rootScope.platform == 'webview'){
                    var ref = cordova.ThemeableBrowser.open(look, '_blank', props);
                  } else{
                    if(look.length>0){
                      //$window.open(look, '_blank');
                      $state.go('app.buy', {"url": look});
                    } else{
                      //$window.open(less, '_blank');
                      $state.go('app.buy', {"url": less});
                    }
                  }
                  break;
                case 1:
                  if ($rootScope.platform == 'webview'){
                    var ref = cordova.ThemeableBrowser.open(less, '_blank', props);
                  } else{
                    //$window.open(less, '_blank');
                    $state.go('app.buy', {"url": less});
                  }

                  break;
              }

              return false;
            }
          });
        }

       }
    }
})
