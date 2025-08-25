import React from 'react'
import { cn } from '@/lib/utils'
interface ProgressBarProps {
    value: number,
    max?: number,
    className?: string,

}
const ProgressBar = ({ value, max = 100, className }: ProgressBarProps) => {
    const percentage = Math.min(Math.max(value, 0), max);

    return (
        <div className={cn('w-full h-2 bg-gray-200 rounded-full, overflow-hidden', className)}>
            <div className="bg-indigo-700 h-full transition-all duration-300 ease-out" style={{width:`${percentage}%`}} role='progressbar' aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={max}></div>
        </div>
    )
}

export default ProgressBar
