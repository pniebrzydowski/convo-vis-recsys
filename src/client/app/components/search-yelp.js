import React from 'react';
import Yelp from 'yelp';
import SingleInput from './single-input.js';

class SearchYelp extends React.Component {
	constructor(props) {
		super(props);
		this.addVenues = props.sendResults;
	   
		this.state = {
		  query: null,
		  loc: null
		}
		
		this.yelp = new Yelp({
		  consumer_key: 'eZQcHxqz1AhtBU-BAy-uMA',
		  consumer_secret: 'i2b5qTY2NHWONZkfSNbbGIEreg8',
		  token: 'kDASCsjqvHYORo1jVj79i0SkqrfVqIWn',
		  token_secret: 'dnH7fF5r98YcNO84C4ZrTTdjH_E',
		});

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleQueryChange = this.handleQueryChange.bind(this);
		this.handleLocChange = this.handleLocChange.bind(this);
	}
	
	handleSubmit(event) {
		var self = this;
		event.preventDefault();
    
		console.log("query: " + self.state.query + " | loc: " + self.state.loc);
		let params = {
		  "location": self.state.loc,
		  "term": self.state.query
		};
    
		let newQuery = self.state.query;
		
		self.yelp.search(params)
			.then(function(data) {
				console.log(data);
				self.addVenues(data.response.groups[0].items, newQuery);
			})
			.catch(function(err){
				console.log(err);
			});
	}
	  	
	handleQueryChange(event) {
		this.setState({query: event.target.value});
	}
	handleLocChange(event) {
		this.setState({loc: event.target.value});
	}
		
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
		  </div>
 		);
	}
}

export default SearchYelp;