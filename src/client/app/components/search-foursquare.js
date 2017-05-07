class SearchFoursquare {
	constructor() {
		this.foursquare = require('react-native-foursquare-api')({
		  clientID: 'YHRN40SRYBAXTAP0NYZ4REDHUDYG0BW2Y23XFAUF3I0YBU5H',
		  clientSecret: 'UVG4K1IVCCUFJA3XW2XOZCSGSFPJ1UJ1RD42I0GGA4XDTEFB',
		  style: 'foursquare', // default: 'foursquare' 
		  version: '20160107' //  default: '20140806' 
		});
  }
	
	getResults(query, loc) {
		let params = {
		  "near": loc,
		  "query": query
		};

		self.foursquare.venues.explore(params)
		  .then(function(data) {
				console.log(data);
				self.addVenues(data.response.groups[0].items, query, self.getItemId, self.getItemName);
			})
		  .catch(function(err){
        console.log(err);
      });
	}
	
	getItemId(item) {
		return item.venue.id;
	}
	getItemName(item) {
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