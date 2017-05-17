import React from 'react';

const ValueList = (props) => (
  <ul>
    {props.values.map(function(val) {
      return (
        <li key={val} id={val}>
          <span className="legend-icon"></span>
          <a
            name={val}
            onClick={props.removeFunc}>
            X
          </a>
					{val}
        </li>
      );
    })}
  </ul>
);

ValueList.propTypes = {  
  values: React.PropTypes.array.isRequired
}

export default ValueList;