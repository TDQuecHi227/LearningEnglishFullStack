import React from 'react';

const InputField = ({ label, labelRight, id, type = 'text', placeholder, value, onChange, error, icon, ...props }) => {
  return (
    <div className="mb-4">
      {(label || labelRight) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
          )}
          {labelRight && (
            <div className="text-sm">
              {labelRight}
            </div>
          )}
        </div>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2 bg-[#F9FAFB] border rounded-lg focus:ring-1 focus:ring-[#387654] focus:border-[#387654] focus:outline-none transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-200'
          } placeholder-gray-400 text-gray-900`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
