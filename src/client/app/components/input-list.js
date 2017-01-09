import React from 'react';

const InputList = (props) => (
  <ul>
    {props.fields.map(function(field) {
      return (
        <li key={field.name}>
          <label className="form-label">{field.name}</label>
          <input
            name={field.name}
            type="text"
            value={field.value}
            onChange={props.onChange}/>
          <a
            name={field.name}
            onClick={props.removeFunc}>Remove
          </a>
        </li>
      );
    })}
  </ul>
);

InputList.propTypes = {  
  fields: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired
}

export default InputList;