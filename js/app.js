'use strict';

var initialLocations = [
	{
		title: 'Capella Salon',
		lat: 34.144981,
		lng: -118.414361
	},
	{
		title: 'Lemonade Studio City',
		lat: 34.143106,
		lng: -118.403175
	},
	{
		title: 'Universal CityWalk',
		lat: 34.136491,
		lng: -118.353186
	},
	{
		title: 'Crossfit Studio City',
		lat: 34.141580,
		lng: -118.387551
	},
	{
		title: 'Harvard-WestLake Film Festival',
		lat: 34.139548,
		lng: -118.412841
	},
	{
		title: 'SC Tattoo and Body Piercing',
		lat: 34.140534,
		lng: -118.371331
	},
	{
		title: 'Cactus Taqueria',
		lat: 34.150541,
		lng: -118.379208
	}
];

/* Google Maps API callback
*/
function initMap() {
	/* Defines default center of map
	   center is NOT a marker
	*/
	var mapCenter = {lat: 34.147843, lng: -118.400035};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: mapCenter
	});
	/* Declares helper variables
	*/
	var myLatLng;
	var marker;
	var loc;
	var locationsQnt = initialLocations.length;
	/* Gets objects from initialLocations array and 
	   uses its data to create markers
	*/
	for (var i = 0; i < locationsQnt; i++){
		loc = initialLocations[i];
		myLatLng = {lat: loc.lat, lng: loc.lng}
		marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: loc.title
		});
	}
}

/* Sets up data model for locations
*/
var Location = function(data){
	this.title = ko.observable(data.title);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
}

/* Sets up viewModel
*/
var ViewModel = function() {
	var self = this;
	/* Creates an empty observable array
	*/
	this.locationList = ko.observableArray([]);
	/* Populates the empty observable array with Location objects
	*/
	initialLocations.forEach(function(locationItem) {
		self.locationList.push( new Location(locationItem) );
	});
	//this.currentLocation = ko.observable(this.locationList()[0]);
}
/* Links view associations with ViewModel
*/
ko.applyBindings(new ViewModel());

