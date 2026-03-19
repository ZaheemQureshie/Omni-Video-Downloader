import { motion } from 'framer-motion';

export default function ProgressBar({ percent = 0, color = 'indigo' }) {
  const gradientMap = {
    indigo: 'from-indigo-500 to-purple-500',
    red: 'from-red-500 to-rose-500',
    pink: 'from-pink-500 to-purple-500',
    cyan: 'from-cyan-400 to-blue-500',
    blue: 'from-blue-500 to-indigo-500',
    yellow: 'from-yellow-400 to-orange-500',
    green: 'from-green-500 to-emerald-500',
  };
  const grad = gradientMap[color] || gradientMap.indigo;

  return (
    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${grad} relative`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(percent, 100)}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[shimmer_1.5s_infinite]" />
      </motion.div>
    </div>
  );
}
