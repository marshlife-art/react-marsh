import React, { useState, useEffect } from 'react'
import { Box, Text, Layer, Heading } from 'grommet'

import Papa from 'papaparse'

import {
  useProductsPutService,
  useProductDocService
} from '../../services/useProductServices'
import { ProductDoc } from '../../types/Product'
import { ProductsInfinite } from '../../components/ProductsInfinite'
import Loading from '../../components/Loading'

interface ProductsWholesaleEditorProps {
  actionModalOpen: boolean
  setActionModalOpen: (value: boolean) => void
  selectedDocID?: string
}

function ProductsWholesaleEditor(props: ProductsWholesaleEditorProps) {
  const [rows, setRows] = useState<string[][]>([])
  const [header, setHeader] = useState<string[][]>([])

  const [doSave, setDoSave] = useState(false)

  useEffect(() => {
    doSave && setDoSave(false)
  }, [doSave])

  const [productDoc, setProductDoc] = useState<ProductDoc>()
  useProductsPutService('products_wholesale', productDoc, doSave, () => {})
  // const [columns, setColumns] = useState()

  let allData: { header: string[][]; data: { [index: string]: string[][] } } = {
    header: [],
    data: {}
  }

  let groupName: string

  const [loading, setLoading] = useState(false)

  const productHeaderResult = useProductDocService(
    'products_wholesale',
    'header'
  )
  useEffect(() => {
    productHeaderResult.status === 'loaded' &&
      productHeaderResult.payload.data &&
      setHeader(productHeaderResult.payload.data)
  }, [productHeaderResult])

  const productDocResult = useProductDocService(
    'products_wholesale',
    props.selectedDocID
  )

  useEffect(() => {
    productDocResult.status === 'loaded' &&
      productDocResult.payload.data &&
      setRows(productDocResult.payload.data)
  }, [productDocResult])

  function parse(file: File) {
    Papa.parse(file, {
      worker: true,
      step: ({ data }) => {
        if (allData.header.length === 0) {
          allData.header = [data]
          setProductDoc({ _id: 'header', data: data })
          setDoSave(true)
        } else if (
          data[0] &&
          data[0] !== '' &&
          data.slice(1, data.length).filter(x => x !== '').length === 0
        ) {
          if (!groupName) {
            groupName = data[0]
          } else {
            allData.data[groupName].push(data)
          }
          groupName = data[0]
        } else {
          groupName = groupName || 'default'
          if (!allData.data[groupName]) {
            allData.data[groupName] = []
          }
          allData.data[groupName].push(data)
        }
      },
      complete: function() {
        Object.keys(allData.data).forEach(group_name => {
          setProductDoc({ _id: group_name, data: allData.data[group_name] })
          setDoSave(true)
        })
        console.log('parsing done! allData:', allData)
        setLoading(false)
        // #TODO: cleanup  data?? like:
        // allData.data = {}
        props.setActionModalOpen(false)
      }
    })
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLoading(true)
    if (event.target.files && event.target.files.length) {
      parse(event.target.files[0])
    } else {
      setLoading(false)
    }
  }

  // when the table header turns postion: fixed, cell sizing getz weird :/
  // const [fixedHeader, setFixedHeader] = useState(() => window.scrollY > 70)
  // function handleScroll() {
  //   console.log('handleScroll!')
  //   setFixedHeader(window.scrollY > 70)
  // }
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll)
  //   return () => window.removeEventListener('scroll', handleScroll)
  // })
  // use like:
  // style={
  //   fixedHeader
  //     ? { position: 'fixed', top: 0, background: 'white' }
  //     : { position: 'unset', top: 'unset', background: 'unset' }
  // }

  return (
    <Box pad={{ horizontal: 'medium', bottom: 'small' }} fill>
      {props.actionModalOpen && (
        <Layer
          margin={{ top: 'large' }}
          position="top"
          modal
          onClickOutside={() => props.setActionModalOpen(false)}
          onEsc={() => props.setActionModalOpen(false)}
        >
          <Box pad="medium" gap="small" width="medium">
            <Heading level={3} margin="none">
              upload .csv files:
            </Heading>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
            />
            <Box
              as="footer"
              gap="small"
              direction="row"
              align="center"
              justify="center"
              pad={{ top: 'medium', bottom: 'small' }}
            >
              {loading && <Loading />}
            </Box>
          </Box>
        </Layer>
      )}
      {loading && <Loading />}
      {rows.length > 0 && <ProductsInfinite {...{ header, rows }} />}
    </Box>
  )
}

export default ProductsWholesaleEditor
