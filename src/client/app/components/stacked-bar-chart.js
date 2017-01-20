import React from 'react';
import * as d3 from 'd3';
import {BarStackHorizontalChart} from 'react-d3-basic';
import ReactSlider from 'react-slider';
import SingleInput from './single-input.js';
import ValueList from './value-list.js';

class StackedBarChart extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
      WIDTH: 700,
      HEIGHT: 500,
      xDomain: [],
      chartSeries: [],
      chartData: [],
			numberOfQueries: 0,
			queryValues: [],
      query: null,
      loc: null
		}
    this.xTickFormat = d3.format(".3");
    this.yScale = 'ordinal';
    this.queries = [];
		this.queryWeights = [];
    this.venues = [];
    this.MAX_RANK = 30;
		
		this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleQueryRemove = this.handleQueryRemove.bind(this);
    this.handleLocChange = this.handleLocChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    
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
      let wt = self.queryWeights[i];
      let newWt = ((wt * queryCt)/(queryCt + 1));
			self.queryWeights[i] = newWt;
    }
    
    self.queries.push( newQuery );
		self.queryWeights.push( 600 );
    
    self.drawChart();
    console.log(this.state.chartSeries);
    console.log(this.state.chartData);
  }
  
  drawChart() {
    var self = this;
    
    self.adjustVenueWeighting();
    self.setState({
      chartSeries: self.getSeriesArray(),
      chartData: self.getTopVenues(),
      xDomain: [0,100],
			numberOfQueries: self.queries.length,
			queryValues: self.queryWeights
    });
		
		console.log(self.state.queryValues);
  }
  
  adjustQueryWeighting() {
    var self = this;
    
    let totalWeight = 0;
    for(let i=0; i<self.queries.length; i++) {
      totalWeight += self.queries[i].value;
    }
    
		let weightSum = 0;
    for(let i=0; i<self.queries.length; i++) {
      let wt = self.queries[i].value;
      let newWt = (600 * wt) / totalWeight;
			weightSum += newWt;
			self.queryWeights[i] = weightSum;
    }
  }
  
  adjustVenueWeighting() {
    var self = this;
    
    for(let i=0; i<self.venues.length; i++) {
      let venueScore = 0;
			let prevWt = 0;
      for(let j=0; j<self.queries.length; j++) {
        if(self.venues[i].queryScores[self.queries[j]] === undefined) {
          self.venues[i].queryScores[self.queries[j]] = 0;
          self.venues[i][self.queries[j]] = 0;
        } else {
          let queryScore = self.venues[i].queryScores[self.queries[j]];
					let queryWt = self.queryWeights[j] - prevWt;
          let wtdScore = (queryScore * queryWt) / self.MAX_RANK / 6;
          self.venues[i][self.queries[j]] = wtdScore;
          venueScore += wtdScore;
        }
				prevWt = self.queryWeights[j];
      }
      self.venues[i].venueScore = venueScore;
    }
  }
    
  getSeriesArray() {
    var self = this;
    
    let seriesArray = [];
    for(let i=0; i<self.queries.length; i++) {
      seriesArray.push({
        field: self.queries[i],
        name: self.queries[i]
      });
    }
    return seriesArray;
  }
  
  getTopVenues() {
    var self = this;
    
    self.venues.sort(function(a,b) {
      return b.venueScore - a.venueScore;
    });
    
    return self.venues.slice(0,10).reverse();
  }
	
	handleQueryChange(event) {
		this.setState({query: event.target.value});
	}
  handleLocChange(event) {
    this.setState({loc: event.target.value});
  }
  handleWeightChange(values) {
		var self = this;
		
		self.queryWeights = values;
		self.setState({queryValues: values});
		self.drawChart();
  }
  handleQueryRemove(event) {
    var self = this;
    
    let idx = -1;
    for(let i=0; i<self.queries.length; i++) {
      if(self.queries[i] === event.target.name) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
      self.queries.splice(idx, 1);
			self.queryWeights.splice(idx, 1);
      self.adjustQueryWeighting();
      self.drawChart();
    }
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
        
				<ValueList
          values={this.state.queryValues}
        />

				<ReactSlider
					withBars
					max={600}
					step={this.state.numberOfQueries}
					value={this.state.queryValues}
					onAfterChange={this.handleWeightChange}
				/>
				
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