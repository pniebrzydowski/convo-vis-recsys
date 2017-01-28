import React from 'react';
import SingleInput from './single-input.js';
import ValueList from './value-list.js';
import StackedBarChart from './stacked-bar-chart.js';
import SearchFoursquare from './search-foursquare.js';

class SearchAggregator extends React.Component {
	constructor(props) {
		super(props);
    
    this.state = {
			queryValues: [],
			lists: []
		}
	
		this.handleQueryAdd = this.handleQueryAdd.bind(this);
    this.handleQueryRemove = this.handleQueryRemove.bind(this);
  }
		
	handleQueryAdd(results, query) {
		var self = this;
		
		self.state.lists.push({
			query: query,
			list: results
		});
		self.state.queryValues.push(query);
		self.setState(self.state);
		console.log(self.state);
	}
  	
  handleQueryRemove(event) {
    var self = this;
	/*
    
    let idx = -1;
    for(let i=0; i<self.state.queryValues.length; i++) {
      if(self.state.queryValues[i] === event.target.name) {
        idx = i;
        break;
      }
    }
    if(idx > -1) {
			self.state.queryValues.splice(idx, 1);
			self.state.lists.splice(idx, 1);
    }
		*/
  }
		
	render() {
		return (
      <div>
        <SearchFoursquare
					sendResults={this.handleQueryAdd}
				/>
        
				<ValueList
          values={this.state.queryValues}
        />
				
				<StackedBarChart
					lists={this.state.lists}
				/>
      </div>
 		);
	}
}

export default SearchAggregator;