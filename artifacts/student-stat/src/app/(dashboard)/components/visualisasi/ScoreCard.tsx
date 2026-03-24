import Typography from '@/components/Typography'
import React from 'react'

interface ScoreCardProps {
  children: React.ReactNode
  title: string
  score: number
  outOf: number
  displayOutOf: boolean
  description: string
}

const ScoreCard = ({
  children,
  title,
  score,
  outOf,
  displayOutOf,
  description,
}: ScoreCardProps) => {
  return (
    <div className="w-full flex flex-col p-6 border-[1px] border-[#B5B7B8] rounded-xl">
      <div className="flex flex-row gap-x-3">
        {children}
        <Typography
          variant="bt"
          weight="semibold"
          font="Poppins"
          className="text-[#6B6F70] my-auto"
        >
          {title}
        </Typography>
      </div>
      <div className="flex flex-col">
        <Typography
          variant="h3"
          weight="bold"
          font="Poppins"
          className="text-black"
        >
          {displayOutOf === true ? (
            <span>
              {score}/{outOf}
            </span>
          ) : (
            <span>{score}</span>
          )}
        </Typography>
        <Typography
          variant="l1"
          weight="regular"
          font="Poppins"
          className="text-[#16A34A]"
        >
          {description}
        </Typography>
      </div>
    </div>
  )
}

export default ScoreCard
