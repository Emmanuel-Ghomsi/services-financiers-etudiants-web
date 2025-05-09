'use client';

import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectComboboxProps {
  options: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
}: MultiSelectComboboxProps) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? options
      : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  const toggleSelection = (val: string) => {
    if (value && value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else if (value) {
      onChange([...value, val]);
    }
  };

  return (
    <Combobox as="div" value={value} onChange={(val) => onChange(val)} multiple>
      <div className="relative">
        <Combobox.Input
          className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={() =>
            value
              ? value
                  .map((val) => options.find((o) => o.value === val)?.label)
                  .filter(Boolean)
                  .join(', ')
              : ''
          }
          placeholder={placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
        </Combobox.Button>

        {filtered.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg text-sm">
            {filtered.map((opt) => (
              <Combobox.Option
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  cn(
                    'cursor-pointer select-none relative py-2 pl-10 pr-4',
                    active ? 'bg-blue-500 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}
                    >
                      {opt.label}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
