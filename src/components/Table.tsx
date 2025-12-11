import { Table as ChakraTable } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

export const Table = {
  Root: ({ ...props }: ComponentProps<typeof ChakraTable.Root>) => (
    <ChakraTable.Root
      size='sm'
      backgroundColor='#fff'
      paddingBottom='17px'
      borderTop='2px solid #333333'
      {...props}
    />
  ),
  Header: ChakraTable.Header,
  Row: ChakraTable.Row,
  ColumnHeader: ({
    ...props
  }: ComponentProps<typeof ChakraTable.ColumnHeader>) => (
    <ChakraTable.ColumnHeader
      textAlign='center'
      color='#47494d'
      backgroundColor='#f7f7f7'
      fontFamily='"Apple SD Gothic Neo", "Noto Sans KR", "맑은 고딕", "Font Awesome 5 Free"'
      fontWeight='500'
      padding='12px 11px 10px 11px'
      borderBottom='1px solid #ebebeb'
      borderLeft='1px solid #ebebeb'
      {...props}
    />
  ),
  Body: ChakraTable.Body,
  Cell: ({ ...props }: ComponentProps<typeof ChakraTable.Cell>) => (
    <ChakraTable.Cell
      textAlign='center'
      color='#818894'
      fontSize='15px'
      whiteSpace='normal'
      letterSpacing='-0.2px'
      padding='18px 11px 16px 11px'
      border='1px solid #ebebeb'
      {...props}
    />
  ),
  Footer: ChakraTable.Footer,
};
