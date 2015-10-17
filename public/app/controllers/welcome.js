'use strict';
app
.controller('modalCtrl',['$scope', '$modal', '$log','$location', 'Auth', 'User', function ($scope, $modal, $log, $location, Auth, User) {

    if(Auth.isLoggedIn())
    {
        $location.path('app/main');
    }
    $scope.user = {
        name: '',
        username: '',
        password: '',
        email: '',
        images: ''
        

    };
    
    $scope.openlogin = function () {

        $modal.open({
            templateUrl: 'loginModal',
            backdrop: true,
            windowClass: 'modal',
            controller: function ($scope, $modalInstance, $log, $location, user, Auth) {
                $scope.notify = '',
                $scope.user = user;
                $scope.submit = function () {
                    Auth.login(user.username, user.password)
                        .success(function(data){
                            if(data.success)
                                {
                                    $location.path('/app/main');
                                    $modalInstance.dismiss('cancel');
                                }
                            else
                                return  $scope.notify = data.message;
                        });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });

    };
    $scope.opensignup = function () {

        $modal.open({
            templateUrl: 'signupModal',
            backdrop: true,
            windowClass: 'modal',
            controller: function ($scope, $modalInstance, $log, User, user) {
                $scope.items = {
                    availableOptions:[
                    {key: "cat", value: "assets/img/avatars/Cat.jpg"},
                    {key: "dog", value: "assets/img/avatars/dog.png"},
                    {key: "bird", value: "assets/img/avatars/bird.jpg"},
                    {key: "chicken", value: "assets/img/avatars/chicken.png"}
                    ],
                    selectedOption: {key: "cat", value: "assets/img/avatars/bing.png"}
                };
                $scope.notify = '',
                $scope.user = user;
                $scope.submit = function () {
                    user.images = $scope.items.selectedOption.value;
                    User.create(user)
                        .success(function(data){
                            if(data.success)
                                {
                                    alert(data.message + " Click login to use!");
                                    user.username = '';
                                    user.password = '';
                                    $modalInstance.dismiss('cancel');
                                }
                            else
                                return  $scope.notify = data.message;

                        });

                }
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            resolve: {
                user: function () {
                    return $scope.user;
                }
            }
        });

};
}
]);
