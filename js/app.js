function initMap() {
	var map_center = {lat: 34.147843, lng: -118.400035};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: map_center
	});

	var myLatLng = {lat: 34.147843, lng: -118.400035};
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: ''
	});

	var myLatLng = {lat: 34.147843, lng:  -118.391550};
	marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: ''
	});
}


