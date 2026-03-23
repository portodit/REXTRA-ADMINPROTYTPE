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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
          'inline-flex items-center justify-center font-medium',
          'focus:outline-none focus-visible:ring',
          'shadow-sm',
          'duration-50 transition-colors',
          //#region  //*=========== Size ===========
          [
            size === 'large' && [
              'min-h-fit rounded-md px-7 py-3',
              'text-[16px] leading-[24px]',
              'max-md:text-[14px] max-md:leading-[18px]',
            ],
            size === 'medium' && [
              'min-h-fit rounded-md px-5 py-2',
              'text-[14px] leading-[18px]',
              'max-md:text-[12px] max-md:leading-[16px]',
            ],
            size === 'small' && [
              'min-h-fit rounded-sm px-4 py-1',
              'text-[12px] leading-[16px]',
              'max-md:text-[10px] max-md:leading-[14 px]',
            ],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              outlined === 'base' && [
                'bg-info-main text-white',
                'border border-info-main hover:border-info-hover',
                'hover:bg-info-hover hover:text-white',
                'active:bg-info-pressed',
                'disabled:bg-info-pressed',
                'focus-visible:ring-info-active',
              ],
              outlined === 'outlined' && [
                'border border-info-main bg-info-main/0 text-info-main',
                'hover:border-info-hover hover:text-info-hover',
                'active:text-info-main',
                'disabled:text-info-pressed',
                'focus-visible:ring-info-active',
              ],
            ],
            variant === 'danger' && [
              outlined === 'base' && [
                'bg-danger-main text-white',
                'border border-danger-main hover:border-danger-hover',
                'hover:bg-danger-hover hover:text-white',
                'active:bg-danger-pressed',
                'disabled:bg-danger-pressed',
                'focus-visible:ring-danger-active',
              ],
              outlined === 'outlined' && [
                'border border-danger-main bg-danger-main/0 text-danger-main',
                'hover:border-danger-hover hover:text-danger-hover',
                'active:text-danger-main',
                'disabled:text-danger-pressed',
                'focus-visible:ring-danger-active',
              ],
            ],
            variant === 'warning' && [
              outlined === 'base' && [
                'bg-warning-main text-white',
                'border border-warning-main hover:border-warning-hover',
                'hover:bg-warning-hover hover:text-white',
                'active:bg-warning-pressed',
                'disabled:bg-warning-pressed',
                'focus-visible:ring-warning-active',
              ],
              outlined === 'outlined' && [
                'border border-warning-main bg-warning-main/0 text-warning-main',
                'hover:border-warning-hover hover:text-warning-hover',
                'active:text-warning-main',
                'disabled:text-warning-pressed',
                'focus-visible:ring-warning-active',
              ],
            ],
            variant === 'success' && [
              outlined === 'base' && [
                'bg-success-main text-white',
                'border border-success-main hover:border-success-hover',
                'hover:bg-success-hover hover:text-white',
                'active:bg-success-pressed',
                'disabled:bg-success-pressed',
                'focus-visible:ring-success-active',
              ],
              outlined === 'outlined' && [
                'border border-success-main bg-success-main/0 text-success-main',
                'hover:border-success-hover hover:text-success-hover',
                'active:text-success-main',
                'disabled:text-success-pressed',
                'focus-visible:ring-success-active',
              ],
            ],
            variant === 'orange' && [
              outlined === 'base' && [
                'bg-orange-10 text-white',
                'border border-orange-10 hover:border-orange-20',
                'hover:bg-orange-20 hover:text-white',
                'active:bg-orange-30',
                'disabled:bg-orange-30',
                'focus-visible:ring-orange-30',
              ],
              outlined === 'outlined' && [
                'border border-orange-10 bg-orange-10/0 text-orange-10',
                'hover:border-orange-20 hover:text-orange-20',
                'active:text-orange-10',
                'disabled:text-orange-30',
                'focus-visible:ring-orange-30',
              ],
            ],
            variant === 'pink' && [
              outlined === 'base' && [
                'bg-pink-10 text-white',
                'border border-pink-10 hover:border-pink-20',
                'hover:bg-pink-20 hover:text-white',
                'active:bg-pink-30',
                'disabled:bg-pink-30',
                'focus-visible:ring-pink-30',
              ],
              outlined === 'outlined' && [
                'border border-pink-10 bg-pink-10/0 text-pink-10',
                'hover:border-pink-20 hover:text-pink-20',
                'active:text-pink-10',
                'disabled:text-pink-30',
                'focus-visible:ring-pink-30',
              ],
            ],
            variant === 'green' && [
              outlined === 'base' && [
                'bg-green-10 text-white',
                'border border-green-10 hover:border-green-20',
                'hover:bg-green-20 hover:text-white',
                'active:bg-green-30',
                'disabled:bg-green-30',
                'focus-visible:ring-green-30',
              ],
              outlined === 'outlined' && [
                'border border-green-10 bg-green-10/0 text-green-10',
                'hover:border-green-20 hover:text-green-20',
                'active:text-green-10',
                'disabled:text-green-30',
                'focus-visible:ring-green-30',
              ],
            ],
            variant === 'purple' && [
              outlined === 'base' && [
                'bg-purple-10 text-white',
                'border border-purple-10 hover:border-purple-20',
                'hover:bg-purple-20 hover:text-white',
                'active:bg-purple-30',
                'disabled:bg-purple-30',
                'focus-visible:ring-purple-30',
              ],
              outlined === 'outlined' && [
                'border border-purple-10 bg-purple-10/0 text-purple-10',
                'hover:border-purple-20 hover:text-purple-20',
                'active:text-purple-10',
                'disabled:text-purple-30',
                'focus-visible:ring-purple-30',
              ],
            ],
            variant === 'cyan' && [
              outlined === 'base' && [
                'bg-cyan-10 text-white',
                'border border-cyan-10 hover:border-cyan-20',
                'hover:bg-cyan-20 hover:text-white',
                'active:bg-cyan-30',
                'disabled:bg-cyan-30',
                'focus-visible:ring-cyan-30',
              ],
              outlined === 'outlined' && [
                'border border-cyan-10 bg-cyan-10/0 text-cyan-10',
                'hover:border-cyan-20 hover:text-cyan-20',
                'active:text-cyan-10',
                'disabled:text-cyan-30',
                'focus-visible:ring-cyan-30',
              ],
            ],

            // disabled bisa diatur2 lagi
            variant === 'disabled' && [
              'bg-neutral-20 text-neutral-70',
              'shadow-none',
              outlined === 'outlined' &&
                'border border-neutral-20 bg-neutral-50/0 text-neutral-70',
            ],

            // variant === 'outline' && [
            //   'text-black',
            //   'border border-gray-300',
            //   'hover:bg-slate-200 focus-visible:ring-gray-400 active:bg-slate-500 disabled:bg-slate-500',
            // ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          isLoading &&
            'relative text-transparent transition-none hover:text-transparent disabled:cursor-wait',
          className,
        )}
        {...rest}
      >
        <div className="flex items-center">
          {isLoading && (
            <div
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                'transition-opacity duration-200 ease-in-out',
                // Logic: Jika loading, opacity 0 (transparan). Jika tidak, opacity 100 (muncul)
                isLoading ? 'opacity-0' : 'opacity-100',
                {
                  'text-white': [
                    'green',
                    'red',
                    'yellow',
                    'primary',
                    'danger',
                    'success',
                    'warning',
                    'orange',
                    'pink',
                    'purple',
                  ].includes(variant),
                  'text-neutral-70': outlined === 'outlined',
                },
              )}
            >
              <LoaderCircle size={18} className="animate-spin" />
            </div>
          )}
          {LeftIcon && (
            <div
              className={cn([
                size === 'large' && 'mr-3',
                size === 'medium' && 'mr-2',
                size === 'small' && 'mr-2',
              ])}
            >
              <LeftIcon
                size="1em"
                className={cn('text-base', leftIconClassName)}
              />
            </div>
          )}
          {children}
          {RightIcon && (
            <div
              className={cn([
                size === 'large' && 'ml-3',
                size === 'medium' && 'ml-2',
                size === 'small' && 'ml-2',
              ])}
            >
              <RightIcon
                size="1em"
                className={cn('text-base', rightIconClassName)}
              />
            </div>
          )}
        </div>
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export default Button
