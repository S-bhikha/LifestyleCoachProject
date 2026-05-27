import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import Onboarding from './components/onboarding/Onboarding';

function AppContent() {
  const { user } = useApp();
  return user ? <Layout /> : <Onboarding />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
