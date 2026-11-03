'use client';
import * as Select from '@radix-ui/react-select';
import { CalendarDays, Check, ChevronDown } from 'lucide-react';
export function DateSelect({
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="date-field">
      <span id={`${name}-label`}>{label}</span>
      <input type="hidden" name={name} value={value} />
      <Select.Root
        value={value || 'undecided'}
        onValueChange={(v) => onChange(v === 'undecided' ? '' : v)}
        disabled={disabled}
      >
        <Select.Trigger
          className="date-trigger"
          aria-labelledby={`${name}-label`}
        >
          <CalendarDays size={18} />
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={17} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="date-options"
            position="popper"
            sideOffset={8}
            collisionPadding={15}
          >
            <Select.Viewport>
              <Select.Item className="date-option" value="undecided">
                <Select.ItemText>{placeholder}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
              {options.map((o) => (
                <Select.Item
                  className="date-option"
                  key={o.value}
                  value={o.value}
                >
                  <Select.ItemText>{o.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
