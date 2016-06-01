'use strict';

var locations = [
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
		title: 'Studio City Tattoo and Body Piercing',
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
	var location;
	var locationsQnt = locations.length;
	/* Gets objects from locations array and 
	   uses its data to create markers
	*/
	for (var i = 0; i < locationsQnt; i++){
		location = locations[i];
		myLatLng = {lat: location.lat, lng: location.lng}
		marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: location.title
		});
	}
}


