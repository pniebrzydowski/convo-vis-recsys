import React from 'react';
import ReactDOM from 'react-dom';
import SearchAggregator from './components/search-aggregator.js';

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
        <SearchAggregator />
      </div>
    );
  }  
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
