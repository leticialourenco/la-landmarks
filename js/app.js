'use strict';

var initialLocations = [
	{
		title: 'Grand Canyon',
		lat: 34.144981,
		lng: -118.414361,
		category: 'shop'
	},
	{
		title: 'New York City',
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
		title: 'Yellowstone National Park',
		lat: 34.141580,
		lng: -118.387551,
		category: 'gym'
	},
	{
		title: 'Hollywood',
		lat: 34.139548,
		lng: -118.412841,
		category: 'entertainment'
	},
	{
		title: 'Hollywood Walk of Fame',
		lat: 34.140534,
		lng: -118.371331,
		category: 'shop'
	},
	{
		title: 'Pakjsjhdfris',
		lat: 34.150541,
		lng: -118.379208,
		category: 'restaurant'
	}
];

/* Returns the first element within one object
 */
function first(obj) {
    for (var a in obj) return a;
}
/* Manages the window where the wikipedia 
 * content is displayed
 */
function displayWikipediaBox() {
	$('#wikipediaBox').show();
}
function closeWikipediaBox() {
	$('#wikipediaBox').hide();
}
/* Load wikipedia data of a location and 
 * display it on the view
 */
function loadWikipediaData(locationObj) {  
	/*
	 */
	displayWikipediaBox();
	/* Clear element of previous information
	 * and append a header containint locationObj title
	 */
	$('#wikipediaContent').text('');
	$('#wikipediaContent').append('<span>' + locationObj.title + '</span>');  	
	/*
	 */	
	var locationQuery = locationObj.title.split(' ').join('+'); 
	var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info%7Cpageimages&list=&iwurl=1&titles=' + 
	locationQuery + '&inprop=url&piprop=original';
	/* Handles error for the ajax request
	 */
	var wikiRequestTimeout = setTimeout(function(){
		$('#wikipediaContent').text('');
        $('#wikipediaContent').append('<p class="error">Failes to get Wikipedia resources</p>');
    }, 3000);

	$.ajax({
       url: wikiUrl,
       dataType: "jsonp",
       success: function(response) {
       		/* Gets data from the response JSON and
       		 * assembles the HTML to be rendered
       		 */
       	    var pageId = first(response.query.pages);
            var pageObj = response.query.pages[pageId];
            var url = pageObj.fullurl;    
            var imgSrc = pageObj.thumbnail.original;
            var wikipediaHTMLInfo = '<img class="thumbnail" src="' + imgSrc + '">' +
    							 	'<a href="' + url + '" target="_blank" class="btn btn-primary btn-box">' + 
    							  	' Read Article</a>';
    		$('#wikipediaContent').append(wikipediaHTMLInfo);            
            clearTimeout(wikiRequestTimeout);
       }
    });
}

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
		self.infowindow.setContent('<span class="markerTitle">' + locationObj.title + '</span>');
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
	 * Call the loadWikipediaData to get wikipedia content
	 * referent to the clicked location
	 */
	this.openInfo = function(clickedLocation) {
		google.maps.event.trigger(map.mapMarkers[clickedLocation.index()], 'click');
		loadWikipediaData(initialLocations[clickedLocation.index()]);
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
		closeWikipediaBox();
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
		closeWikipediaBox();
	};
};

/* Links view associations with ViewModel
 */
var viewModel = new ViewModel();
viewModel.query.subscribe(viewModel.liveSearch);
ko.applyBindings( viewModel );
