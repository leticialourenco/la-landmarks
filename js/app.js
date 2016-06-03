'use strict';

var initialLocations = [
	{
		title: 'Capella Salon',
		lat: 34.144981,
		lng: -118.414361,
		category: 'shop',
		index: 0
	},
	{
		title: 'Lemonade Studio City',
		lat: 34.143106,
		lng: -118.403175,
		category: 'restaurant',
		index: 1
	},
	{
		title: 'Universal CityWalk',
		lat: 34.136491,
		lng: -118.353186,
		category: 'entertainment',
		index: 2
	},
	{
		title: 'Crossfit Studio City',
		lat: 34.141580,
		lng: -118.387551,
		category: 'gym',
		index: 3
	},
	{
		title: 'Harvard-WestLake Film Festival',
		lat: 34.139548,
		lng: -118.412841,
		category: 'entertainment',
		index: 4
	},
	{
		title: 'SC Tattoo and Body Piercing',
		lat: 34.140534,
		lng: -118.371331,
		category: 'shop',
		index: 5
	},
	{
		title: 'Cactus Taqueria',
		lat: 34.150541,
		lng: -118.379208,
		category: 'restaurant',
		index: 6
	}
];

var GoogleMap = function() {
	this.map = {};
	this.mapMarkers = [];
	this.initMap();
	this.infowindow = new google.maps.InfoWindow({
		content: ''
	});
};

GoogleMap.prototype.initMap = function() {
	var mapCenter = { lat: 34.150332, lng: -118.387729 };
	this.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: mapCenter
	});	
};

GoogleMap.prototype.addMarker = function(locationObj) {	
	var self = this;
	var coords = { lat: locationObj.lat, lng: locationObj.lng }
	
	var marker = new google.maps.Marker({
		position: coords,
		map: this.map,
		title: locationObj.title
	});
	
	marker.addListener('click', function() {
		self.infowindow.setContent(locationObj.title);
		self.infowindow.open(this.map, this);
	});
				
	this.mapMarkers.push(marker);
};

GoogleMap.prototype.setAllMap = function(map) {
	for (var i = 0; i < this.mapMarkers.length; i++) {
		this.mapMarkers[i].setMap(map);
	}
};

GoogleMap.prototype.clearMarkers = function() {
	this.setAllMap(null);
};

GoogleMap.prototype.showMarkers = function() {
	this.setAllMap(this.map);
};

GoogleMap.prototype.deleteMarkers = function() {
	this.clearMarkers();
	this.mapMarkers = [];
};

GoogleMap.prototype.populateMarkers = function() {
	for(var i=0; i<initialLocations.length; i++){
		this.addMarker(initialLocations[i]);
	}
}

var gmap = new GoogleMap;
gmap.populateMarkers();

var Location = function(data) {
	this.title = ko.observable(data.title);
	this.category = ko.observable(data.category);
	this.index = ko.observable(data.index);
}

var ViewModel = function() {
	var self = this;

	this.locationList = ko.observableArray([]);

	initialLocations.forEach(function(locationObj) {
		self.locationList.push( new Location(locationObj) );
	});

	this.currentLocation = ko.observable();

	this.openInfo = function(clickedLocation) {
		google.maps.event.trigger(gmap.mapMarkers[clickedLocation.index()], 'click');
	};

	this.filterByClass = function(clickedCategory) {

	};
}

ko.applyBindings( new ViewModel() );
