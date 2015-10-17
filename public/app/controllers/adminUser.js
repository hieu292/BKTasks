app.controller('adminUserCtrl', function($scope,User,Confirm, $document){
    var section1 = angular.element(document.getElementById('section-1'));
    $scope.checkShowEdit = false;
    $scope.usernameRole = '';
    $scope.idUserRole = 0;
    User.getListUser().success(function (data) {
        $scope.listUser = data;
    });
    $scope.deleteUser = function (user, index) {
        Confirm({text: 'Are you sure you want to delete?'})
            .then(function () {
                $scope.listUser.splice(index,1);
                User.deleteUser(user).success(function (data) {
                    if(data.success){
                        alert(data.message);
                    }
                });
            });
    };
    $scope.editUser = function (user) {
        $scope.usernameRole = user.username;
        $scope.idUserRole = user.idUser;
        $document.scrollTo(section1, 30, 1000);
    };
    $scope.addRole = function () {
        var userSend = {
            username: $scope.usernameRole,
            idUser: $scope.idUserRole
        };
        User.addRole(userSend).success(function (data) {
            if(data.success){
                $scope.checkShowEdit = true;
                $scope.notifyEdit = true;
                $scope.message = data.message;
                $scope.usernameRole = '';
                $scope.idUserRole = 0;

            }else{
                $scope.checkShowEdit = true;
                $scope.notifyEdit = false;
                $scope.message = data.message;
            }
        });
    };

});