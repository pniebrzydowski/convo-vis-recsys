import React from 'react';
import ReactSlider from 'react-slider';

class SliderMulti extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var self = this;

		if (this.props.values.length <= 1) {
			return null;
		}

		var weightChange = function weightChange(value) {
			var name = this.name;
			var vals = [];

			for(var i=0; i<self.props.values.length; i++) {
				if(self.props.values[i].name === name) vals.push(value);
				else vals.push(self.props.values[i].weight);
			}
			self.props.handleWeightChange(vals);
		};

		return (
			<div className="weight-sliders">
				{this.props.values.map(function (val) {
					return (
						<ReactSlider
							key={val.name}
							name={val.name}
							min={2}
							max={10}
							orientation={"horizontal"}
							value={val.weight}
							onAfterChange={weightChange}
						/>
					);
				})}
			</div>
		);
	}
}

export default SliderMulti;