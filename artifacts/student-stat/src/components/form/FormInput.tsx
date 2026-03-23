import { useState } from 'react'
import { RegisterOptions, get, useFormContext } from 'react-hook-form'
import ErrorMessage from '@/components/form/ErrorMessage'
import HelperText from '@/components/form/HelperText'
import LabelText from '@/components/form/LabelText'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, LucideProps } from 'lucide-react'

type LucideIconType = React.ComponentType<LucideProps>

export type FormInputProps = {
  id: string
  label?: string
  helperText?: React.ReactNode
  helperTextClassName?: string
  labelTextClasname?: string
  hideError?: boolean
  validation?: RegisterOptions
  prefix?: string
  suffix?: string
  rightIcon?: LucideIconType
  leftIcon?: LucideIconType
  rightIconClassName?: string
  leftIconClassName?: string
} & React.ComponentPropsWithoutRef<'input'>

export default function FormInput({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  prefix,
  suffix,
  className,
  type = 'text',
  readOnly = false,
  rightIcon: RightIcon,
  leftIcon: LeftIcon,
  rightIconClassName,
  leftIconClassName,
  helperTextClassName,
  labelTextClasname,
  ...rest
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const [showPassword, setShowPassword] = useState(false)
  const error = get(errors, id)

  return (
    <div className="space-y-2">
      {label && (
        <LabelText
          required={validation?.required ? true : false}
          labelTextClasname={labelTextClasname}
        >
          {label}
        </LabelText>
      )}

      <div className="relative flex w-full gap-0">
        <div className={cn('pointer-events-none absolute h-full w-full rounded-md')} />

        {prefix && (
          <p className="flex w-min items-center rounded-l-md border-r bg-slate-50 px-3 text-sm text-gray-600">
            {prefix}
          </p>
        )}

        <div
          className={cn(
            'relative w-full rounded-md',
            prefix && 'rounded-l-md',
            suffix && 'rounded-r-md',
          )}
        >
          {LeftIcon && (
            <div
              className={cn(
                'absolute left-0 top-0 h-full',
                'flex items-center justify-center pl-2.5',
                'text-lg text-gray-900 md:text-xl',
                leftIconClassName,
              )}
            >
              <LeftIcon />
            </div>
          )}

          <input
            {...register(id, validation)}
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            id={id}
            name={id}
            readOnly={readOnly}
            disabled={readOnly}
            className={cn(
              'h-full w-full rounded-md border border-gray-500 px-3 py-2.5 caret-gray-900',
              [LeftIcon && 'pl-9', RightIcon && 'pr-9'],
              'focus:outline-1 focus:outline-gray-900 focus:ring-inset',
              'text-sm',
              'hover:ring-1 hover:ring-inset hover:ring-gray-900',
              'placeholder:text-sm placeholder:text-gray-500',
              'text-gray-900',
              readOnly && 'cursor-not-allowed',
              error &&
                'border-none ring-2 ring-inset ring-red-500 placeholder:text-gray-500 focus:ring-red-500',
              prefix && 'rounded-l-none rounded-r-md',
              suffix && 'rounded-l-md rounded-r-none',
              prefix && suffix && 'rounded-none',
              className,
            )}
            aria-describedby={id}
            {...rest}
          />

          {RightIcon && type !== 'password' && (
            <div
              className={cn(
                'absolute bottom-0 right-0 h-full',
                'flex items-center justify-center pr-2.5',
                'text-lg text-gray-900 md:text-xl',
                rightIconClassName,
              )}
            >
              <RightIcon />
            </div>
          )}

          {type === 'password' && (
            <div
              className={cn(
                'absolute bottom-0 right-0 h-full',
                'flex items-center justify-center pr-3',
                'text-lg text-gray-900 md:text-xl cursor-pointer',
                rightIconClassName,
              )}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </div>
          )}
        </div>

        {suffix && (
          <p className="flex w-min items-center rounded-r-md border-l bg-slate-50 px-3 text-sm text-gray-600">
            {suffix}
          </p>
        )}
      </div>

      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {helperText && (
        <HelperText helperTextClassName={helperTextClassName}>{helperText}</HelperText>
      )}
    </div>
  )
}
