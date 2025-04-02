'use client';
import { X } from 'lucide-react';
import ReactSelect, { type MultiValueProps, type Props } from 'react-select';
import type { MouseEvent as ReactMouseEvent } from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export type MultiSelectOption = {
  label: string;
  value: string;
};

export type MultiSelectProps = Props<MultiSelectOption, true> & {
  options: MultiSelectOption[];
  onChange: (value: MultiSelectOption[]) => void;
  value: MultiSelectOption[];
  className?: string;
  placeholder?: string;
};

const MultiValue = (props: MultiValueProps<MultiSelectOption, true>) => {
  return (
    <Badge variant="secondary" className="mr-1 my-0.5 h-fit">
      {props.data.label}
      <button
        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (props.removeProps?.onClick) {
            // Convertir l'événement en type attendu par react-select
            const syntheticEvent = {
              ...e,
              target: e.target,
              currentTarget: e.currentTarget,
              preventDefault: e.preventDefault.bind(e),
              stopPropagation: e.stopPropagation.bind(e),
              // Forcer le type pour satisfaire TypeScript
            } as unknown as ReactMouseEvent<HTMLDivElement, MouseEvent>;

            // Passer l'événement converti
            props.removeProps.onClick(syntheticEvent);
          }
        }}
        onMouseDown={(e) => {
          // Empêcher la propagation pour éviter des comportements indésirables
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <X className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">Retirer {props.data.label}</span>
      </button>
    </Badge>
  );
};

export function MultiSelect({
  options,
  value,
  onChange,
  className,
  placeholder = 'Sélectionner...',
  ...props
}: MultiSelectProps) {
  return (
    <ReactSelect
      isMulti
      options={options}
      value={value}
      onChange={(val) => onChange(val as MultiSelectOption[])}
      placeholder={placeholder}
      noOptionsMessage={() => 'Aucun résultat'}
      classNames={{
        control: ({ isFocused }) =>
          cn(
            'border-input px-3 py-2 bg-transparent rounded-md',
            isFocused ? 'border-primary ring-2 ring-primary/20' : '',
            className
          ),
        placeholder: () => 'text-muted-foreground',
        input: () => 'text-foreground',
        valueContainer: () => 'gap-1',
        menu: () => 'bg-popover border border-border rounded-md mt-1 overflow-hidden',
        option: ({ isFocused, isSelected }) =>
          cn(
            'px-3 py-2 cursor-pointer',
            isFocused && 'bg-accent',
            isSelected && 'bg-primary text-primary-foreground'
          ),
      }}
      components={{
        MultiValue,
      }}
      {...props}
    />
  );
}
