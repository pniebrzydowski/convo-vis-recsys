import React from 'react';

const ValueList = (props) => (
  <ul>
    {props.values.map(function(val) {
      return (
        <li key={val}>
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