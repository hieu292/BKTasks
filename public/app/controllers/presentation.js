'use strict';
app
    // Profile Controller
    .controller('PresentationCtrl', [
        '$rootScope', '$scope','$location','Auth', function ($rootScope, $scope, $location, Auth) {
            if(!Auth.isLoggedIn())
            {
                $location.path('/welcome');
            }
            
        }
        ]);