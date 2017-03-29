import React from 'react';
import ReactSlider from 'react-slider';

const SliderMulti = (props) => (
	<div className="weight-sliders">
		{props.values.map(function(val) {
			return (
				<ReactSlider
					key={val.name}
					min={1}
					max={10}
					value={val.weight}
					onAfterChange={props.handleWeightChange}
					pearling={true}
				/>
			);
		})}
	</div>
);

export default SliderMulti;