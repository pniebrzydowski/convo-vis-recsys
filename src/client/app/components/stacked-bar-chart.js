import React from 'react';
import * as d3 from 'd3';
import {BarStackHorizontalChart} from 'react-d3-basic';
import SingleInput from './single-input.js';
import InputList from './input-list.js';

class StackedBarChart extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
      WIDTH: 700,
      HEIGHT: 500,
      xDomain: [],
      chartSeries: [],
      chartData: [],
      queries: [],
      query: null,
      loc: null
		}
    this.xTickFormat = d3.format(".2");
    this.yScale = 'ordinal';
    this.queries = [];
    this.venues = [];
    this.MAX_RANK = 30;
		
		this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleWeightSubmit = this.handleWeightSubmit.bind(this);
    
		this.foursquare = require('react-native-foursquare-api')({
		  clientID: 'YHRN40SRYBAXTAP0NYZ4REDHUDYG0BW2Y23XFAUF3I0YBU5H',
		  clientSecret: 'UVG4K1IVCCUFJA3XW2XOZCSGSFPJ1UJ1RD42I0GGA4XDTEFB',
		  style: 'foursquare', // default: 'foursquare' 
		  version: '20160107' //  default: '20140806' 
		});
  }
  
  x(d) {
    return +d;
  }
  y(d) {
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
    		    
    for(let i=0; i<venues.length; i++) {
      let found = false;
      let dataObj = {
        id: venues[i].venue.id,
        name: venues[i].venue.name,
        venueScore: 0,
        queryScores: []
      };
      
      for(let j=0; j<self.venues.length; j++) {
        if(self.venues[j].id === venues[i].venue.id) {
          dataObj = self.venues[j];
          found = true;
          break;
        }
      }
      
      dataObj.queryScores[newQuery] = self.MAX_RANK - i;

      if(!found) {
        self.venues.push(dataObj);
      }
    }
    
    let queryCt = self.queries.length;
    for(let i=0; i<queryCt; i++) {
      let wt = self.queries[i].value;
      let newWt = (wt * queryCt)/(queryCt + 1);
      self.queries[i].value = newWt;
    }
      
    self.queries.push({
      name: newQuery,
      value: 1 / (queryCt + 1)
    });
    
    for(let i=0; i<self.venues.length; i++) {
      let venueScore = 0;
      for(let j=0; j<self.queries.length; j++) {
        if(self.venues[i].queryScores[self.queries[j].name] === undefined) {
          self.venues[i].queryScores[self.queries[j].name] = 0;
          self.venues[i][self.queries[j].name] = 0;
        } else {
          let queryScore = self.venues[i].queryScores[self.queries[j].name];
          let queryWt = self.queries[j].value;
          let wtdScore = (queryScore * queryWt) / self.MAX_RANK;
          self.venues[i][self.queries[j].name] = wtdScore;
          venueScore += wtdScore;
        }
      }
      self.venues[i].venueScore = venueScore;
    }
    
    this.setState({
      chartSeries: self.getSeriesArray(),
      chartData: self.getTopVenues(),
      xDomain: [0,1],
      queries: self.queries
    });
    console.log(this.state.chartSeries);
    console.log(this.state.chartData);
	}
  
  getSeriesArray() {
    var self = this;
    
    let seriesArray = [];
    for(let i=0; i<self.queries.length; i++) {
      seriesArray.push({
        field: self.queries[i].name,
        name: self.queries[i].name
      });
    }
    return seriesArray;
  }
  
  getTopVenues() {
    var self = this;
    
    self.venues.sort(function(a,b) {
      return b.venueScore - a.venueScore;
    });
    
    return self.venues.slice(0,10);
  }
	
	handleQueryChange(event) {
		this.setState({query: event.target.value});
	}
  handleLocChange(event) {
    this.setState({loc: event.target.value});
  }
  handleWeightChange(event) {
    var self = this;
    for(let i=0; i<self.queries.length; i++) {
      if(self.queries[i].name === event.target.name) {
        self.queries[i].value = event.target.value;
        self.setState({queries: self.queries});
        return;
      }
    }
  }
  handleWeightSubmit(event) {
    var self = this;
    event.preventDefault();
    
    console.log(self.state.queries);
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
        
        <form onSubmit={this.handleWeightSubmit}>
          <InputList
            fields={this.queries}
            onChange={this.handleWeightChange}
          />
        </form>
        
        <BarStackHorizontalChart
          data= {this.state.chartData}
          width= {this.state.WIDTH}
          height= {this.state.HEIGHT}
          chartSeries = {this.state.chartSeries}
          x= {this.x}
          xDomain= {this.state.xDomain}
          xTickFormat= {this.xTickFormat}
          y= {this.y}
          yScale = {this.yScale}
          horizontal= {true}
        />
      </div>
 		);
	}
}

export default StackedBarChart;