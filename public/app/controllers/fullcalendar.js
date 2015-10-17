app.controller('FullcalendarCtrl', function ($scope, $location, Auth, Calendar, Confirm, socketio, $document) {
    if (!Auth.isLoggedIn()) {
        $location.path('/welcome');
    }
    $scope.ismeridian = false;
    $scope.events = [];
    /* event sources array*/
    $scope.eventSources = [$scope.events];
    var temp = [];

    Calendar.getAllEvents()
        .then(function (data) {
            angular.forEach(data.data, function (value, key) {
                this.push(value._id);
            }, temp);
            angular.forEach(data.data, function (value, key) {
                delete value._id;
                delete value.__v;
                delete value.creator;
                this.push(value);
            }, $scope.events);

        });
    /* alert on dayClick */
    $scope.precision = 400;
    $scope.lastClickTime = 0;
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        var time = new Date().getTime();
        if (time - $scope.lastClickTime <= $scope.precision) {
            $scope.events.push({
                title: 'New Event',
                start: date,
                className: ['b-l b-2x b-info']
            });
        }
        $scope.lastClickTime = time;
    };
    /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    $scope.overlay = $('.fc-overlay');
    $scope.alertOnMouseOver = function (event, jsEvent, view) {
        $scope.event = event;
        $scope.overlay.removeClass('left right').find('.arrow').removeClass('left right top pull-up');
        var wrap = $(jsEvent.target).closest('.fc-event');
        var cal = wrap.closest('.calendar');
        var left = wrap.offset().left - cal.offset().left;
        var right = cal.width() - (wrap.offset().left - cal.offset().left + wrap.width());
        if (right > $scope.overlay.width()) {
            $scope.overlay.addClass('left').find('.arrow').addClass('left pull-up')
        } else if (left > $scope.overlay.width()) {
            $scope.overlay.addClass('right').find('.arrow').addClass('right pull-up');
        } else {
            $scope.overlay.find('.arrow').addClass('top');
        }
        (wrap.find('.fc-overlay').length == 0) && wrap.append($scope.overlay);
    }

    /* config object */
    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            dayClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventMouseover: $scope.alertOnMouseOver
        }
    };


    /* remove event */
    $scope.remove = function (index) {
        Confirm({text: 'Are you sure you want to delete?'})
            .then(function () {
                Calendar.deleteEvent({id: temp[index]});
                $scope.events.splice(index, 1);
            });

    };

    /* Change View */
    $scope.changeView = function (view, calendar) {
        $('.calendar').fullCalendar('changeView', view);
    };

    $scope.today = function (calendar) {
        $('.calendar').fullCalendar('today');
    };

    var date = new Date();
    var timezone = -(date.getTimezoneOffset()/60);
    $scope.checkallDay = true;
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    $scope.mystarttime = new Date();
    $scope.myendtime = new Date();
    $scope.checkShowEdit = false;
    $scope.notifyEdit = {
        checkSuccess: true,
        message: ''
    };


    $scope.ismeridian = false;

    $scope.saveEvent = function (index) {
        if ($scope.events[index].title == '') {
            alert("Name Event can't be blank");
        } else if ($scope.events[index].info === undefined || $scope.events[index].info.length <= 10) {
            alert("Info Event must more than 10 characters to describe");
        } else {
            var startchange = $scope.events[index].start;
            startchange.setHours(startchange.getHours() + timezone);
            var endchange = $scope.events[index].end;
            endchange.setHours(endchange.getHours() + timezone);
            var dataShare = {
                id: temp[index],
                data: {
                    title: $scope.events[index].title,
                    info: $scope.events[index].info,
                    start: startchange.toISOString(),
                    end: endchange.toISOString(),
                    allDay: $scope.events[index].allDay
                }
            };

            Calendar.saveEvent(dataShare)
                .success(function (data) {
                    if (data.success)
                        alert("Your event Saved OK!");
                    else
                        alert("Some Problem, Your events didn't save!");
                });
        }

    };

    $scope.createEvent = function () {
        var newstartDate = new Date($scope.startDate.getFullYear() ,$scope.startDate.getMonth(), $scope.startDate.getDate(), $scope.mystarttime.getHours() + timezone,$scope.mystarttime.getMinutes());
        var newendDate = new Date($scope.endDate.getFullYear() ,$scope.endDate.getMonth(), $scope.endDate.getDate(), $scope.myendtime.getHours() + timezone,$scope.myendtime.getMinutes());
        if ($scope.nameEvent == '') {
            $scope.notifyEdit.message = "Name Event can't be blank";
            $scope.notifyEdit.checkSuccess = false;
            $scope.checkShowEdit = true;
        } else if ($scope.infoEvent === undefined || $scope.infoEvent.length <= 10) {
            $scope.notifyEdit.message = "Info Event must more than 10 characters to describe";
            $scope.notifyEdit.checkSuccess = false;
            $scope.checkShowEdit = true;
        } else {
            var dataShare = {
                title: $scope.nameEvent,
                info: $scope.infoEvent,
                start: newstartDate.toISOString(),
                end: newendDate.toISOString(),
                allDay: $scope.checkallDay
            };
            Calendar.createEvent(dataShare)
            .success(function(data){
                if (data.success) {
                    $scope.notifyEdit.message = data.message;
                    $scope.notifyEdit.checkSuccess = true;
                    $scope.checkShowEdit = true;
                    $scope.nameEvent = '';
                    $scope.infoEvent = '';
                    $scope.startDate = new Date();
                    $scope.endDate = new Date();
                    var section1 = angular.element(document.getElementById('section-1'));
                    $document.scrollTo(section1, 30, 1000);
                };
            });

        }
    };

    socketio.on('createEvent', function (data) {
        $scope.events.unshift(data);
    });

});
