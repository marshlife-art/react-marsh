import React, { useState, useEffect } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Box, InfiniteScroll, Heading, Select } from 'grommet'
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
  const [catz, setCatz] = useState<string[]>([])
  // const [selectedCat, setSelectedCat] = useState<string>('')
  const [subCatz, setSubCatz] = useState<Array<string[] | undefined>>([])

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
    if (allDocs.status === 'loaded') {
      setWholesaleDocs(allDocs.payload.rows)

      // #TODO: catz should probably be calculated on import... also <SearchBox/> needz the <Select/>
      // need to just add any selected catz to the filter...
      const _catz = allDocs.payload.rows.map(d => d.id)
      setCatz(_catz)
      console.log('_catz:', _catz)

      // productDocResult.payload.data
      //     .map(p =>
      //       productMapFn('category', p, productDocResult.payload.product_map)
      //     )
      //     .filter((cat, index, arr) => arr.indexOf(cat) === index && cat !== '')
      const _subCatz = allDocs.payload.rows.map(d => {
        const doc = d.doc as ProductDoc
        return (
          doc.data &&
          doc.data
            .map(r => productMapFn('category', r, doc.product_map))
            .filter((cat, index, arr) => cat && arr.indexOf(cat) === index)
        )
      })

      console.log('_subCatz:', _subCatz)
      setSubCatz(_subCatz)
    }
  }, [allDocs])

  useEffect(() => {
    if (wholesaleDocs && wholesaleDocs.length && q && q.length > 2) {
      // console.log('iz good time to .filter()')
      setResults([])
      setLoading(true)

      window.setTimeout(() => {
        console.log('catz:', catz, ' subCatz:', subCatz)
        let resultz: string[][] = []

        for (let i = 0; i < wholesaleDocs.length; i++) {
          const doc = wholesaleDocs[i].doc as ProductDoc

          if (doc && doc.data) {
            const _productMap = doc && doc.product_map
            setProductMap(_productMap)
            const regex = new RegExp(q, 'i')

            for (let j = 0; j < doc.data.length; j++) {
              const search = productMapFn('search', doc.data[j], _productMap)
              regex.test(search) && resultz.push(doc.data[j])
              if (resultz.length > 500) {
                break
              }
            } // end for

            if (resultz.length > 500) {
              break
            }
          }
        } // end for

        // SORT resultz ?
        setResults(resultz)
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
