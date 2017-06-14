import React from 'react';
import ReactDOM from 'react-dom';
import RestaurantSearch from './adapters/restaurant-search.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
	/*<QueryFormContainer />
	<svg id="chart-word-cloud"></svg>
	<StackedBarChart />
  <div id="chart-stacked-bar"></div>*/
  
  render() {
    return (
      <div>
        <RestaurantSearch />
      </div>
    );
  }  
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
