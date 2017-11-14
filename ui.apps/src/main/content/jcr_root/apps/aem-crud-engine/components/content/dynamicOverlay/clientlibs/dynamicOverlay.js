angular.module("OverlayModule",[])
	.controller("overlayCtrl", [ '$scope', 'pass', 'close', '$timeout', function($scope, pass, close, $timeout){
    	$scope.pass = pass;

		$timeout(function(){
			$("#input_results").DataTable();
		},500);

		$scope.close = function(){
			close(null, 500);
		}
	}]);
