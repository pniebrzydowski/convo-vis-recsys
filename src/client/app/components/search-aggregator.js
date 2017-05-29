import React from 'react';
import ValueList from './value-list.js';
import SliderMulti from './slider-multi.js';
import VennDiagram from "./venn-diagram";

class SearchAggregator extends React.Component {
	constructor(props) {
		super(props);
    
		this.state = {
			chartData: [],
			queryNames: [],
			queryValues: []
		};

		this.queries = [];
		this.resultItems = [];
		this.searches = props.searches;
		
		this.handleQueryRemove = this.handleQueryRemove.bind(this);
		this.handleWeightChange = this.handleWeightChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		var self = this;

		if(self.queries.length >= 4) {
			alert("Sorry, a maximum of 4 attributes is allowed");
			return false;
		}
		var validQuery = ( self.state.queryNames.indexOf( nextProps.newQuery.query ) === -1);
		if( !validQuery ) {
			alert("Sorry, this attribute has already been added. Please try a new one.");
			return false;
		}

		let resultCount = 0;
		for(let i=0; i<self.searches.length; i++) {
			self.searches[i].getResults(nextProps.newQuery).then(function(result){
				resultCount++;
				self.handleResults(result, nextProps.newQuery.query, self.searches[i].idFunction, self.searches[i].nameFunction);
				if(resultCount === self.searches.length) {
					self.queries.push({
						name: nextProps.newQuery.query,
						weight: 5
					});
					self.drawChart();
				}
			});
		}
	}

	handleResults(results, query, idFn, nameFn) {
		var self = this;
    		    
    for(let i=0; i<results.length; i++) {
      let found = false;
      let dataObj = {
				id: idFn(results[i]),
				name: nameFn(results[i]),
				queryRanks: {},
				set: []
			};
      
      for(let j=0; j<self.resultItems.length; j++) {
        if(self.resultItems[j].id === idFn(results[i])) {
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
	}
  	
  handleQueryRemove(event) {
    var self = this;
    
    let idx = -1;
    for(let i=0; i<self.queries.length; i++) {
      if(self.queries[i].name === event.target.name) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
			self.queries.splice(idx, 1);
    }
		
		self.drawChart();
  }
	
	handleWeightChange(values) {
		var self = this;
		
		
		for(let i=0; i<self.queries.length; i++) {
			self.queries[i].weight = values[i];
		}
		
		self.drawChart();
	}
	
	adjustWeightingOnRemove() {
		var self = this;

		let totalWt = 0;
		for(let i=0; i<self.queries.length; i++) {
			totalWt += self.queries[i].weight;
		}
		
		for(let i=0; i<self.queries.length; i++) {
			self.queries[i].weight *= 600 / totalWt;
		}
	}
		
	adjustWeightingOnAdd() {
		var self = this;

		for(let i=0; i<self.queries.length; i++) {
			self.queries[i].weight *= self.queries.length / (self.queries.length + 1);
		}
	}
	
	getTopVenues() {
    var self = this;
    
		let allVenues = self.resultItems.slice();
		let totalWeight = 0;
		for(let i=0; i<self.queries.length; i++) {
			totalWeight += self.queries[i].weight;
		}
		
		for(let i=0; i<allVenues.length; i++) {
			let score = 0;
			let ranks = allVenues[i].queryRanks;
			allVenues[i].set = [];

			for(let j=0; j<self.queries.length; j++) {
				let query = self.queries[j].name;
				if (!ranks[query]) {
					allVenues[i][query] = 0;
				} else {
					let queryWeight = self.queries[j].weight / totalWeight;
					let weightedScore = 100 * queryWeight * ranks[query];
					//let weightedScore = self.queries[j].weight / 6 * ranks[query];
					allVenues[i][query] = Math.round(weightedScore);
					score += weightedScore;
					allVenues[i].set.push(query);
				}
			}

			score = Math.round(score);
			if(score > 100) score = 100;

			allVenues[i].totalScore = score;
		}
    allVenues.sort(function(a,b) {
      return b.totalScore - a.totalScore;
    });
    
    return allVenues.reverse();
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
			queries.names.push(self.queries[i].name);
			queries.weights.push({name: self.queries[i].name, weight: self.queries[i].weight});
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
      chartData: self.getTopVenues(),
			queryNames: qInfo.names,
			queryValues: qInfo.weights
    };
		
    self.setState(newState);
  }

	render() {
		return (
			<div>
				<div className = "attributes">
				<ValueList
					values={this.state.queryNames}
					removeFunc={this.handleQueryRemove}
				/>

				<SliderMulti
					values={this.state.queryValues}
					handleWeightChange={this.handleWeightChange}
				/>
				</div>

				<div className="results">
				<VennDiagram
					chartData = {this.state.chartData}
					sets = {this.state.queryNames}
					queryValues = {this.state.queryValues}
				/>
				</div>
			</div>
 		);
	}
}

export default SearchAggregator;