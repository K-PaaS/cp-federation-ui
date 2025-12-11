import { ReactNode, useMemo } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { Tabs } from '@/components/Tabs';
import { Toaster } from '@/components/Toaster';
import PageNotFound from '@/error/PageNotFound';
import Overview from '@/pages/Overview';
import Clusters from '@/pages/Clusters';
import Policies from '@/pages/Policies';
import Namespaces from '@/pages/Namespaces';
import Workloads from '@/pages/Workloads';
import ConfigMapsAndSecrets from '@/pages/ConfigMapsAndSecrets';

const queryClient = new QueryClient();

interface ContainerProps {
  children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

interface TabConfig {
  value: string;
  label: string;
  component: React.FC;
}

const TAB_CONFIGS: TabConfig[] = [
  { value: '/cpfedui/overview', label: 'Overview', component: Overview },
  { value: '/cpfedui/clusters', label: 'Clusters', component: Clusters },
  { value: '/cpfedui/policies', label: 'Policies', component: Policies },
  { value: '/cpfedui/namespaces', label: 'Namespaces', component: Namespaces },
  { value: '/cpfedui/workloads', label: 'Workloads', component: Workloads },
  {
    value: '/cpfedui/configmapsandsecrets',
    label: 'ConfigMaps&Secrets',
    component: ConfigMapsAndSecrets,
  },
];

const FederationTabs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = useMemo(() => {
    const { pathname } = location;
    const defaultPaths = ['/', '/cpfedui/', '/cpfedui'];

    if (defaultPaths.includes(pathname)) {
      return '/cpfedui/overview';
    }

    return pathname;
  }, [location.pathname]);

  const handleTabChange = (details: { value: string }) => {
    navigate(details.value);
  };

  const renderTabContent = () => {
    return match(currentTab)
      .with('/cpfedui/overview', () => (
        <Tabs.Content value='/cpfedui/overview'>
          <Overview />
        </Tabs.Content>
      ))
      .with('/cpfedui/clusters', () => (
        <Tabs.Content value='/cpfedui/clusters'>
          <Clusters />
        </Tabs.Content>
      ))
      .with('/cpfedui/policies', () => (
        <Tabs.Content value='/cpfedui/policies'>
          <Policies />
        </Tabs.Content>
      ))
      .with('/cpfedui/namespaces', () => (
        <Tabs.Content value='/cpfedui/namespaces'>
          <Namespaces />
        </Tabs.Content>
      ))
      .with('/cpfedui/workloads', () => (
        <Tabs.Content value='/cpfedui/workloads'>
          <Workloads />
        </Tabs.Content>
      ))
      .with('/cpfedui/configmapsandsecrets', () => (
        <Tabs.Content value='/cpfedui/configmapsandsecrets'>
          <ConfigMapsAndSecrets />
        </Tabs.Content>
      ))
      .otherwise(() => <PageNotFound />);
  };

  return (
    <Tabs.Root value={currentTab} onValueChange={handleTabChange}>
      <Tabs.List>
        {TAB_CONFIGS.map(({ value, label }) => (
          <Tabs.Trigger key={value} value={value}>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {renderTabContent()}
    </Tabs.Root>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Container>
          <FederationTabs />
        </Container>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
