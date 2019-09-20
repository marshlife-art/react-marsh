import React, { useState, useEffect } from 'react'
import { Box, Heading, Text, Button } from 'grommet'
import Papa from 'papaparse'
import styled from 'styled-components'

import { useProductsPutService } from '../../services/useProductServices'
import {
  ProductDoc,
  ProductMap,
  ProductMapPartial,
  ProductMeta
} from '../../types/Product'
// import { ProductsInfinite } from '../../components/ProductsInfinite'
import Loading from '../../components/Loading'
import { PRODUCT_KEYS, catz } from '../../util/utilz'
import { ProductMapSelect } from '../../components/ProductMapSelect'
import { Product } from '../../components/Product'

const TEST_MAP: ProductMap = {
  name: [2],
  description: [3],
  pk: [4],
  size: [5],
  unit_type: [6],
  price: [8],
  unit_price: [9],
  property: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  search: [2, 3, 10],
  category: [10]
}

const HoverBox = styled(Box)`
  &:hover {
    background-color: rgba(192, 192, 192, 0.1);
  }
`

// this sort of wonky thing is like a ProductDoc collection
// but instead of an array it's an object indexed on _id
// to make collecting rows easier in the parse fn...
interface AllData {
  header: string[]
  data: { [index: string]: string[][] }
  meta: { [index: string]: ProductMeta }
}

type Steps = 'upload' | 'map' | 'confirm' | 'done'

function ProductsWholesaleImport() {
  const [step, setStep] = useState<Steps>('upload')

  const [header, setHeader] = useState<string[]>([])
  const [doSave, setDoSave] = useState(false)

  useEffect(() => {
    doSave && setDoSave(false)
  }, [doSave])

  const [productDoc, setProductDoc] = useState<ProductDoc>()
  const productsPutService = useProductsPutService(
    'products_wholesale',
    productDoc,
    doSave,
    (rev?: string) => {
      setSavedDocsCount(prevCount =>
        prevCount < docsToSaveCount ? prevCount + 1 : prevCount
      )
      // console.log(
      //   'saved one: rev:',
      //   rev,
      //   ' savedDocsCount:',
      //   savedDocsCount,
      //   ' docsToSaveCount:',
      //   docsToSaveCount
      // )
      saveNextDoc(docsToSaveCount)
    },
    true
  )

  const [randomProduct, setRandomProduct] = useState<string[]>()

  const [productMap, setProductMap] = useState<ProductMapPartial>(TEST_MAP)

  function setProductMapForKey(key: keyof ProductMap, value: number[]) {
    // add things to the productMap object one key-at-a-time
    setProductMap({ ...productMap, ...{ [key]: value } })
  }

  const [productMapErrorMsg, setProductMapErrorMsg] = useState('')
  const [importProductsError, setImportProducsError] = useState()
  const [docsToSaveCount, setDocsToSaveCount] = useState(0)
  const [savedDocsCount, setSavedDocsCount] = useState(0)

  const [allData, setAllData] = useState<AllData>({
    header: [],
    data: {},
    meta: {}
  })

  let groupName: string

  function getRandomProduct(): void {
    // console.log('getRandomProduct allData:', allData)
    const keyz = Object.keys(allData.data)
    const keyzlen = keyz.length - 1
    const randCat = keyz[Math.floor(Math.random() * keyzlen)]
    // console.log('[getRandomProduct]', keyz, keyzlen)
    try {
      const randIdx = Math.floor(
        Math.random() * allData.data[randCat].length - 1
      )

      const rProd = allData.data[randCat][randIdx]
      // console.log(
      //   'randCat:',
      //   randCat,
      //   ' randIdx:',
      //   randIdx,
      //   ' rprrProdod:',
      //   rProd
      // )
      setRandomProduct(rProd)
    } catch (e) {
      console.warn('onoz! getRandomProduct caught error: ', e)
    }
  }

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

  function parse(file: File) {
    let mutAllData: AllData = {
      header: [],
      data: {},
      meta: {}
    }

    Papa.parse(file, {
      worker: true,
      step: ({ data }) => {
        if (mutAllData.header.length === 0) {
          mutAllData.header = data.map(d => d.trim())
          // setProductDoc({ _id: 'header', data: data })
          // setDoSave(true)
          setHeader(data)
        } else if (
          data[0] &&
          data[0] !== '' &&
          data.slice(1, data.length).filter(x => x.trim() !== '').length === 0
        ) {
          if (!groupName) {
            groupName = data[0].trim()
          } else {
            mutAllData.data[groupName].push(data.map(d => d.trim()))
          }
          groupName = data[0].trim()
        } else {
          groupName = groupName || 'default'
          if (!mutAllData.data[groupName]) {
            mutAllData.data[groupName] = []
          }
          mutAllData.data[groupName].push(data.map(d => d.trim()))
        }
      },
      complete: function() {
        // console.log('parsing done! mutAllData:', mutAllData)
        setAllData(mutAllData)
        setLoading(false)
        setStep('map')
        // #TODO: cleanup  data?? like:
        // allData.data = {}
        // props.setActionModalOpen(false)
      },
      error: function(e) {
        console.warn('onoz, parse caught error:', e)
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

  function onSaveMapping() {
    const canGotoNextStep =
      productMap && Object.keys(productMap).length === PRODUCT_KEYS.length
    // console.log('next productMap:', productMap)
    // console.log('PRODUCT_KEYS === keys(productMap):', canGotoNextStep)
    setProductMapErrorMsg(
      canGotoNextStep ? '' : 'PLEASE SELECT AN OPTION FOR EACH PRODUCT KEY'
    )

    canGotoNextStep && setStep('confirm')

    if (canGotoNextStep) {
      let mutAllDataMeta: AllData['meta'] = allData.meta

      Object.keys(allData.data).forEach(group_name => {
        // #TODO: default index [10] probably not needed
        const catIdx =
          (productMap['category'] && productMap['category'][0]) || 10
        // console.log('catz:', catz(catIdx, allData.data[group_name]))
        mutAllDataMeta[group_name] = {
          data_length: allData.data[group_name].length,
          catz: catz(catIdx, allData.data[group_name]),
          date_added: Date.now(),
          header: allData.header
        }
      })

      // console.log('parsing done! mutAllData:', mutAllDataMeta)
      setAllData(prevAllData => ({ ...prevAllData, meta: mutAllDataMeta }))
    }
  }

  function onImportProducts() {
    setImportProducsError(undefined)
    setStep('done')
    setDocsToSaveCount(Object.keys(allData.data).length)
    saveNextDoc(Object.keys(allData.data).length)
  }

  function saveNextDoc(_docsToSaveCount: number) {
    if (savedDocsCount < _docsToSaveCount) {
      const cat = Object.keys(allData.data)[savedDocsCount]
      if (cat) {
        setProductDoc({
          _id: cat,
          data: allData.data[cat],
          meta: allData.meta[cat],
          product_map: productMap as ProductMap
        })
        setDoSave(true)
      }
    }
  }

  return (
    <Box fill style={{ minWidth: '450px' }}>
      {/* <Box
        direction="row"
        align="center"
        as="header"
        elevation="small"
        justify="between"
        style={{ minHeight: '50px' }}
      >
        <Heading level={2} margin={{ left: 'medium' }}>
          ADD WHOLESALE PRODUCTS
        </Heading>
      </Box> */}
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
                  align="center"
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
                    productMap={productMap}
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
                  onSaveMapping()
                }}
                hoverIndicator
              />
            </Box>
          </Box>
        )}

        {step === 'confirm' && (
          <Box pad="medium" gap="medium" width="large" direction="column">
            <Box direction="column">
              {allData.meta &&
                Object.keys(allData.meta).map(cat => (
                  <Box key={`metacat${cat}`} direction="column">
                    <Box
                      direction="row"
                      justify="between"
                      pad={{ top: 'medium', bottom: 'xsmall' }}
                    >
                      <Text weight="bold">{cat}</Text>
                      <Text weight="bold">
                        ({allData.meta[cat].catz.length})
                      </Text>
                    </Box>
                    {allData.meta[cat].catz.map(subCat => (
                      <Box
                        direction="row"
                        justify="between"
                        key={`subcat${subCat.name}${subCat.count}`}
                      >
                        <Text>{subCat.name}</Text>
                        <Text>({subCat.count})</Text>
                      </Box>
                    ))}
                  </Box>
                ))}
            </Box>

            <Text>
              How does it look? Try out some random products:{' '}
              <Button
                label="random product"
                onClick={() => getRandomProduct()}
              />{' '}
            </Text>

            {randomProduct && (
              <Box pad={{ bottom: 'large' }}>
                <Box border="all" margin={{ vertical: 'medium' }}>
                  <Product
                    row={randomProduct}
                    productMap={productMap as ProductMap}
                    preview
                  />
                </Box>

                <Text
                  textAlign="end"
                  margin={{ vertical: 'small', horizontal: 'medium' }}
                >
                  ...looks good? then IMPORT
                </Text>

                <Button
                  label="IMPORT PRODUCTS"
                  onClick={() => onImportProducts()}
                  disabled={doSave}
                />
              </Box>
            )}

            {doSave && <Loading />}
            {productsPutService.status === 'error' && (
              <Text color="status-critical">
                ohnoz! error: {productsPutService.error}
              </Text>
            )}
            {importProductsError && (
              <Text color="status-critical">
                ohnoz! error: {importProductsError}
              </Text>
            )}
          </Box>
        )}

        {step === 'done' && (
          <Box
            direction="column"
            gap="medium"
            align="center"
            justify="center"
            pad="medium"
          >
            <Text>
              hold tite! saving {savedDocsCount} of {docsToSaveCount}...
            </Text>
            {importProductsError && (
              <Text color="status-critical">
                ohnoz! error: {importProductsError}
              </Text>
            )}
            {docsToSaveCount > 0 && savedDocsCount >= docsToSaveCount && (
              <Text size="large" weight="bold">
                done!
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export { ProductsWholesaleImport }
