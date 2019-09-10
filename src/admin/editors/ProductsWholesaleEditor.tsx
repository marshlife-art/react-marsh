import React, { useState, useEffect } from 'react'
import { Box, Layer, Heading, Text, Button } from 'grommet'
import { FormClose } from 'grommet-icons'
import Papa from 'papaparse'
import styled from 'styled-components'

import {
  useProductsPutService,
  useProductDocService
} from '../../services/useProductServices'
import { ProductDoc, ProductMap, ProductMapPartial } from '../../types/Product'
import { ProductsInfinite } from '../../components/ProductsInfinite'
import Loading from '../../components/Loading'
import { PRODUCT_KEYS } from '../../util/utilz'
import { ProductMapSelect } from '../../components/ProductMapSelect'

const HoverBox = styled(Box)`
  &:hover {
    background-color: rgba(192, 192, 192, 0.1);
  }
`

interface ProductsWholesaleEditorProps {
  actionModalOpen: boolean
  setActionModalOpen: (value: boolean) => void
  selectedDocID?: string
}

function ProductsWholesaleEditor(props: ProductsWholesaleEditorProps) {
  const [step, setStep] = useState<'upload' | 'map' | 'done'>('upload')
  const [rows, setRows] = useState<string[][]>([])
  const [header, setHeader] = useState<string[]>([])

  const [doSave, setDoSave] = useState(false)

  useEffect(() => {
    doSave && setDoSave(false)
  }, [doSave])

  const [productDoc, setProductDoc] = useState<ProductDoc>()
  useProductsPutService('products_wholesale', productDoc, doSave, () => {})
  // const [columns, setColumns] = useState()

  const [productMap, setProductMap] = useState<ProductMapPartial>()

  function setProductMapForKey(key: keyof ProductMap, value: number[]) {
    setProductMap({ ...productMap, ...{ [key]: value } })
  }

  const [productMapErrorMsg, setProductMapErrorMsg] = useState('')

  let allData: { header: string[][]; data: { [index: string]: string[][] } } = {
    header: [],
    data: {}
  }

  let groupName: string

  const [loading, setLoading] = useState(false)

  // const productHeaderResult = useProductDocService(
  //   'products_wholesale',
  //   'header'
  // )
  // useEffect(() => {
  //   productHeaderResult.status === 'loaded' &&
  //     productHeaderResult.payload.data &&
  //     setHeader(productHeaderResult.payload.data)
  // }, [productHeaderResult])

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
          // setProductDoc({ _id: 'header', data: data })
          // setDoSave(true)
          setHeader(data)
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
          // setDoSave(true)
        })
        console.log('parsing done! allData:', allData)
        setLoading(false)
        setStep('map')
        // #TODO: cleanup  data?? like:
        // allData.data = {}
        // props.setActionModalOpen(false)
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
          <Box fill style={{ minWidth: '450px' }}>
            <Box
              direction="row"
              align="center"
              as="header"
              elevation="small"
              justify="between"
            >
              <Heading level={2} margin={{ left: 'medium' }}>
                ADD WHOLESALE PRODUCTS
              </Heading>
              <Button
                icon={<FormClose />}
                onClick={() => props.setActionModalOpen(false)}
                hoverIndicator
              />
            </Box>
            <Box overflow="auto" style={{ display: 'block' }}>
              {step === 'upload' && (
                <Box pad="medium" gap="small" width="large">
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
              )}

              {step === 'map' && (
                <Box pad="medium" gap="medium" width="large" direction="column">
                  <Text>
                    Setup a mapping from the uploaded .csv data to the internal
                    product model.
                  </Text>
                  <Text>
                    Select one or more header cells for <b>every</b> product key
                    below:
                  </Text>

                  <Box direction="row" justify="between">
                    <Heading level={5} margin="none">
                      PRODUCT KEY
                    </Heading>
                    <Heading level={5} margin="none">
                      HEADER CELL
                    </Heading>
                  </Box>

                  <Box gap="small" direction="column">
                    {PRODUCT_KEYS.map(key => (
                      <HoverBox
                        direction="row"
                        gap="medium"
                        justify="between"
                        key={`keymap${key}`}
                      >
                        <Text key={`keymap${key}`}>{key}</Text>
                        <ProductMapSelect
                          optz={
                            header && header.length
                              ? header.map((k, i) => ({
                                  lab: `[${i}] ${k}`,
                                  val: i.toString(),
                                  dis: false
                                }))
                              : undefined
                          }
                          pkey={key}
                          setProductMapForKey={setProductMapForKey}
                        />
                      </HoverBox>
                    ))}
                  </Box>

                  <Box
                    direction="row"
                    pad={{ vertical: 'medium' }}
                    gap="medium"
                    align="center"
                    justify="end"
                  >
                    {productMapErrorMsg && (
                      <Text color="status-critical">{productMapErrorMsg}</Text>
                    )}
                    <Button
                      color="dark-1"
                      label="Save Mapping"
                      onClick={() => {
                        console.log('next productMap:', productMap)
                        console.log(
                          'PRODUCT_KEYS === keys(productMap):',
                          productMap &&
                            Object.keys(productMap).length ===
                              PRODUCT_KEYS.length
                        )
                        setProductMapErrorMsg(
                          productMap &&
                            Object.keys(productMap).length ===
                              PRODUCT_KEYS.length
                            ? ''
                            : 'PLEASE SELECT AN OPTION FOR EACH PRODUCT KEY'
                        )
                      }}
                      hoverIndicator
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Layer>
      )}
      {loading && <Loading />}
      {rows.length > 0 && <ProductsInfinite {...{ header: [header], rows }} />}
    </Box>
  )
}

export default ProductsWholesaleEditor
