import { motion } from 'framer-motion';

const CircleProgress = ({
  percentage,
  size = 90,
  strokeWidth = 8,
  color = '#6366F1',
  label = '',
  trackClassName = 'text-slate-200',
  valueClassName = 'text-slate-900',
  labelClassName = 'text-slate-500',
}) => {
  const safePercentage = Math.max(0, Math.min(100, Number(percentage) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle track */}
          <circle
            className={trackClassName}
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Animated active path */}
          <motion.circle
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-base font-extrabold ${valueClassName}`}>{safePercentage}%</span>
        </div>
      </div>
      {label && (
        <span className={`mt-2 text-xs font-semibold tracking-wider uppercase ${labelClassName}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default CircleProgress;
