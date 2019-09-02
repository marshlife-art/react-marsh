import React, { useState } from 'react'
import {
  Box,
  Text,
  InfiniteScroll,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHeader
} from 'grommet'

import Papa from 'papaparse'

function ProductsWholesaleEditor() {
  const [rows, setRows] = useState<string[][]>([])
  const [header, setHeader] = useState<string[]>([])

  // const [columns, setColumns] = useState()

  let data: string[][] = []

  const [loading, setLoading] = useState(false)

  function parse(file: File) {
    Papa.parse(file, {
      worker: true,
      step: function(row) {
        // setRows([...rows, row.data])
        // console.log('Row:', rows)
        data.push(row.data)
      },
      complete: function() {
        setHeader(data.shift() || [])
        setRows(data)
        console.log('parsing done!')
        setLoading(false)
      }
    })
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true)
    event.target.files && parse(event.target.files[0])
  }

  return (
    <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
      parse .csv
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
      />
      {loading && 'L O A D I N G . . .'}
      {rows.length > 0 && (
        <Box fill overflow="auto">
          <Table>
            <TableHeader>
              <TableRow>
                {header.map((header, i) => (
                  <TableCell key={i} scope="col">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <InfiniteScroll
                renderMarker={marker => (
                  <TableRow>
                    <TableCell>{marker}</TableCell>
                  </TableRow>
                )}
                // scrollableAncestor="window"
                items={rows}
                // onMore={() => console.log('infinite onMore!')}
                // step={10}
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
      )}
    </Box>
  )
}

export default ProductsWholesaleEditor
