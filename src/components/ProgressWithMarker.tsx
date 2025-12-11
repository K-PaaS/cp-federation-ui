import { Progress, Box, HStack } from '@chakra-ui/react';
import { Tooltip } from '@/components/Tooltip';

export const ProgressWithMarker = ({
  realTimeUsage: realTimeUsage,
  requestUsage: requestUsage,
  kind,
  label = false,
}: {
  realTimeUsage: number;
  requestUsage: number;
  kind: string;
  label?: boolean;
}) => {
  const colorPalette =
    kind === 'CPU' ? 'yellow' : kind === 'Memory' ? 'green' : 'blue';

  const triangleSize = 10;

  if (realTimeUsage === -1) {
    realTimeUsage = -1;
  }

  return (
    <Box width='100%' padding='10px'>
      <Progress.Root
        value={realTimeUsage}
        colorPalette={colorPalette}
        size='lg'
        min={-1}
      >
        <HStack gap='2'>
          {label && <Progress.Label width='55px'>{kind}</Progress.Label>}

          <Box width='100%' position='relative'>
            <Progress.Track flex='1' height='30px'>
              {realTimeUsage === -1 ? null : (
                <Progress.Range position='relative'>
                  <Progress.ValueText
                    position='absolute'
                    left='50%'
                    color='black'
                  >
                    {realTimeUsage}%
                  </Progress.ValueText>
                </Progress.Range>
              )}
            </Progress.Track>
            {requestUsage === -1 ? null : (
              <Tooltip showArrow content={`requests : ${requestUsage}%`}>
                <Box
                  position='absolute'
                  left={`calc(${requestUsage}% - ${triangleSize / 2}px)`}
                  top='-50%'
                  transform='translateY(50%)'
                  width='0'
                  height='0'
                  borderLeft={`${triangleSize / 2}px solid transparent`}
                  borderRight={`${triangleSize / 2}px solid transparent `}
                  borderTop={`${triangleSize}px solid #47494d`}
                />
              </Tooltip>
            )}
          </Box>
        </HStack>
      </Progress.Root>
    </Box>
  );
};
