'use strict';

var initialLocations = [
	{
		title: 'Capella Salon',
		lat: 34.144981,
		lng: -118.414361,
		category: 'shop'
	},
	{
		title: 'Lemonade Studio City',
		lat: 34.143106,
		lng: -118.403175,
		category: 'restaurant'
	},
	{
		title: 'Universal CityWalk',
		lat: 34.136491,
		lng: -118.353186,
		category: 'entertainment'
	},
	{
		title: 'Crossfit Studio City',
		lat: 34.141580,
		lng: -118.387551,
		category: 'gym'
	},
	{
		title: 'Harvard-WestLake Film Festival',
		lat: 34.139548,
		lng: -118.412841,
		category: 'entertainment'
	},
	{
		title: 'SC Tattoo and Body Piercing',
		lat: 34.140534,
		lng: -118.371331,
		category: 'shop'
	},
	{
		title: 'Cactus Taqueria',
		lat: 34.150541,
		lng: -118.379208,
		category: 'restaurant'
	}
];

/* Set up map model
 */
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
	/* Create map object
	 */
	this.map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: mapCenter
	});	
};

GoogleMap.prototype.addMarker = function(locationObj, index) {	
	var self = this;
	var coords = { lat: locationObj.lat, lng: locationObj.lng }
	/* Create marker object
	 */
	var marker = new google.maps.Marker({
		position: coords,
		map: this.map,
		title: locationObj.title,
		index: index
	});
	/* Create an infowindow for the new marker
	 * getting its content from the object provided
	 */
	marker.addListener('click', function() {
		self.infowindow.setContent(locationObj.title);
		self.infowindow.open(this.map, this);
	});
	/* Add newly created Marker instance to mapMarkers array
	 */			
	this.mapMarkers.push(marker);
};
/* Renders the map creating markers using 
 * mapMarkers array data
 */
GoogleMap.prototype.setAllMap = function(map) {
	for (var i in this.mapMarkers) {
		this.mapMarkers[i].setMap(map);
	}
};
/* Renders the map as null (no markers)
 */
GoogleMap.prototype.clearMarkers = function() {
	this.setAllMap(null);
};
/* Re-renders the map
 */
GoogleMap.prototype.showMarkers = function() {
	this.setAllMap(this.map);
};
/* Clear the mapMarkers array (similar to "array = [];")
 */
GoogleMap.prototype.deleteMarkers = function() {
	this.clearMarkers();
	this.mapMarkers.splice(0, this.mapMarkers.length);
};
/* Loop thru the initialLocations array adding all
 * the elements to the markers array
 */
GoogleMap.prototype.loadMarkers = function() {
	for (var i in initialLocations) {
		this.addMarker(initialLocations[i], i);
	}
};
/* Add markers to the mapMarkers array by filtering 'em
 * by category provided as parameter
 */
GoogleMap.prototype.populateMarkersByCategory = function(category) {
	/* Empty previous markers data before filtering
	 */
	this.deleteMarkers();
	/* Load markers in case of category being All
	 */
	if (category === "all") {
		this.loadMarkers();
	}
	/* Loop thru the initialLocations array, add elements with 
	 * similar category to the marker array, followed by a number 
	 * (its position on the array) to facilitate the infoWindows
	 * to be opened also by clicking on the sidebar list elements
	 */
	else {
		var positionOnArray = 0;
		for (var i in initialLocations) {
			if (initialLocations[i].category === category) {
				this.addMarker(initialLocations[i], positionOnArray);
				positionOnArray++;
			}
		}
	}
};

GoogleMap.prototype.populateMarkersBySearch = function(searchQuery) {
	/* Empty previous markers data before filtering
	 */
	this.deleteMarkers();
	/* Load markers in case of empty search query
	 */
	if (searchQuery === '') {
		this.loadMarkers();
	}
	/* Loop thru the initialLocations array, add elements with 
	 * similar category to the marker array, followed by a number 
	 * (its position on the array) to facilitate the infoWindows
	 * to be opened also by clicking on the sidebar list elements
	 */
	else {
		var positionOnArray = 0;
		for (var i in initialLocations) {
			if (initialLocations[i].title.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0) {
				this.addMarker(initialLocations[i], positionOnArray);
				positionOnArray++;
			}
		}	
	}
};
/* Creates an instance of GoogleMap
 */
var map = new GoogleMap;

/* Sets up data model for locations
 */
var Location = function(data) {
	this.title = ko.observable(data.title);
	this.category = ko.observable(data.category);
	this.index = ko.observable(data.index);
};

var ViewModel = function() {
	var self = this;
	/* Called when some location on the view list is clicked
	 * triggers a click event on the clickedLocation marker
	 */
	this.openInfo = function(clickedLocation) {
		google.maps.event.trigger(map.mapMarkers[clickedLocation.index()], 'click');
	};
	/* Repopulates the sidebar list with data stored
	 * on google maps mapMarkers array (already filtered)
	 * eliminating the need of filtering again for the list
	 */
	this.pushMarkersIntoList = function() {
		map.mapMarkers.forEach(function(locationObj) {
			self.locationList.push( new Location(locationObj) );
		});
	};
	
	this.locationList = ko.observableArray([]);
	/* Sends the name of the category collected thru binding
	 * to populateMarkersByCategory on the Google Maps object.
	 * Clean sidebar list and repopulate it with current markers
	 */
	this.filterByCategory = function(clickedCategory) {
		map.populateMarkersByCategory(clickedCategory);
		self.locationList.removeAll();
		self.pushMarkersIntoList();

	};

	this.query = ko.observable('');
	/* Sends the search query collected thru observable var
	 * to populateMarkers on the Google Maps object.
	 * Clean sidebar list and repopulate it with current markers
	 */
	this.liveSearch = function(searchQuery) {
		map.populateMarkersBySearch(searchQuery);
		self.locationList.removeAll();
		self.pushMarkersIntoList();	
	};
};

/* Links view associations with ViewModel
 */
var viewModel = new ViewModel();
viewModel.query.subscribe(viewModel.liveSearch);
ko.applyBindings( viewModel );
