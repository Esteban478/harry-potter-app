import { ChangeEvent } from 'react';

interface SelectProps<T> {
  options: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  onChange: (value: T | null) => void;
  placeholder?: string;
  value?: T | null;
}

export function Select<T>({
  options,
  labelKey,
  valueKey,
  onChange,
  placeholder = 'Select an option',
  value,
}: SelectProps<T>) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find((option) => String(option[valueKey]) === selectedValue) || null;
    onChange(selectedOption);
  };

  return (
    <select
      value={value ? String(value[valueKey]) : ''}
      onChange={handleChange}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={String(option[valueKey])} value={String(option[valueKey])}>
          {String(option[labelKey])}
        </option>
      ))}
    </select>
  );
}