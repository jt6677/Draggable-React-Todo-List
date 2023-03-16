import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import TopAppShell from '~/AppShell'

export default function App() {
  // const { data: setting, isLoading: loadingSetting, isError: errorSetting } = useSetting()
  // const onboardingCompleted = setting?.onboarding_completed || false
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes />}>
          {/* working page for layered project  */}
          <Route
            path="/p/:project_id/:block_id/:action_id"
            element={<TopAppShell>something</TopAppShell>}
          />

          <Route path="/*" element={<Navigate to={`/`} />} />
        </Route>
      </Routes>
    </>
  )
}

const PrivateRoutes = () => {
  // const { user, isLoading } = useAuth()
  const user = 'user'
  if (
    user
    // isLoading === false &&
    // loadingSetting === false &&
    // errorSetting === false &&
    // setting.onboarding_welcome
    // setting.onboarding_completed
  ) {
    return <Outlet />
  }
  if (!user) {
    return <Navigate to="/" />
  }

  return null
}
