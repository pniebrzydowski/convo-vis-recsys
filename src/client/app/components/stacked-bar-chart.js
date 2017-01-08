import React from 'react';
import BarStackChart from 'react-d3-basic';
import SingleInput from './single-input.js';

class StackedBarChart extends React.Component {
	constructor(props) {
		super(props);
    
		this.state = {
      query: null,
      loc: null,
			venues: []
		}
		
		this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    
		this.foursquare = require('react-native-foursquare-api')({
		  clientID: 'YHRN40SRYBAXTAP0NYZ4REDHUDYG0BW2Y23XFAUF3I0YBU5H',
		  clientSecret: 'UVG4K1IVCCUFJA3XW2XOZCSGSFPJ1UJ1RD42I0GGA4XDTEFB',
		  style: 'foursquare', // default: 'foursquare' 
		  version: '20160107' //  default: '20140806' 
		});
  }
	
	handleSubmit(event) {
		var self = this;
		event.preventDefault();
    
		console.log("query: " + self.state.query + " | loc: " + self.state.loc);
		let params = {
		  "near": self.state.loc,
		  "query": self.state.query
		};
		
		self.foursquare.venues.explore(params)
		  .then(function(data) {
				console.log(data);
				self.setVenueRankings(data.response.groups[0].items);
			})
		  .catch(function(err){
        console.log(err);
      });
	}
	
	setVenueRankings(venues) {
		var self = this;
    console.log(venues);
		
    let venueCt = 0;    
    for(let i=0; i<venues.length; i++) {
      venueCt++;
    };
	}
	
	handleQueryChange(event) {
		this.setState({query: event.target.value});
	}
  handleLocChange(event) {
    this.setState({loc: event.target.value});
  }
		
	render() {
		return (
      <form onSubmit={this.handleSubmit}>
        <SingleInput
          inputType="text"
          title="Search for"
          name="query"
          placeholder="e.g., casual"
          onChange={this.handleQueryChange}
        />
        <SingleInput
          inputType="text"
          title="Near"
          name="location"
          onChange={this.handleLocChange}
          placeholder="e.g., New York, NY"
          onChange={this.handleLocChange}
        />
        <button type="submit">Search</button>
      </form>
 		);
	}
}

export default StackedBarChart;