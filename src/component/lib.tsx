import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RingSpinner, SphereSpinner } from 'react-spinners-kit'

export function FullLoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="centerAbsolute pt-8 pb-6  ">
      <LoadingSpinner message={message} />
    </div>
  )
}
export function useTimer({ counting }: { counting: boolean }) {
  const [time, setTime] = useState(12)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (counting) {
      // Start countdown from 12
      setTime(12)
      // Interval every 100ms
      intervalId = setInterval(() => {
        setTime((prev) => {
          // Stop countdown if time is up
          if (prev <= 0.1) {
            clearInterval(intervalId as NodeJS.Timeout)
            return 0
          }
          return prev - 0.1
        })
      }, 100)
    }
    if (!counting) {
      clearInterval(intervalId as NodeJS.Timeout)
      setTime(12)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }, [counting])

  // only return 1 decimal place
  return Math.round(time * 10) / 10
}

export function AISpinner({ message }: { message?: string }) {
  return (
    <div className="centerAbsolute pt-8 pb-6  ">
      <div className="flex flex-col items-center justify-center">
        <RingSpinner color="#10b981" size={40} />
        <span className="pt-4 text-center text-secondaryText">{message}</span>
      </div>
    </div>
  )
}
export function FullError() {
  return (
    <div className="centerAbsolute pt-8 pb-6  ">
      <ShowError />
    </div>
  )
}
export function LoadingSpinner({ message }: { message?: string }) {
  const { t, i18n } = useTranslation('home')
  return (
    <div className="flex flex-col items-center justify-center">
      <SphereSpinner color="#c5cad3" size={40} />
      <span className="pt-4 text-center text-secondaryText">
        {!message ? t('generic.loading') : message}
      </span>
    </div>
  )
}
export function ShowError() {
  const { t, i18n } = useTranslation('home')
  return (
    <div className="flex flex-col items-center justify-center">
      <ExclamationCircleIcon className="h-10 w-10" />
      <span className="pt-2 text-secondaryText">{t('error.unknownError')}</span>
      <span>{t('error.refresh')}</span>
    </div>
  )
}
