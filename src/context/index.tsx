import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'react-hot-toast'
import { FullLoadingSpinner } from '~/component/lib'

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <Suspense fallback={<FullLoadingSpinner />}>
        {children}
        <Toaster />
      </Suspense>
    </ErrorBoundary>
  )
}
export default AppProviders

function FullPageErrorFallback({ error }: { error: Error }) {
  return (
    <div
      role="alert"
      className="flex h-[100vh] flex-col items-center justify-center text-red-500"
      // css={{
      //   color: 'red',
      //   height: '100vh',
      //   display: 'flex',
      //   flexDirection: 'column',
      //   justifyContent: 'center',
      //   alignItems: 'center',
      // }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  )
}
