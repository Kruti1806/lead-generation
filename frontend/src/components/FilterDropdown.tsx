'use client';

interface FilterDropdownProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterDropdown({ currentFilter, onFilterChange }: FilterDropdownProps) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="filter" className="text-sm font-medium text-gray-700">
        Filter by:
      </label>
      <select
        id="filter"
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm transition-all"
      >
        <option value="All">All Leads</option>
        <option value="Hot">Hot</option>
        <option value="Warm">Warm</option>
        <option value="Cold">Cold</option>
      </select>
    </div>
  );
}
