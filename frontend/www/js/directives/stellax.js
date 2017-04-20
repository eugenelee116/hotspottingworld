myApp.directive('parallax', function ($timeout) {
	return {
		restrict: 'A',
		link: function ($scope, $element, $attr) {

			$timeout(function () {
				$('.scroll').stellar({
			        scrollProperty: 'transform',
			        positionProperty: 'transform',
			        horizontalScrolling: false,
			        verticalOffset: -150
			    });
			});
		}
	};
});
