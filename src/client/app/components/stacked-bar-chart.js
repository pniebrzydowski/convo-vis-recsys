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
			weightValues: []
		}
    this.WIDTH = 800;
    this.HEIGHT = 500;
    this.xDomain = [0,100];
    this.xTickFormat = d3.format(".3");
    this.yScale = 'ordinal';
    this.MAX_RANK = 30;

    this.venues = [];
		
    this.handleWeightChange = this.handleWeightChange.bind(this);
  }
  
  x(d) {
    return +d;
  }
  y(d) {
    return d.name;
  }
	
	componentWillReceiveProps(nextProps) {
		if(this.props.queries.length <= this.state.weightValues.length) return;
		var self = this;
		
		let newList = nextProps.lists[nextProps.lists.length - 1];
		self.addNewList(newList.list, newList.query);
		self.drawChart();
	}
		
  addNewList(venues, newQuery) {
		var self = this;
    		    
    for(let i=0; i<venues.length; i++) {
      let found = false;
      let dataObj = {
        id: venues[i].venue.id,
        name: venues[i].venue.name,
        queryRanks: {}
      };
      
      for(let j=0; j<self.venues.length; j++) {
        if(self.venues[j].id === venues[i].venue.id) {
          dataObj = self.venues[j];
          found = true;
          break;
        }
      }
      
      dataObj.queryRanks[newQuery] = self.MAX_RANK - i;

      if(!found) {
        self.venues.push(dataObj);
      }
    }
	}
		
	adjustQueryWeighting() {
		var self = this;
		
		let wts = [];
		let eqWt = 600 / self.props.queries.length;
		let totalWt = 0;
		
		for(let i=0; i<self.props.queries.length; i++) {
			totalWt += eqWt;
			wts.push(totalWt);

			/*
			let query = self.props.queries[i];
			
			for(let j=0; j<self.queryWeights.length; j++) {
				let oldWt = -1;
				if(self.queryWeights[j].name === query) {
					oldWt = self.queryWeights[j].weight;
				}
			}

			
			if(oldWt < 0) {
				self.queryWeights.push({
					field: query,
					name: query,
					weight: 600 / self.props.queries.length
				})
			} else {
				self.queryWeights[query] = newWt;
			}*/
		}
		
		return wts;
	}
	
  drawChart() {
    var self = this;
    
		var sliderValues = self.adjustQueryWeighting();
		var seriesArray = self.getSeriesArray();
		var topVenues = self.getTopVenues(sliderValues);
		
    self.setState({
      chartSeries: seriesArray,
      chartData: topVenues,
			sliderStepSize: 60 / self.props.queries.length,
			weightValues: sliderValues
    });
		
		console.log(topVenues);
    console.log(sliderValues);
  }
    
  getSeriesArray() {
    var self = this;
    
    let seriesArray = [];
    for(let i=0; i<self.props.queries.length; i++) {
      seriesArray.push({
        field: self.props.queries[i],
        name: self.props.queries[i]
      });
    }
    return seriesArray;
  }
	  
  getTopVenues(weights) {
    var self = this;
    
		let allVenues = self.venues.slice();
		
		for(let i=0; i<allVenues.length; i++) {
			let score = 0;
			let ranks = allVenues[i].queryRanks;
			
			for(let j=0; j<self.props.queries.length; j++) {
				let query = self.props.queries[j];
				if(!ranks[query]) {
					allVenues[i][query] = 0;
				} else {
					let wt = weights[j] - (j===0 ? 0 : weights[j-1]);
					let weightedScore = wt / 6 * ranks[query] / 30;
					allVenues[i][query] = weightedScore;
					score += weightedScore;
				}
			}
			
			allVenues[i].totalScore = score;
		}
    allVenues.sort(function(a,b) {
      return b.totalScore - a.totalScore;
    });
    
    return allVenues.slice(0,10).reverse();
  }
	
  handleWeightChange(values) {
		var self = this;
		self.setState({weightValues: values});
		console.log(self.state);
		//self.drawChart();
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
					value={this.state.weightValues}
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