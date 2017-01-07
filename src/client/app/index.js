import React from 'react';
import ReactDOM from 'react-dom';

var foursquare = require('react-native-foursquare-api')({
  clientID: 'YHRN40SRYBAXTAP0NYZ4REDHUDYG0BW2Y23XFAUF3I0YBU5H',
  clientSecret: 'UVG4K1IVCCUFJA3XW2XOZCSGSFPJ1UJ1RD42I0GGA4XDTEFB',
  style: 'foursquare', // default: 'foursquare' 
  version: '20160107' //  default: '20140806' 
});
 
// see respective api documentation for list of params you could pass 
var params = {
  "near": "Detroit, MI",
  "query": 'cheap'
};

foursquare.venues.explore(params)
  .then(function(data) {
	  console.log(data);
	  var venueParams = {};
	  venueParams.venue_id = data.response.groups[0].items[0].venue.id;
		foursquare.venues.getVenue(venueParams)
			.then(function(venue) {
				console.log(venue);
			})
			.catch(function(err) {
				console.log(err);
			})
	})
  .catch(function(err){
	console.log(err);
});