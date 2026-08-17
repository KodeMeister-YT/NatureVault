import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home/HomePage';
import { DiscoverPage } from './pages/Discover/DiscoverPage';
import { AboutPage } from './pages/About/AboutPage';
import { ArchivePage } from './pages/Archive/ArchivePage';
import { MyVaultPage } from './pages/MyVault/MyVaultPage';
import { ImpactPage } from './pages/Impact/ImpactPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';
import { VaultLoadingScreen } from './components/Vault/VaultLoadingScreen';

const VaultPage = lazy(() =>
  import('./pages/Vault/VaultPage').then((m) => ({ default: m.VaultPage })),
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route
        path="/vault/:ecosystemId"
        element={
          <Suspense fallback={<VaultLoadingScreen onDone={() => {}} />}>
            <VaultPage />
          </Suspense>
        }
      />
      <Route path="/archive" element={<ArchivePage />} />
      <Route path="/my-vault" element={<MyVaultPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
