import { Heading } from '@/components/Heading';
import { Table } from '@/components/Table';
import { ClusterResourceStatus } from '@/pages/Overview/models/overview';

export default function FederationInfo({
  resources,
}: {
  resources: ClusterResourceStatus;
}) {
  return (
    <>
      <Heading variant='leftSide' marginTop='1%' marginBottom='1.2%'>
        Resource Info
      </Heading>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Policies</Table.ColumnHeader>
            <Table.ColumnHeader>Namespace</Table.ColumnHeader>
            <Table.ColumnHeader>Workloads</Table.ColumnHeader>
            <Table.ColumnHeader>Networks</Table.ColumnHeader>
            <Table.ColumnHeader>ConfigMaps & Secrets</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row key='resourceInfo'>
            <Table.Cell>{resources.propagationPolicyNum}</Table.Cell>
            <Table.Cell>{resources.namespaceNum}</Table.Cell>
            <Table.Cell>{resources.workloadNum}</Table.Cell>
            <Table.Cell>{resources.serviceNum}</Table.Cell>
            <Table.Cell>{resources.configNum}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </>
  );
}
