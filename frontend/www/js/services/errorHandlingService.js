myApp.service('multipartForm', ['$http', function($http){

	return {
		GetErrorMessage: function(code){

			switch (code) {
            	case 'ER_DUP_ENTRY':
					return "Image already exists";
                case 'ER_BAD_FIELD_ERROR':
					return "ER_BAD_FIELD_ERROR";
                case 'yesterdayAm':
                    return 3;
              	case 'yesterdayPm':
                    return 4;
                }

		}
	}

}]);
