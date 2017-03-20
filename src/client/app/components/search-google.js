import React from 'react';
import SingleInput from './single-input.js';

class SearchGoogle extends React.Component {
	constructor(props) {
		super(props);
		this.addVenues = props.sendResults;
	   
		this.state = {
		  query: null,
		  loc: null
		}
		
		this.google = {
			key: 'AIzaSyAqxqzN_wV61labw93yu2h9MX2-jwzCMvs',
			searchUrl: 'http://maps.googleapis.com/maps/api/place/nearbysearch/output?',
		}

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
		  "keyword": self.state.query,
		  "key": self.google.key
		};
    
		let newQuery = self.state.query;
		
		var xmlhttp;
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
				console.log(xmlhttp.responseText);
				self.addVenues(xmlhttp.responseText.groups[0].items, newQuery);
			}
		}
		xmlhttp.open("GET", self.google.searchUrl + self.serialize(params), true);
		xmlhttp.send();
	}
	
	serialize(obj) {
	  var str = [];
	  for(var p in obj)
		if (obj.hasOwnProperty(p)) {
		  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	  return str.join("&");
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

export default SearchGoogle;