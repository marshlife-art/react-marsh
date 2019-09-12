import React from 'react'
import {
  Box,
  InfiniteScroll,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader
} from 'grommet'
import Loading from './Loading'

interface ProductsInfiniteProps {
  header?: string[][]
  rows?: string[][]
}

function ProductsInfinite(props: ProductsInfiniteProps) {
  const { header, rows } = props
  return (
    <Box fill overflow="auto">
      <Table style={{ tableLayout: 'auto' }}>
        <TableHeader>
          <TableRow>
            {header &&
              header[0] &&
              header[0].map((header, i) => (
                <TableCell key={i} scope="col">
                  {header}
                </TableCell>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <InfiniteScroll
            renderMarker={marker => (
              <TableRow color="brand">
                <TableCell colSpan={5}>
                  {marker}
                  <Loading />
                </TableCell>
              </TableRow>
            )}
            // scrollableAncestor="window"
            items={rows}
            // onMore={() => console.log('infinite onMore!')}
            step={100}
          >
            {(row, i) => (
              <TableRow key={i}>
                {row.map((item: string, i: number) => (
                  <TableCell key={i}>{item}</TableCell>
                ))}
              </TableRow>
            )}
          </InfiniteScroll>
        </TableBody>
      </Table>
    </Box>
  )
}

export { ProductsInfinite }
