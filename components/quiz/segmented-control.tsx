'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

type Option<T> = { value: T; label: string; hint?: string }

type Props<T extends string | number> = {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  const name = useId()

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex gap-1 rounded-xl bg-muted p-1">
        {options.map((option) => {
          const checked = option.value === value
          return (
            <label
              key={String(option.value)}
              className={cn(
                'flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-2 text-center transition has-focus-visible:ring-3 has-focus-visible:ring-ring/40',
                checked
                  ? 'bg-card text-primary shadow-sm ring-1 ring-primary/20'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="text-sm font-semibold">{option.label}</span>
              {option.hint && (
                <span className="hidden text-[11px] leading-tight sm:block">{option.hint}</span>
              )}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
