'use strict';

var initialLocations = [
	{
		title: 'Capella Salon',
		lat: 34.144981,
		lng: -118.414361,
		index: 0
	},
	{
		title: 'Lemonade Studio City',
		lat: 34.143106,
		lng: -118.403175,
		index: 1
	},
	{
		title: 'Universal CityWalk',
		lat: 34.136491,
		lng: -118.353186,
		index: 2
	},
	{
		title: 'Crossfit Studio City',
		lat: 34.141580,
		lng: -118.387551,
		index: 3
	},
	{
		title: 'Harvard-WestLake Film Festival',
		lat: 34.139548,
		lng: -118.412841,
		index: 4
	},
	{
		title: 'SC Tattoo and Body Piercing',
		lat: 34.140534,
		lng: -118.371331,
		index: 5
	},
	{
		title: 'Cactus Taqueria',
		lat: 34.150541,
		lng: -118.379208,
		index: 6
	}
];

/* Helper array to store markers objects
 * to be used combined with the index
 */
var markerArray = [];
/* Google Maps API callback
 */
function initMap() {
	/* Defines default center of map
	 * center is NOT a marker
	 */
	var mapCenter = {lat: 34.150332, lng: -118.387729};
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
	var infowindow = null;
	/* Blank pre-setup for the infowindow
	 */
	infowindow = new google.maps.InfoWindow({
		content: ''
	});
	/* Gets objects from initialLocations array and 
	 *  uses its data to create markers
	 */
	for (var i = 0; i < locationsQnt; i++){
		/* Gets values from the JSON data
		 * and store 'em on vars
		 */
		loc = initialLocations[i];
		myLatLng = {lat: loc.lat, lng: loc.lng}
		/* Creates a marker each iteration
		 * containing the data from initialLocations
		 */
		marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: loc.title
		});
		/* Creates a listener to each marker
		 * to be opened its infowindow on click event
		 */
		marker.addListener('click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});
		/* Add marker to markerArray helper
		 */
		markerArray.push(marker);
	}
}

/* Sets up data model for locations
 */
var Location = function(data) {
	this.title = ko.observable(data.title);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.index = ko.observable(data.index);
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
	/* Declares a variable (no parameter needed)
 	 */
	this.currentLocation = ko.observable();
	/* Called when some location on the view list is clicked
	 * triggers a click event on the clickedLocation marker
	 */
	this.openInfo = function(clickedLocation) {
		google.maps.event.trigger(markerArray[clickedLocation.index()], 'click');
	};
}
/* Links view associations with ViewModel
 */
ko.applyBindings( new ViewModel() );

