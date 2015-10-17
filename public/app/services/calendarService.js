angular.module('calendarService',[])
.factory('Calendar', function($http){
	var CalendarFactory = {};
	CalendarFactory.createEvent = function(dataSend){
		return $http.post('/api/createEvent', dataSend)
		.success(function(data){
			if(data.success)
			{
				return data;
			}
		});
	};
	CalendarFactory.getAllEvents = function(){
		return $http.get('/api/getAllEvents');
	};
	CalendarFactory.getTodayEvents = function(){
		return $http.get('/api/getTodayEvents');
	};
	CalendarFactory.deleteEvent = function(index){

		return $http.post('/api/deleteEvent',index);

	};
	CalendarFactory.saveEvent = function(dataSend){
		return $http.post('/api/saveEvent', dataSend)
		.success(function(data){
			if(data.success)
			{
				return data;
			}
		});
	};

	return CalendarFactory;
});