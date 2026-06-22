import React, { useEffect, useRef } from 'react';

const DropdownMenu = ({ options, isOpen, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dropdown-menu" ref={dropdownRef}>
      {options.map((option, idx) => (
        <button
          key={idx}
          className="dropdown-item"
          onClick={() => {
            option.onClick();
            onClose();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default DropdownMenu;
