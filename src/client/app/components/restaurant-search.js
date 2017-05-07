import React from 'react';
import AggregateForm from './aggregate-form.js';
import SearchAggregator from './search-aggregator.js';
import SearchFoursquare from './search-foursquare.js';

class RestaurantSearch extends React.Component {
	constructor(props) {
		super(props);
		this.searches = [new SearchFoursquare()];
		this.state = {newQuery: {}};
		this.handleQueryAdd = this.handleQueryAdd.bind(this);
	}

	handleQueryAdd(query, loc){
		this.setState({newQuery: {query: query, loc: loc}});
	}

	render() {
		return (
			<div>
				<AggregateForm
					handleQueryAdd={this.handleQueryAdd}
				/>
				<SearchAggregator
					searches={this.searches}
					newQuery={this.state.newQuery}
				/>
      </div>
 		);
	}
}

export default RestaurantSearch;