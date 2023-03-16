import { ReactNode, Suspense } from 'react'
import { FullLoadingSpinner } from '~/component/lib'

export default function TopAppShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<FullLoadingSpinner />}>
      <div className="min-h-full">
        {/* <TopNavBar /> */}

        <div className="pt-[4rem]">
          <main className="mx-auto max-w-6xl sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
