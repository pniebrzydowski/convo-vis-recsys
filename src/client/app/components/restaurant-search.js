import React from 'react';
import AggregateForm from './aggregate-form.js';
import SearchAggregator from './search-aggregator.js';
import SearchFoursquare from './search-foursquare.js';

class RestaurantSearch extends React.Component {
	constructor(props) {
		super(props);
		this.searches = [new SearchFoursquare()];
	}

	render() {
		return (
			<div>
				<SearchAggregator
					searches={this.searches}
				/>
      </div>
 		);
	}
}

export default RestaurantSearch;