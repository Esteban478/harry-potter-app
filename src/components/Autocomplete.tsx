import { useState, useEffect, useRef } from 'react';
import '../styles/Autocomplete.css';

interface AutocompleteProps<T> {
  options: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  onChange: (value: T | null) => void;
  placeholder?: string;
  allowCustom?: boolean;
  value?: T | null;
}

export function Autocomplete<T>({
  options,
  labelKey,
  valueKey,
  onChange,
  placeholder = 'Select an option',
  allowCustom = false,
  value
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState(value ? String(value[labelKey]) : '');
  const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setInputValue(String(value[labelKey]));
    }
  }, [value, labelKey]);

  useEffect(() => {
    const filtered = options.filter((option) =>
      String(option[labelKey]).toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setSelectedIndex(-1);
  }, [inputValue, options, labelKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: T) => {
    setInputValue(String(option[labelKey]));
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
        handleOptionClick(filteredOptions[selectedIndex]);
      } else if (allowCustom && inputValue) {
        onChange({ [labelKey]: inputValue, [valueKey]: inputValue } as T);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="autocomplete">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
      />
      {isOpen && (
        <ul className="options">
          {filteredOptions.map((option, index) => (
            <li
              key={String(option[valueKey])}
              onClick={() => handleOptionClick(option)}
              className={index === selectedIndex ? 'selected' : ''}
            >
              {String(option[labelKey])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}