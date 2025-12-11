import { Flex } from '@/components/Flex';
import SearchBar from '@/components/SearchBar';
import SortSelect from '@/components/SortSelect';
import ClusterJoinButton from '@/pages/Clusters/components/ClusterJoinButton';
import ClusterList from '@/pages/Clusters/components/ClusterList';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';

export default function Clusters() {
  const [_, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams({});
  }, []);

  return (
    <>
      <Flex justify='flex-end' marginTop='9px' marginBottom='50px'>
        <SearchBar />
        <ClusterJoinButton />
      </Flex>
      <Flex justify='flex-end'>
        <SortSelect level='cluster' />
      </Flex>

      <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
        <Suspense fallback=''>
          <ClusterList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
