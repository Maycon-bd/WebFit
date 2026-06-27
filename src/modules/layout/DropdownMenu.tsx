import React, { useEffect, useRef } from 'react';

interface DropdownOption {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  isOpen: boolean;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
