import React from 'react';
import ReactDOM from 'react-dom';
import QueryFormContainer from './components/query-form-container.js';
import StackedBarChart from './components/stacked-bar-chart.js';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <QueryFormContainer />
        <svg id="chart-word-cloud"></svg>
        <StackedBarChart />
        <div id="chart-stacked-bar"></div>
      </div>
    );
  }  
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
