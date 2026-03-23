'use client'

import { cn } from '@/lib/utils'
// 1. Tambahkan StaticImageData di import
import Image, { ImageProps, StaticImageData } from 'next/image'
import * as React from 'react'

type BaseProps = {
  useSkeleton?: boolean
  imgClassName?: string
  serverStaticImg?: boolean
  blurClassName?: string
  alt: string
}

type NextImageProps = BaseProps &
  (
    | {
        width: number | `${number}`
        height: number | `${number}`
        fill?: false
      }
    | { fill: true; width?: never; height?: never }
  ) &
  Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'fill'> & {
    // 2. PERBAIKAN DISINI: Ganti 'any' dengan 'StaticImageData'
    src: string | StaticImageData
  }

export default function NextImage({
  useSkeleton = false,
  serverStaticImg = false,
  src,
  width,
  height,
  alt,
  className,
  imgClassName,
  blurClassName,
  fill,
  ...rest
}: NextImageProps) {
  const [status, setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete',
  )
  const widthIsSet = className?.includes('w-') ?? false

  return (
    <figure
      style={
        !fill && !widthIsSet && width ? { width: `${width}px` } : undefined
      }
      className={cn(className, fill && 'relative h-full w-full')}
    >
      <Image
        className={cn(
          imgClassName,
          status === 'loading' &&
            cn('animate-pulse bg-gray-200', blurClassName),
        )}
        src={serverStaticImg || typeof src !== 'string' ? src : '/images' + src}
        width={width as ImageProps['width']}
        height={height as ImageProps['height']}
        fill={fill}
        alt={alt}
        onLoad={() => setStatus('complete')}
        {...rest}
      />
    </figure>
  )
}
