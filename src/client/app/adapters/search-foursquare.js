class SearchFoursquare {
	constructor() {
		this.foursquare = require('react-native-foursquare-api')({
		  clientID: 'YHRN40SRYBAXTAP0NYZ4REDHUDYG0BW2Y23XFAUF3I0YBU5H',
		  clientSecret: 'UVG4K1IVCCUFJA3XW2XOZCSGSFPJ1UJ1RD42I0GGA4XDTEFB',
		  style: 'foursquare', // default: 'foursquare' 
		  version: '20160107' //  default: '20140806' 
		});
  }
	
	getResults(newQuery) {
		var self = this;

		let params = {
		  "near": newQuery.loc,
		  "query": newQuery.query
		};

		return self.foursquare.venues.explore(params)
			.then(function (data) {
				console.log(data);
				return data.response.groups[0].items;
			})
			.catch(function (err) {
				console.log(err);
			})
	}

	idFunction(item) {
		return item.venue.id;
	}
	nameFunction(item) {
		return item.venue.name;
	}
	  	
	handleQueryChange(event) {
		this.setState({query: event.target.value});
	}
	handleLocChange(event) {
		this.setState({loc: event.target.value});
	}
		
}

export default SearchFoursquare;