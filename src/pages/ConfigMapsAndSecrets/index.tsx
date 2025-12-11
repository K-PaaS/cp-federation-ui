import { Flex } from '@/components/Flex';
import SearchBar from '@/components/SearchBar';
import SortSelect from '@/components/SortSelect';
import { ConfigMapAndSecretLowercase } from '@/pages/ConfigMapsAndSecrets/models/configMapsAndSecrets';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import ConfigMapAndSecretAddButton from './components/ConfigMapAndSecretAddButton';
import ConfigMapAndSecretLevelSelect from './components/ConfigMapAndSecretLevelSelect';
import ConfigMapAndSecretNamespaceSelect from './components/ConfigMapAndSecretNamespaceSelect';
import ConfigMapList from './components/ConfigMapList';
import SecretList from './components/SecretList';

export default function ConfigMapsAndSecrets() {
  const [configMapAndSecretLevel, setConfigMapAndSecretLevel] =
    useState<ConfigMapAndSecretLowercase>('configmap');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLevelChange = (newLevel: ConfigMapAndSecretLowercase) => {
    setConfigMapAndSecretLevel(newLevel);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('page');
    setSearchParams(newSearchParams);
  };

  return (
    <>
      <Flex
        justify='space-between'
        align='center'
        marginTop='9px'
        marginBottom='50px'
      >
        <Flex>
          <ConfigMapAndSecretLevelSelect
            value={configMapAndSecretLevel}
            onValueChange={handleLevelChange}
          />
          <Suspense fallback={null}>
            <ConfigMapAndSecretNamespaceSelect />
          </Suspense>
        </Flex>
        <Flex justify='flex-end'>
          <SearchBar key={configMapAndSecretLevel} />
          <ConfigMapAndSecretAddButton />
        </Flex>
      </Flex>
      <Flex justify='flex-end'>
        <SortSelect key={configMapAndSecretLevel} level={'namespace'} />
      </Flex>
      <ErrorBoundary fallbackRender={({ error }) => <div>{error.message}</div>}>
        <Suspense fallback={null}>
          {configMapAndSecretLevel === 'configmap' ? (
            <ConfigMapList />
          ) : (
            <SecretList />
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
