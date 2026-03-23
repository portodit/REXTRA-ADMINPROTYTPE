import Typography from '@/components/Typography'

export default function ErrorMessage({ children }: { children: string }) {
  return (
    <div className="flex space-x-1">
      <Typography
        as="p"
        weight="regular"
        className="text-xs !leading-tight text-red-500"
      >
        {children}
      </Typography>
    </div>
  )
}
