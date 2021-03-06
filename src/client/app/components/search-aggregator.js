import React from 'react';
import ValueList from './value-list.js';
import StackedBarChart from './stacked-bar-chart.js';
import VennDiagram from './venn-diagram.js';
import SliderMulti from './slider-multi.js';

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
		this.ui = this.getParameterByName('v') || 'vdc';

		this.handleQueryRemove = this.handleQueryRemove.bind(this);
		this.handleWeightChange = this.handleWeightChange.bind(this);
	}

	getParameterByName(name) {
		let match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	}

	componentWillReceiveProps(nextProps) {
		if(this.queries.length >= 4) {
			alert("Sorry, a maximum of 4 attributes is allowed");
			return false;
		}
		let validQuery = ( this.state.queryNames.indexOf( nextProps.newQuery.query ) === -1);
		if( !validQuery ) {
			alert("Sorry, this attribute has already been added. Please try a new one.");
			return false;
		}

		let resultCount = 0;
		for(let search of this.searches) {
			search.getResults(nextProps.newQuery).then((result) => {
				resultCount++;
				this.handleResults(result, nextProps.newQuery.query, search.idFunction, search.nameFunction);
				if(resultCount === this.searches.length) {
					this.queries.push({
						name: nextProps.newQuery.query,
						weight: 5
					});
					this.drawChart();
				}
			});
		}
	}

	handleResults(results, query, idFn, nameFn) {
    for(let [i,res] of results.entries()) {
      let found = false;
      let dataObj = {
        id: idFn(res),
        name: nameFn(res),
        queryRanks: {}
      };
      
      for(let item of this.resultItems) {
        if(item.id === idFn(res)) {
          dataObj = item;
          found = true;
          break;
        }
      }
      
      dataObj.queryRanks[query] = (results.length - i)/(results.length);

      if(!found) {
        this.resultItems.push(dataObj);
      }
    }
	}
  	
  handleQueryRemove(event) {
    let idx = -1;
    for(let [i,query] of this.queries.entries()) {
      if(query.name === event.target.name) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
			this.queries.splice(idx, 1);
    }
		
		this.drawChart();
  }
	
	handleWeightChange(values) {
		for(let [index,query] of this.queries.entries()) {
			query.weight = values[index];
		}
		
		this.drawChart();
	}

	getTopVenues() {
		let allVenues = this.resultItems.slice();
		let totalWeight = 0;
		for(let q of this.queries) {
			totalWeight += q.weight;
		}

		for(let venue of allVenues) {
			let score = 0;
			let ranks = venue.queryRanks;

			for(let query of this.queries) {
				if(!ranks[query.name]) {
					venue[query.name] = 0;
				} else {
					let queryWeight = query.weight / totalWeight;
					let weightedScore = 100 * queryWeight * ranks[query.name];
					venue[query.name] = Math.round(weightedScore);
					score += weightedScore;
				}
			}

			score = Math.round(score);
			if(score > 100) score = 100;

			venue.totalScore = score;
		}
    allVenues.sort(function(a,b) {
      return b.totalScore - a.totalScore;
    });
    
		return allVenues;
  }
	
	getQueries() {
		let queries = {
			names: [],
			weights: []
		};
		
		let wt = 0;
		for(let query of this.queries) {
			queries.names.push(query.name);
			queries.weights.push(query);
		}
		
		return queries;
	}
	
	drawChart() {
		let qInfo = this.getQueries();
		let newState = {
      chartData: this.getTopVenues(),
			queryNames: qInfo.names,
			queryValues: qInfo.weights
    };
		
    this.setState(newState);
  }

	render() {
		return (
			<div>
				<div className="attributes">
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
					{
						this.ui === 'vdc' &&
						<VennDiagram
							data={this.state.chartData}
							queries={this.state.queryNames}
							queryValues={this.state.queryValues}
						/>
					}
					{
						this.ui === 'sbc' &&
						<StackedBarChart
							data = {this.state.chartData}
							queries = {this.state.queryNames}
						/>
					}
				</div>
			</div>
 		);
	}
}

export default SearchAggregator;