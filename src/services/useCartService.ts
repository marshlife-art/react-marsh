import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { CartDoc, LineItem } from '../types/Cart'
import { productMap } from '../util/utilz'

// const DB_URL = 'http://localhost:5984/'

// const useCartPutService = (
//   doc: CartDoc | undefined,
//   doSave: boolean,
//   updateRev: (rev: string) => void
// ) => {
//   const [result, setResult] = useState<Service<PouchDB.Core.Response>>({
//     status: 'loading'
//   })

//   useEffect(() => {
//     if (!doSave || doc === undefined) {
//       return
//     }
//     const db = new PouchDB('cart') // local #TODO: add remote sync
//     console.log('useCartPutService gonna save doc:', doc)
//     db.put(doc)
//       .then(response => {
//         setResult({ status: 'saved', payload: response })
//         updateRev(response.rev)
//       })
//       .catch(error => setResult({ ...error }))
//   }, [doc, doSave, updateRev])

//   return result
// }

/*  0 Long Name
    1 Advertising Description
    2 PK
    3 Size
    4 Unit Type
    5 W/S Price
    6 U Price
    7->22 properties */

const useCartDocService = () => {
  const [result, setResult] = useState<Service<CartDoc>>({
    status: 'loading'
  })

  useEffect(() => {
    const db = new PouchDB('cart')
    db.get('cart')
      .then(doc => setResult({ status: 'loaded', payload: doc as CartDoc }))
      .catch(error => {
        console.log('useCartService db.get error:', error)
        if (error.name === 'not_found') {
          console.log('not_found! ...try harder?!')
          db.put({ _id: 'cart' }).then(response => {
            db.get('cart').then(doc =>
              setResult({ status: 'loaded', payload: doc as CartDoc })
            )
          })
        } else {
          setResult({ ...error })
        }
      })

    const changes = db
      .changes({
        since: 'now',
        live: true,
        include_docs: true
      })
      .on('change', change => {
        if (change.doc) {
          const doc: CartDoc = change.doc as CartDoc
          setResult({ status: 'loaded', payload: doc as CartDoc })
        }
      })
      .on('complete', info => {
        // changes() was canceled
      })
      .on('error', err => {
        console.log(err)
      })

    return () => changes.cancel()
  }, [])

  return result
}

const useCartItemCount = () => {
  const [itemCount, setItemCount] = useState(0)

  const db = new PouchDB('cart')

  db.get('cart').then((doc: CartDoc) =>
    setItemCount(doc.line_items ? doc.line_items.length : 0)
  )

  useEffect(() => {
    const changes = db
      .changes({
        since: 'now',
        live: true,
        include_docs: true
      })
      .on('change', change => {
        if (change.doc) {
          const doc: CartDoc = change.doc as CartDoc
          setItemCount(doc.line_items ? doc.line_items.length : 0)
        }
      })
      .on('complete', info => {
        // changes() was canceled
      })
      .on('error', err => {
        console.log(err)
      })

    return () => changes.cancel()
  }, [db])

  return itemCount
}

const addToCart = (row: string[]) => {
  const db = new PouchDB('cart')

  console.log('[useCartService] addToCart row:', row)
  db.get('cart')
    .then((cartDoc: CartDoc) => {
      cartDoc.line_items = cartDoc.line_items || []
      cartDoc.line_items.push({
        unit_type:
          productMap('price', row) === productMap('unit_price', row)
            ? 'EA'
            : 'CS',
        quantity: 1,
        price: parseFloat(productMap('price', row).replace('$', '')),
        data: row
      })
      db.put(cartDoc)
    })
    .catch(error => console.warn('addToCart caught error:', error))
}

const removeItemFromCart = (index: number) => {
  const db = new PouchDB('cart')

  db.get('cart')
    .then((cartDoc: CartDoc) => {
      cartDoc.line_items = cartDoc.line_items || []
      cartDoc.line_items.splice(index, 1)
      return db.put(cartDoc)
    })
    .catch(error => console.warn('addToCart caught error:', error))
}

const emptyCart = () => {
  const db = new PouchDB('cart')

  db.get('cart')
    .then((cartDoc: CartDoc) => {
      cartDoc.line_items = []
      return db.put(cartDoc)
    })
    .catch(function(err) {
      console.log('emptyCart error:', err)
    })
}

const updateLineItem = (line_item: LineItem, idx: number) => {
  const db = new PouchDB('cart')

  db.get('cart')
    .then((cartDoc: CartDoc) => {
      if (cartDoc.line_items && cartDoc.line_items[idx] && line_item.data) {
        if (line_item.unit_type === 'CS') {
          line_item.price = parseFloat(
            (
              line_item.quantity *
              parseFloat(line_item.data[5].replace('$', ''))
            ).toFixed(2)
          )
        } else {
          line_item.price = parseFloat(
            (
              line_item.quantity *
              parseFloat(line_item.data[6].replace('$', ''))
            ).toFixed(2)
          )
        }
        cartDoc.line_items[idx] = line_item
        return db.put(cartDoc)
      }
      throw new Error('no line item found')
    })
    .catch(error => console.warn('addToCart caught error:', error))
}

export {
  // useCartPutService,
  useCartDocService,
  useCartItemCount,
  addToCart,
  removeItemFromCart,
  emptyCart,
  updateLineItem
}
