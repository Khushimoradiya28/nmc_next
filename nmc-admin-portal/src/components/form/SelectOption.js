import React from "react";
import Select from "react-select";

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  labelKey = "name",
  valueKey = "_id",
}) => {
  const formatted = options.map(item => ({
    value: item[valueKey],
    label: item[labelKey],
  }));

  return (
    <Select
      options={formatted}
      isMulti
      closeMenuOnSelect={false}
      value={formatted.filter(f => value.includes(f.value))}
      onChange={(selected) => {
        const values = selected ? selected.map(s => s.value) : [];
        onChange(values); // <-- MUST exist
      }}
      className="text-black"
      classNamePrefix="react-select"
    />
  );
};

export default MultiSelect;
