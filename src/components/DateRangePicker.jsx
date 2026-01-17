// DateRangePicker.jsx
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const DateRangePicker = ({ 
  fromDate, 
  toDate, 
  onFromDateChange, 
  onToDateChange,
  label = "Date Range",
  showClearButton = true,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(fromDate);
  const [tempToDate, setTempToDate] = useState(toDate);

  useEffect(() => {
    setTempFromDate(fromDate);
    setTempToDate(toDate);
  }, [fromDate, toDate]);

  const handleApply = () => {
    onFromDateChange(tempFromDate);
    onToDateChange(tempToDate);
    setIsOpen(false);
  };

  const handleClear = () => {
    onFromDateChange(null);
    onToDateChange(null);
    setTempFromDate(null);
    setTempToDate(null);
    setIsOpen(false);
  };

  const formatDateDisplay = (date) => {
    if (!date) return 'Select dates';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CustomInput = ({ value, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-300/70 rounded-xl hover:border-gray-400/70 transition-all duration-300 group"
    >
      <div className="flex items-center space-x-2">
        <AiOutlineCalendar className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-300" />
        <span className="text-sm text-gray-700 font-sf-pro-text">
          {value || 'Select dates'}
        </span>
      </div>
      {showClearButton && (fromDate || toDate) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          className="p-1 hover:bg-gray-200/50 rounded-full transition-colors duration-200"
        >
          <FiX className="h-3 w-3 text-gray-500 hover:text-gray-700" />
        </button>
      )}
    </button>
  );

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300/50">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-2 rounded-lg hover:bg-gray-200/50 transition-colors duration-200 disabled:opacity-30"
      >
        <FiChevronLeft className="h-4 w-4 text-gray-700" />
      </button>
      <div className="text-sm font-medium text-gray-800 font-sf-pro">
        {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-2 rounded-lg hover:bg-gray-200/50 transition-colors duration-200 disabled:opacity-30"
      >
        <FiChevronRight className="h-4 w-4 text-gray-700" />
      </button>
    </div>
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 font-sf-pro-medium">
          {label}
        </label>
      )}
      
      <div className="relative">
        <DatePicker
          selected={fromDate}
          onChange={(dates) => {
            const [start, end] = dates;
            setTempFromDate(start);
            setTempToDate(end);
          }}
          startDate={tempFromDate}
          endDate={tempToDate}
          selectsRange
          selectsDisabledDaysInRange
          minDate={new Date(2020, 0, 1)}
          maxDate={new Date(2030, 11, 31)}
          customInput={<CustomInput />}
          renderCustomHeader={renderCustomHeader}
          isClearable={false}
          showPopperArrow={false}
          popperPlacement="bottom-start"
          popperModifiers={[
            {
              name: 'offset',
              options: {
                offset: [0, 8],
              },
            },
          ]}
          calendarClassName="font-sf-pro"
          dayClassName={(date) => {
            const baseClasses = "!w-9 !h-9 rounded-lg !text-sm font-sf-pro-text transition-all duration-200 hover:bg-gray-200/70";
            
            if (date.getTime() === tempFromDate?.getTime() || 
                date.getTime() === tempToDate?.getTime()) {
              return `${baseClasses} bg-gray-900 text-white hover:bg-gray-800`;
            }
            
            if (tempFromDate && tempToDate && 
                date > tempFromDate && date < tempToDate) {
              return `${baseClasses} bg-gray-100/70 text-gray-800 hover:bg-gray-200/90`;
            }
            
            return baseClasses;
          }}
          weekDayClassName={() => "!text-xs font-sf-pro-medium text-gray-500 !py-2"}
          disabledDayClassName="!text-gray-400 !cursor-not-allowed hover:!bg-transparent"
          wrapperClassName="w-full"
          popperClassName="!z-50"
        />

        {/* Selected Range Display */}
        {(fromDate || toDate) && (
          <div className="absolute -bottom-7 left-0 right-0 flex justify-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-300/50 rounded-lg">
              <span className="text-xs text-gray-600 font-sf-pro-text">
                {formatDateDisplay(fromDate)}
              </span>
              <div className="h-px w-3 bg-gray-400/50" />
              <span className="text-xs text-gray-600 font-sf-pro-text">
                {formatDateDisplay(toDate)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Date Presets */}
      <div className="flex flex-wrap gap-2 pt-2">
        {[
          { label: 'Today', days: 0 },
          { label: 'Yesterday', days: -1 },
          { label: 'Last 7 days', days: -7 },
          { label: 'Last 30 days', days: -30 },
          { label: 'This month', getDates: () => {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return [start, end];
          }},
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => {
              let start, end;
              if (preset.getDates) {
                [start, end] = preset.getDates();
              } else {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                start = new Date(today);
                start.setDate(today.getDate() + preset.days);
                end = preset.days === 0 ? new Date(today) : new Date(today);
              }
              onFromDateChange(start);
              onToDateChange(end);
            }}
            className="px-3 py-1.5 text-xs bg-white/50 backdrop-blur-sm border border-gray-300/50 rounded-lg hover:bg-white/80 hover:border-gray-400/70 transition-all duration-300 text-gray-700 font-sf-pro-text"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Add Apple fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&family=SF+Pro+Text:wght@300;400;500;600&display=swap');
        
        .font-sf-pro {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        .font-sf-pro-text {
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        .font-sf-pro-medium {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-weight: 500;
        }
        
        /* Custom DatePicker Styles */
        .react-datepicker {
          border: 1px solid rgba(209, 213, 219, 0.5) !important;
          border-radius: 12px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1) !important;
          font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        .react-datepicker__header {
          background: transparent !important;
          border-bottom: 1px solid rgba(209, 213, 219, 0.5) !important;
          border-radius: 12px 12px 0 0 !important;
          padding-top: 0 !important;
        }
        
        .react-datepicker__current-month {
          color: #374151 !important;
          font-family: 'SF Pro Display', -apple-system, sans-serif !important;
          font-weight: 600 !important;
          font-size: 14px !important;
        }
        
        .react-datepicker__day--selected,
        .react-datepicker__day--in-selecting-range,
        .react-datepicker__day--in-range {
          background-color: #111827 !important;
          color: white !important;
          border-radius: 8px !important;
        }
        
        .react-datepicker__day--selected:hover,
        .react-datepicker__day--in-selecting-range:hover,
        .react-datepicker__day--in-range:hover {
          background-color: #1f2937 !important;
        }
        
        .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {
          background-color: rgba(209, 213, 219, 0.5) !important;
          color: #374151 !important;
        }
        
        .react-datepicker__day--keyboard-selected {
          background-color: rgba(17, 24, 39, 0.1) !important;
          color: #374151 !important;
          border-radius: 8px !important;
        }
        
        .react-datepicker__day:hover {
          background-color: rgba(209, 213, 219, 0.7) !important;
          border-radius: 8px !important;
        }
        
        .react-datepicker__day--outside-month {
          color: #9ca3af !important;
        }
        
        .react-datepicker__triangle {
          display: none !important;
        }
        
        .react-datepicker__month-container {
          padding: 8px !important;
        }
        
        .react-datepicker__navigation {
          top: 16px !important;
        }
        
        .react-datepicker__navigation--previous {
          left: 16px !important;
        }
        
        .react-datepicker__navigation--next {
          right: 16px !important;
        }
        
        .react-datepicker__navigation-icon::before {
          border-color: #6b7280 !important;
          border-width: 2px 2px 0 0 !important;
          width: 6px !important;
          height: 6px !important;
        }
        
        .react-datepicker__navigation:hover *::before {
          border-color: #374151 !important;
        }
        
        .react-datepicker__day-name {
          color: #6b7280 !important;
          font-weight: 500 !important;
          font-size: 12px !important;
          width: 36px !important;
          line-height: 24px !important;
        }
        
        .react-datepicker__day {
          width: 36px !important;
          line-height: 36px !important;
          margin: 2px !important;
          font-size: 14px !important;
          color: #374151 !important;
        }
        
        .react-datepicker__input-container input {
          background: rgba(255, 255, 255, 0.6) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(209, 213, 219, 0.7) !important;
          border-radius: 10px !important;
          padding: 12px 40px 12px 12px !important;
          font-family: 'SF Pro Text', -apple-system, sans-serif !important;
          font-size: 14px !important;
          color: #374151 !important;
          transition: all 0.3s ease !important;
        }
        
        .react-datepicker__input-container input:focus {
          outline: none !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .react-datepicker__input-container input::placeholder {
          color: #9ca3af !important;
        }
      `}</style>
    </div>
  );
};

export default DateRangePicker;