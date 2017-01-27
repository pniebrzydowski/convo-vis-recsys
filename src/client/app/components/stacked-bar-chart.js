import React from 'react';
import * as d3 from 'd3';
import {BarStackHorizontalChart} from 'react-d3-basic';
import ReactSlider from 'react-slider';

class StackedBarChart extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
      chartSeries: [],
      chartData: [],
			sliderStepSize: 600,
			queryValues: []
		}
    this.WIDTH = 800;
    this.HEIGHT = 500;
    this.xDomain = [0,100];
    this.xTickFormat = d3.format(".3");
    this.yScale = 'ordinal';
    this.queries = [];
		this.queryWeights = [];
    this.venues = [];
    this.MAX_RANK = 30;
		
    this.handleWeightChange = this.handleWeightChange.bind(this);
    
  }
  
  x(d) {
    return +d;
  }
  y(d) {
    return d.name;
  }
	
	componentWillReceiveProps(nextProps) {
		if(this.queries.length === nextProps.lists.length) return;
		var self = this;
		
		let newList = nextProps.lists[nextProps.lists.length - 1];
		self.setVenueRankings(newList.list, newList.query);
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
  }
  
  drawChart() {
    var self = this;
    
    self.adjustVenueWeighting();
    self.setState({
      chartSeries: self.getSeriesArray(),
      chartData: self.getTopVenues(),
			sliderStepSize: 60 / self.queries.length,
			queryValues: self.queryWeights
    });
		
    console.log(self.state);
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
	
  handleWeightChange(values) {
		var self = this;
		
		self.queryWeights = values;
		self.setState({queryValues: values});
		self.drawChart();
  }
		
	render() {
		return (
      <div>
				<ReactSlider
					withBars
					min={this.state.sliderStepSize*2}
					max={600}
					minDistance={this.state.sliderStepSize*2}
					step={this.state.sliderStepSize}
					value={this.state.queryValues}
					onAfterChange={this.handleWeightChange}
					pearling={true}
				/>
				
        <BarStackHorizontalChart
          data= {this.state.chartData}
          width= {this.WIDTH}
          height= {this.HEIGHT}
          chartSeries = {this.state.chartSeries}
          x= {this.x}
          xDomain= {this.xDomain}
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