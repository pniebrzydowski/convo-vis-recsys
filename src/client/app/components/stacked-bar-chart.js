import React from 'react';
import * as d3 from 'd3';
import SingleInput from './single-input.js';
var BarStackChart = require('react-d3-basic').BarStackChart;

class StackedBarChart extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
      WIDTH: 700,
      HEIGHT: 500,
      chartSeries: [],
      chartData: [],
      query: null,
      loc: null
		}
    this.xScale = 'ordinal';
    this.yTickFormat = d3.format(".2s");
    this.queries = [];
    this.venues = [];
		
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
  
  x(d) {
    return d.name;
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
				self.setVenueRankings(data.response.groups[0].items, newQuery);
			})
		  .catch(function(err){
        console.log(err);
      });
	}
	
	setVenueRankings(venues, newQuery) {
		var self = this;
		
    let venueArray = [];
    let seriesArray = [];
    
    for(let i=0; i<venues.length; i++) {
      let found = false;
      let dataObj = {};
      for(let j=0; j<self.venues.length; j++) {
        if(self.venues[j].name === venues[i].venue.name) {
          dataObj = self.venues[j];
          found = true;
        }
      }

      if(!found) {
        dataObj["name"] = venues[i].venue.name;
        for(let k=0; k<self.queries.length; k++) {
          dataObj[self.queries[k]] = 0;
        }
      }
      dataObj[newQuery] = i+1;
      venueArray.push(dataObj);
    };
    
    let topTenVenues = venueArray.slice(0,10);
    self.queries.push(newQuery);

    for(let i=0; i<self.queries.length; i++) {
      seriesArray.push({
        field: self.queries[i],
        name: self.queries[i]
      });
    }
    
    self.venues = venueArray;
    this.setState({
      chartSeries: seriesArray,
      chartData: topTenVenues
    });
    console.log(this.state.chartSeries);
    console.log(this.state.chartData);
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
            onChange={this.handleLocChange}
            placeholder="e.g., New York, NY"
            onChange={this.handleLocChange}
          />
          <button type="submit">Search</button>
          
        </form>
      
        <BarStackChart
          data= {this.state.chartData}
          width= {this.state.WIDTH}
          height= {this.state.HEIGHT}
          chartSeries = {this.state.chartSeries}
          x= {this.x}
          xScale = {this.xScale}
          yTickFormat= {this.yTickFormat}
        />
      </div>
 		);
	}
}

export default StackedBarChart;