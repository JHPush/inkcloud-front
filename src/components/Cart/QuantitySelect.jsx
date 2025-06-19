import React from 'react';

const QuantitySelect = ({ quantity, onChange }) => (
  <select
    value={quantity}
    onChange={(e) => onChange(parseInt(e.target.value))}
    className="mt-2 border rounded px-2 py-1"
  >
    {[...Array(10)].map((_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ))}
  </select>
);

export default QuantitySelect;
