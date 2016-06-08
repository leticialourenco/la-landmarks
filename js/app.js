'use strict';

var initialLocations = [
	{
		title: 'Universal Studios Hollywood',
		lat: 34.136518,
		lng: -118.356051,
		category: 'entertainment'
	},
	{
		title: 'Griffith Observatory',
		lat: 34.11856,
		lng: -118.30037,
		category: 'science'
	},
	{
		title: 'Hollywood Boulevard',
		lat: 34.101604,
		lng: -118.333285,
		category: 'entertainment'
	},
	{
		title: 'Getty Center',
		lat: 34.078019,
		lng: -118.474106,
		category: 'art'
	},
	{
		title: 'Hollywood Walk of Fame',
		lat: 34.101514,
		lng: -118.326839,
		category: 'entertainment'
	},
	{
		title: 'Walt Disney Concert Hall',
		lat: 34.055341,
		lng: -118.249847,
		category: 'entertainment'
	},
	{
		title: 'Dodger Stadium',
		lat: 34.073839,
		lng: -118.239953,
		category: 'sport'
	},
	{
		title: 'Los Angeles County Museum of Art',
		lat: 34.063932,
		lng: -118.359240,
		category: 'art'
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
	var mapCenter = { lat: 34.039809, lng: -118.308810 };
	var zoom = 12;
	/* Define different center for larger screens
	 */
	if ($(window).width() > 600) { 
		mapCenter = { lat: 33.974880, lng: -118.300283 };
		if ($(window).width() > 1600) { zoom = 13; }
	}
	/* Create a map object
	 */
	this.map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoom,
		center: mapCenter,
		draggable: true
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
		this.setAnimation(google.maps.Animation.BOUNCE);
		/* Cuts the animation time
		 */ 
		setTimeout(function () {
		    marker.setAnimation(null);
		}, 700);
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
		self.loadWikipediaData(initialLocations[clickedLocation.index()]);
		/* Hide the sidebar on mobiles to give room for the info
		 */
		if ($(window).width() < 992) {
			self.hideSidebar();
		}
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
		self.hideWikipediaBox();
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
		self.hideWikipediaBox();
	};

	this.loadWikipediaData = function (locationObj) {
		self.showWikipediaBox();
		/* Clear element of previous information
		 * and append a header containint locationObj title
		 */
		$('#wikipediaContent').text('');
		$('#wikipediaContent').append('<span>' + locationObj.title + '</span>');  	
		/* Prepares the wikipedias' URl for the AJAX request
		 */	
		var locationQuery = locationObj.title.split(' ').join('+'); 
		var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info%7Cpageimages&titles='
		+ locationQuery + '&inprop=url&piprop=thumbnail&pithumbsize=300';
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
	       	    var pageId = self.first(response.query.pages);
	            var pageObj = response.query.pages[pageId];
	            var url = pageObj.fullurl;    
	            var imgSrc = pageObj.thumbnail.source;
	            var wikipediaHTMLInfo = '<img class="thumbnail" src="' + imgSrc + '">' +
	    							 	'<a href="' + url + '" target="_blank" class="btn btn-primary btn-box">' + 
	    							  	' Read Article</a>';
	    		$('#wikipediaContent').append(wikipediaHTMLInfo);            
	            clearTimeout(wikiRequestTimeout);
	       }
	    });
	}

	this.first = function(obj) {
		for(var i in obj) return i;
	};

	this.showWikipediaBox = function () {
		$('#wikipediaBox').show();
	};

	this.hideWikipediaBox = function () {
		$('#wikipediaBox').hide();
	};

	this.showSidebar = function () {
		$('.sidebar').show();
		$('.mobile-header').hide();
		self.hideWikipediaBox();
	};

	this.hideSidebar = function () {
		$('.sidebar').hide();
		$('.mobile-header').show();
	};
	/* Refresh page when window is resized
	 */
	$(window).resize(function(){location.reload();});
};

/* Links view associations with ViewModel
 */
var viewModel = new ViewModel();
viewModel.query.subscribe(viewModel.liveSearch);
ko.applyBindings( viewModel );
