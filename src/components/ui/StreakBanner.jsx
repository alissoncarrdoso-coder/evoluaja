import clsx from 'clsx'

export default function StreakBanner({ streak, frase, animando, compact = false }) {
  const cor = streak === 0
    ? 'from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 border-gray-100 dark:border-gray-800'
    : streak < 3
    ? 'from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-100 dark:border-amber-900'
    : streak < 7
    ? 'from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-100 dark:border-orange-900'
    : 'from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 border-orange-100 dark:border-orange-900'

  const iconSize = streak === 0 ? '🌱' : streak < 3 ? '🔥' : streak < 7 ? '🔥' : '🔥'
  const iconBg   = streak === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-orange-100 dark:bg-orange-900'

  if (compact) {
    return (
      <div className={clsx('flex items-center gap-3 bg-gradient-to-r rounded-3xl p-3.5 border', cor)}>
        <div className={clsx('w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0', iconBg)}>
          {iconSize}
        </div>
        <div className="flex-1 min-w-0">
          <p className={clsx('font-black text-sm leading-none', animando && 'animate-bounce',
            streak === 0 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-600 dark:text-orange-400')}>
            {streak === 0 ? 'Sem sequência' : `${streak} dia${streak > 1 ? 's' : ''} seguido${streak > 1 ? 's' : ''}!`}
          </p>
          {frase && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5 truncate">
              {frase.emoji} {frase.texto}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={clsx('flex items-center gap-3 bg-gradient-to-r rounded-3xl p-4 border', cor)}>
      <div className={clsx('w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0', iconBg)}>
        {iconSize}
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'font-black text-xl leading-none',
          animando && 'animate-bounce',
          streak === 0 ? 'text-gray-500 dark:text-gray-400' : 'text-orange-500'
        )}>
          {streak === 0
            ? 'Vamos começar!'
            : `${streak} dia${streak > 1 ? 's' : ''} seguido${streak > 1 ? 's' : ''}!`}
        </p>
        {frase && (
          <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mt-1 leading-snug">
            {frase.emoji} {frase.texto}
          </p>
        )}
      </div>
    </div>
  )
}
