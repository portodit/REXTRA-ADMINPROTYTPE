import { LoaderCircle, LucideProps } from 'lucide-react'
import * as React from 'react'
type LucideIconType = React.ComponentType<LucideProps>
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type ButtonVariant =
  | 'primary'
  | 'danger'
  | 'warning'
  | 'success'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'green'
  | 'purple'
  | 'disabled'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonOutlined = 'base' | 'outlined'

type ButtonProps = {
  isLoading?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: LucideIconType
  rightIcon?: LucideIconType
  leftIconClassName?: string
  rightIconClassName?: string
  outlined?: ButtonOutlined
  asChild?: boolean
} & React.ComponentPropsWithRef<'button'>

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = 'primary',
      size = 'medium',
      outlined = 'base',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
      asChild = false,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const disabled = isLoading || buttonDisabled
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70',
          {
            small: 'px-3 py-1.5 text-sm gap-1',
            medium: 'px-4 py-2 text-base gap-2',
            large: 'px-5 py-3 text-lg gap-2',
          }[size],
          outlined === 'base' && {
            primary: 'bg-blue-600 text-white hover:bg-blue-700',
            danger: 'bg-red-600 text-white hover:bg-red-700',
            warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
            success: 'bg-green-600 text-white hover:bg-green-700',
            orange: 'bg-orange-500 text-white hover:bg-orange-600',
            pink: 'bg-pink-500 text-white hover:bg-pink-600',
            cyan: 'bg-cyan-500 text-white hover:bg-cyan-600',
            green: 'bg-emerald-500 text-white hover:bg-emerald-600',
            purple: 'bg-purple-600 text-white hover:bg-purple-700',
            disabled: 'bg-gray-300 text-gray-500',
          }[variant],
          outlined === 'outlined' && {
            primary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
            danger: 'border border-red-600 text-red-600 hover:bg-red-50',
            warning: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-50',
            success: 'border border-green-600 text-green-600 hover:bg-green-50',
            orange: 'border border-orange-500 text-orange-500 hover:bg-orange-50',
            pink: 'border border-pink-500 text-pink-500 hover:bg-pink-50',
            cyan: 'border border-cyan-500 text-cyan-500 hover:bg-cyan-50',
            green: 'border border-emerald-500 text-emerald-500 hover:bg-emerald-50',
            purple: 'border border-purple-600 text-purple-600 hover:bg-purple-50',
            disabled: 'border border-gray-300 text-gray-500',
          }[variant],
          className,
        )}
        {...rest}
      >
        <div className="flex items-center justify-center">
          {isLoading && (
            <div className={cn('mr-2', {
              'text-white': ['primary', 'danger', 'warning', 'success', 'orange', 'pink', 'purple'].includes(variant),
              'text-neutral-700': outlined === 'outlined',
            })}>
              <LoaderCircle size={18} className="animate-spin" />
            </div>
          )}
          {LeftIcon && (
            <div className={cn({ 'mr-3': size === 'large', 'mr-2': size !== 'large' })}>
              <LeftIcon size="1em" className={cn('text-base', leftIconClassName)} />
            </div>
          )}
          {children}
          {RightIcon && (
            <div className={cn({ 'ml-3': size === 'large', 'ml-2': size !== 'large' })}>
              <RightIcon size="1em" className={cn('text-base', rightIconClassName)} />
            </div>
          )}
        </div>
      </Comp>
    )
  },
)

CustomButton.displayName = 'CustomButton'

export default CustomButton
