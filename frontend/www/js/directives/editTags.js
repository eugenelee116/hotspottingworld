myApp.directive( 'editTags', function( $parse, $ionicActionSheet ) {
   return {
       restrict: 'A',
       link: function( $scope, elem, attrs ) {
          elem.bind('load', function() {
            $scope.busy = false;
            $("#loadingMore").hide();
            //$scope.addTags(elem, attrs);
            addTags(elem, attrs);
          });

        function addTags(elem, attrs){

          var tags = JSON.parse(attrs.tags);
          var data = [];
          var options = {
              align:{
                x:'center',y:'center'
              },
              offset:{
                left:0,
                top:70
              },
              edit:true
            };

            for (i = 0; i < tags.length; i++) {
              data.push({
                x: tags[i].position_x,
                y: tags[i].position_y,
                text: tags[i].garment_id.toString(),
                look: tags[i].look_url,
                less: tags[i].less_url
              });
            }
            printData(data);

            var tags = elem.taggd(options, data);
            tags.on('change',function(){
              data=tags.data;
              printData(data);
            });
            //tags.show();
        }

        function showActionSheet(look, less) {

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
            buttons: [
              { text: 'BUY' },
              { text: 'BUY FOR LESS' }
            ],
            cancelText: 'Cancel',
            cancel: function() {
              // add cancel code..
            },
            buttonClicked: function(index) {

              switch (index){
                case 0:
                  console.log(look);
                  //var ref = cordova.InAppBrowser.open(look, '_blank', 'location=yes');
                  var ref = cordova.ThemeableBrowser.open(look, '_blank', props);

                  break;
                case 1:
                  console.log(less);
                  //var ref = cordova.InAppBrowser.open(less, '_blank', 'location=yes');
                  var ref = cordova.ThemeableBrowser.open(less, '_blank', props);

                  break;
              }

              return false;
            }
          });
        }

        function printData(data){
          var json=null;
          //var minify=outputOptionMinify.get(0).checked;
          //if(minify)json=JSON.stringify(data);else json=JSON.stringify(data,null,'\t');
          json=JSON.stringify(data);
          $('#output').val(json);
        }

       }
    }
})
