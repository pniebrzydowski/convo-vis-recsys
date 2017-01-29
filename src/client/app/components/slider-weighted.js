import React from 'react';
import * as d3 from 'd3';
import ReactSlider from 'react-slider';

class SliderWeighted extends React.Component {
	constructor(props) {
		super(props);
  }
  		
	render() {
		if(this.props.values.length <= 1) {
			return null;
		}
		
		return (
			<ReactSlider
				withBars
				min={120 / this.props.values.length}
				max={600}
				minDistance={120 / this.props.values.length}
				step={60 / this.props.values.length}
				value={this.props.values}
				onAfterChange={this.props.handleWeightChange}
				pearling={true}
			/>
 		);
	}
}

export default SliderWeighted;