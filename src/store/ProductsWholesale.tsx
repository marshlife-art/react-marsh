import React, { useState, useEffect } from 'react'
import { Box, Button, Text } from 'grommet'
import { FormNext } from 'grommet-icons'
import { base } from 'grommet/themes'

import { useAllDocumentsService } from '../services/usePageService'
import { useProductDocService } from '../services/useProductServices'
import { ProductsStore } from '../components/ProductsStore'
import styled from 'styled-components'
import Loading from '../components/Loading'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { productMapFn } from '../util/utilz'
// import { StickyBox } from '../components/StickyBox'
// import { useCartPutService } from '../services/useCartService';

const BreadCrumb = styled(Text)`
  background: ${base.global && base.global.colors
    ? base.global.colors.white
    : 'white'};
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  /* &:hover:after {
    content: 'X';
  } */
`

const BreadCrumbBox = styled(Box)<{ top?: string }>`
  position: sticky;
  top: ${props => props.top || 0};
  background: ${base.global && base.global.colors
    ? base.global.colors.white
    : 'white'};
  z-index: 1;
`

const CatCrumb = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
`

function ProductsWholesale(props: RouteComponentProps) {
  // const [q, setQ] = useState(props.location.search.replace('?', ''))
  // useEffect(() => {
  //   const unListen = props.history.listen((location, action) => {
  //     console.log(
  //       '[StoreSearch] history listener! location, action:',
  //       location,
  //       action
  //     )
  //     setQ(location.search.replace('?', ''))
  //   })

  //   return () => unListen && unListen()
  // }, [props.history])

  const allDocs = useAllDocumentsService('products_wholesale', false)

  const [selectedDoc, setSelectedDoc] = useState()
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCat, setSelectedCat] = useState()

  const productDocResult = useProductDocService(
    'products_wholesale',
    selectedDoc
  )

  // const headerDocResult = useProductDocService('products_wholesale', 'header')

  useEffect(() => {
    if (
      !selectedDoc ||
      productDocResult.status !== 'loaded' ||
      !productDocResult.payload.data
    ) {
      return
    }

    setCategories(
      productDocResult.payload.data
        .map(p =>
          productMapFn('category', p, productDocResult.payload.product_map)
        )
        .filter((cat, index, arr) => arr.indexOf(cat) === index && cat !== '')
    )
  }, [selectedDoc, productDocResult])

  return (
    <Box pad={{ horizontal: 'medium' }} fill>
      <BreadCrumbBox
        direction="row"
        gap="small"
        margin={{ bottom: 'medium', left: '48px', right: '120px' }}
        pad={{ vertical: 'medium' }}
        top="0px"
        justify="center"
      >
        {selectedDoc && (
          <BreadCrumb
            onClick={() => {
              setSelectedDoc(undefined)
              setSelectedCat(undefined)
            }}
          >
            Store
          </BreadCrumb>
        )}
        {selectedDoc && (
          <Text>
            {' '}
            <FormNext />{' '}
          </Text>
        )}
        {selectedDoc && (
          <BreadCrumb
            onClick={() => {
              setSelectedCat(undefined)
            }}
          >
            {selectedDoc}
          </BreadCrumb>
        )}
        {selectedDoc && selectedCat && (
          <Text>
            {' '}
            <FormNext />{' '}
          </Text>
        )}
        {selectedDoc && selectedCat && <CatCrumb>{selectedCat}</CatCrumb>}
      </BreadCrumbBox>

      {!selectedDoc && (
        <Box
          pad={{ horizontal: 'medium', vertical: 'small' }}
          width="medium"
          alignSelf="center"
        >
          {allDocs.status === 'loaded' &&
            allDocs.payload.rows
              .filter(r => r.id !== 'header' && !/^_/.test(r.id))
              .map((row, i) => (
                <Box
                  key={`row${i}`}
                  pad={{ horizontal: 'medium', bottom: 'small' }}
                >
                  <Button
                    fill
                    color="dark-1"
                    onClick={() => setSelectedDoc(row.id)}
                    hoverIndicator
                    style={{ textTransform: 'uppercase' }}
                    label={row.id}
                  />
                </Box>
              ))}
        </Box>
      )}

      {selectedDoc && productDocResult.status === 'loading' && <Loading />}
      {selectedDoc &&
        !selectedCat &&
        productDocResult.status === 'loaded' && productDocResult.payload.data && (
          <Box width="auto" alignSelf="center">
            {categories.map((cat, i) => (
              <Box
                key={`row${i}`}
                pad={{ horizontal: 'medium', bottom: 'small' }}
              >
                <Button
                  fill
                  color="dark-1"
                  onClick={() => setSelectedCat(cat)}
                  hoverIndicator
                  style={{ textTransform: 'uppercase' }}
                  label={cat}
                />
              </Box>
            ))}
          </Box>
        )}

      {selectedDoc && selectedCat && (
        <ProductsStore {...{ selectedCat, productDocResult }} />
      )}
    </Box>
  )
}

export default withRouter(ProductsWholesale)
