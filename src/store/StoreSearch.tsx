import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Box, InfiniteScroll, Heading } from 'grommet'
import { useAllDocumentsService } from '../services/usePageService'
import { ProductDoc } from '../types/Product'
import { productMapFn } from '../util/utilz'
import Loading from '../components/Loading'
import { Product } from '../components/Product'

type AllDocsResponse = PouchDB.Core.AllDocsResponse<any>['rows']

function StoreSearch(props: RouteComponentProps) {
  const [q, setQ] = useState(props.location.search.replace('?', ''))
  const [results, setResults] = useState<string[][]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unListen = props.history.listen((location, action) => {
      // console.log(
      //   '[StoreSearch] history listener! location, action:',
      //   location,
      //   action
      // )
      setQ(location.search.replace('?', ''))
    })

    return () => unListen && unListen()
  }, [props.history])

  const allDocs = useAllDocumentsService('products_wholesale', true)
  const [wholesaleDocs, setWholesaleDocs] = useState<AllDocsResponse>()
  const [productMap, setProductMap] = useState()

  useEffect(() => {
    // console.log('[AdminProductsWholesale] allDocs:', allDocs)
    allDocs.status === 'loaded' && setWholesaleDocs(allDocs.payload.rows)
  }, [allDocs])

  useEffect(() => {
    if (wholesaleDocs && wholesaleDocs.length && q && q.length > 2) {
      // console.log('iz good time to .filter()')
      setResults([])
      setLoading(true)

      window.setTimeout(() => {
        wholesaleDocs.map(cat => {
          const doc = cat.doc as ProductDoc
          const _productMap = doc && doc.product_map
          setProductMap(_productMap)

          const resultz =
            (doc &&
              doc.data &&
              doc.data.filter(row => {
                const regex = new RegExp(q, 'i')
                return regex.test(productMapFn('search', row, _productMap))
              })) ||
            []

          // console.log('resultz:', resultz)
          setResults(prevResults => prevResults.concat(resultz))
          if (resultz) {
            setLoading(false)
          }
          return false
        })
        setLoading(false)
      }, 200)
    }
  }, [wholesaleDocs, q])

  return (
    <Box fill>
      {loading && <Loading />}
      {wholesaleDocs && !loading && results.length === 0 && (
        <Box fill justify="center" align="center">
          <Heading level={3}>nothing found...</Heading>
        </Box>
      )}
      <Box overflow="auto" width="large" justify="center" alignSelf="center">
        <InfiniteScroll
          renderMarker={marker => (
            <Box>
              {marker}
              <Loading />
            </Box>
          )}
          // scrollableAncestor="window"
          items={results}
          // onMore={() => console.log('infinite onMore!')}
          step={100}
        >
          {(row, i) => (
            <Product row={row} productMap={productMap} key={`infpro${i}`} />
          )}
        </InfiniteScroll>
      </Box>
    </Box>
  )
}

export default withRouter(StoreSearch)
