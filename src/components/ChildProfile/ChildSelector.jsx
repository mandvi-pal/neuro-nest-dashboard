import React from 'react';

function ChildSelector({ childrenList, onSelect }) {
  return (
    <select onChange={(e) => onSelect(childrenList[e.target.value])}>
      {childrenList.map((child, index) => (
        <option key={index} value={index}>{child.name}</option>
      ))}
    </select>
  );
}

export default ChildSelector;
