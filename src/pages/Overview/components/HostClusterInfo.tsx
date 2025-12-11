import { Card } from '@/components/Card';
import { Flex } from '@/components/Flex';
import { Heading } from '@/components/Heading';
import { ProgressWithMarker } from '@/components/ProgressWithMarker';
import { Status, Variant } from '@/components/Status';
import { HostClusterStatus } from '@/pages/Overview/models/overview';
import { Stack } from '@chakra-ui/react';

export default function HostClusterInfo({
  hostCluster,
}: {
  hostCluster: HostClusterStatus;
}) {
  return (
    <>
      <Heading variant='leftSide' marginTop='1%' marginBottom='1.2%'>
        Host Cluster Info
      </Heading>
      <Card.Root variant='wide' marginBottom='17px'>
        <Card.Header>
          <Card.Title>
            <Flex>
              {hostCluster.name}
              <Flex>
                <Status variant={hostCluster.status as Variant} />
              </Flex>
            </Flex>
          </Card.Title>
          <Card.Description>
            Nodes {hostCluster.nodeSummary.readyNum}/
            {hostCluster.nodeSummary.totalNum}
          </Card.Description>
        </Card.Header>
        <Card.Body variant='wide'>
          <Stack>
            <ProgressWithMarker
              realTimeUsage={hostCluster.realTimeUsage.cpu}
              requestUsage={hostCluster.requestUsage.cpu}
              kind='CPU'
              label
            />
            <ProgressWithMarker
              realTimeUsage={hostCluster.realTimeUsage.memory}
              requestUsage={hostCluster.requestUsage.memory}
              kind='Memory'
              label
            />
          </Stack>
        </Card.Body>
      </Card.Root>
    </>
  );
}
