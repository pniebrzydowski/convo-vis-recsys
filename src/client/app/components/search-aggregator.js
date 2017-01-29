import React from 'react';
import ValueList from './value-list.js';
import StackedBarChart from './stacked-bar-chart.js';
import SliderWeighted from './slider-weighted.js';
import SearchFoursquare from './search-foursquare.js';

class SearchAggregator extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
			chartData: [],
			chartSeries: [],
			queryNames: [],
			queryValues: []
		}

		this.queries = [];
		this.resultItems = [];
		
		this.handleQueryAdd = this.handleQueryAdd.bind(this);
    this.handleQueryRemove = this.handleQueryRemove.bind(this);
		this.handleWeightChange = this.handleWeightChange.bind(this);
  }
		
	handleQueryAdd(results, query) {
		var self = this;
    		    
    for(let i=0; i<results.length; i++) {
      let found = false;
      let dataObj = {
        id: results[i].venue.id,
        name: results[i].venue.name,
        queryRanks: {}
      };
      
      for(let j=0; j<self.resultItems.length; j++) {
        if(self.resultItems[j].id === results[i].venue.id) {
          dataObj = self.resultItems[j];
          found = true;
          break;
        }
      }
      
      dataObj.queryRanks[query] = (results.length - i)/(results.length);

      if(!found) {
        self.resultItems.push(dataObj);
      }
    }
		
		self.queries.push({
			name: query,
			weight: -1,
			items: results
		});
		
		self.adjustQueryWeighting();
		self.drawChart();
	}
  	
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
			let newLists = self.state.lists.splice(idx, 1);
			let newVals = self.state.queryValues.splice(idx, 1);
    }		
  }
	
	handleWeightChange(values) {
		var self = this;
		
		
		for(let i=0; i<self.queries.length; i++) {
			self.queries[i].weight = (i==0 ? values[i] : (values[i] - values[i-1]));
		}
		
		self.drawChart();
	}
		
	adjustQueryWeighting() {
		var self = this;
		
		let wts = [];
		let eqWt = 600 / self.queries.length;
		let totalWt = 0;
		
		for(let i=0; i<self.queries.length; i++) {
			self.queries[i].weight = eqWt;

			/*
			let query = self.queries[i];
			
			for(let j=0; j<self.state.queryWeights.length; j++) {
				let oldWt = -1;
				if(self.queryWeights[j].name === query) {
					oldWt = self.queryWeights[j].weight;
				}
			}

			
			if(oldWt < 0) {
				self.queryWeights.push({
					field: query,
					name: query,
					weight: 600 / self.queries.length
				})
			} else {
				self.queryWeights[query] = newWt;
			}*/
		}
	}
	
	getTopVenues() {
    var self = this;
    
		let allVenues = self.resultItems.slice();
		
		for(let i=0; i<allVenues.length; i++) {
			let score = 0;
			let ranks = allVenues[i].queryRanks;
			
			for(let j=0; j<self.queries.length; j++) {
				let query = self.queries[j].name;
				if(!ranks[query]) {
					allVenues[i][query] = 0;
				} else {
					let weightedScore = self.queries[j].weight / 6 * ranks[query];
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
	
	getQueries() {
		var self = this;
		
		let queries = {
			names: [],
			weights: [],
			seriesArray: []
		};
		
		let wt = 0;
		for(let i=0; i<self.queries.length; i++) {
			wt += self.queries[i].weight;
			queries.names.push(self.queries[i].name);
			queries.weights.push(wt);
			queries.seriesArray.push({
        field: self.queries[i].name,
        name: self.queries[i].name
      });
		}
		
		return queries;
	}
	
	drawChart() {
    var self = this;
    
		let qInfo = self.getQueries();
		let newState = {
      chartSeries: qInfo.seriesArray,
      chartData: self.getTopVenues(),
			queryNames: qInfo.names,
			queryValues: qInfo.weights
    };
		
    self.setState(newState);
  }
		
	render() {
		return (
      <div>
        <SearchFoursquare
					sendResults={this.handleQueryAdd}
				/>
        
				<ValueList
          values={this.state.queryNames}
					removeFunc={this.handleQueryRemove}
        />
				
				<SliderWeighted
					values={this.state.queryValues}
					handleWeightChange={this.handleWeightChange}
				/>
				
        <StackedBarChart
          chartData = {this.state.chartData}
          chartSeries = {this.state.chartSeries}
        />
      </div>
 		);
	}
}

export default SearchAggregator;