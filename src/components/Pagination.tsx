import {
  ButtonGroup,
  Pagination as ChakraPagination,
  IconButton,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

export default function Pagination({
  totalItemCount,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
}: {
  totalItemCount: number;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <ChakraPagination.Root
      count={totalItemCount}
      pageSize={itemsPerPage}
      page={currentPage}
      defaultPage={1}
      onPageChange={e => onPageChange(e.page)}
      textAlign='center'
      paddingTop='50px'
    >
      <ButtonGroup variant='ghost' size='lg'>
        <ChakraPagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </ChakraPagination.PrevTrigger>

        <ChakraPagination.Items
          render={page => {
            const { type, ...buttonProps } = page;
            return (
              <IconButton
                key={page.value}
                {...buttonProps}
                aria-label={`Page ${page.value}`}
                variant={{ base: 'ghost', _selected: 'outline' }}
              >
                {page.value}
              </IconButton>
            );
          }}
        />

        <ChakraPagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </ChakraPagination.NextTrigger>
      </ButtonGroup>
    </ChakraPagination.Root>
  );
}
