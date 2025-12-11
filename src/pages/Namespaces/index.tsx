import { Flex } from '@/components/Flex';
import SearchBar from '@/components/SearchBar';
import SortSelect from '@/components/SortSelect';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NamespaceAddButton } from './components/NamespaceAddButton';
import NamespaceList from './components/NamespaceList';

export default function Namespaces() {
  return (
    <>
      <Flex justify='flex-end' marginTop='9px' marginBottom='50px'>
        <SearchBar />
        <NamespaceAddButton />
      </Flex>
      <Flex justify='flex-end'>
        <SortSelect level='cluster' />
      </Flex>
      <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
        <Suspense fallback=''>
          <NamespaceList />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
