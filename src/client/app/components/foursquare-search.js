import React from 'react';
import SingleInput from './single-input.js';
import ValueList from './value-list.js';

class FoursquareSearch extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
			queryValues: [],
			lists: {},
      query: null,
      loc: null
		}
	
		this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    //this.handleQueryRemove = this.handleQueryRemove.bind(this);
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
    
    let newQuery = self.state.query;
		
		self.foursquare.venues.explore(params)
		  .then(function(data) {
				console.log(data);
				self.addVenue(data.response.groups[0].items, newQuery);
			})
		  .catch(function(err){
        console.log(err);
      });
	}
	
	addVenue(venues, newQuery) {
		var self = this;
		
		self.state.lists[newQuery] = {
			query: newQuery.toLowerCase().replace(/ /g, ''),
			list: venues
		};
		self.state.queryValues.push(newQuery);
		self.setState(self.state);
		console.log(self.state);
	}
  	
	handleQueryChange(event) {
		this.setState({query: event.target.value});
	}
  handleLocChange(event) {
    this.setState({loc: event.target.value});
  }
	/*
  handleQueryRemove(event) {
    var self = this;
    
    let idx = -1;
    for(let i=0; i<self.state.queryValues.length; i++) {
      if(self.state.queryValues[i] === event.target.name) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
			self.state.queryValues.splice(idx, 1);
			self.state.lists.splice(idx, 1);
    }
  }*/
		
	render() {
		return (
      <div>
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
            placeholder="e.g., New York, NY"
            onChange={this.handleLocChange}
          />
          <button type="submit">Search</button>
        </form>
        
				<ValueList
          values={this.state.queryValues}
        />
      </div>
 		);
	}
}

export default FoursquareSearch;