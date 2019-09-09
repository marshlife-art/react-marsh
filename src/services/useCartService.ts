import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { CartDoc } from '../types/Cart'

// const DB_URL = 'http://localhost:5984/'

const useCartPutService = (
  doc: CartDoc | undefined,
  doSave: boolean,
  updateRev: (rev: string) => void
) => {
  const [result, setResult] = useState<Service<PouchDB.Core.Response>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!doSave || doc === undefined) {
      return
    }
    const db = new PouchDB('cart') // local #TODO: add remote sync
    console.log('useCartPutService gonna save doc:', doc)
    db.put(doc)
      .then(response => {
        setResult({ status: 'saved', payload: response })
        updateRev(response.rev)
      })
      .catch(error => setResult({ ...error }))
  }, [doc, doSave, updateRev])

  return result
}

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
  }, [])

  return result
}

const useCartItemCount = () => {
  const [itemCount, setItemCount] = useState(0)

  const db = new PouchDB('cart')

  db.get('cart').then((doc: CartDoc) =>
    setItemCount(doc.data ? doc.data.length : 0)
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
          setItemCount(doc.data ? doc.data.length : 0)
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

  db.get('cart')
    .then((cartDoc: CartDoc) => {
      cartDoc.data = cartDoc.data || []
      cartDoc.data.push(row)
      db.put(cartDoc)
    })
    .catch(error => console.warn('addToCart caught error:', error))
}

export { useCartPutService, useCartDocService, useCartItemCount, addToCart }
