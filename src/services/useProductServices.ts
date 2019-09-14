import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { ProductDoc } from '../types/Product'

const DB_URL = 'http://localhost:5984/'

const useProductsPutService = (
  collection: string,
  doc: ProductDoc | undefined,
  doSave: boolean,
  updateRev: (rev?: string) => void,
  force: boolean
) => {
  const [result, setResult] = useState<Service<PouchDB.Core.Response>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!doSave || !doc) {
      return
    }
    const db = new PouchDB(DB_URL + collection)
    console.log('[useProductsPutService] gonna save doc:', doc)

    db.put(doc)
      .then(response => {
        console.log('okay saved it!')
        setResult({ status: 'saved', payload: response })
        updateRev(response.rev)
      })
      .catch(error => {
        if (force) {
          console.log('CAUGHT ERR BUT WILL USE FORCE')
          db.get(doc._id)
            .then(response => {
              console.log('ok, updated now re-saving...')
              doc._rev = response._rev
              db.put(doc).then(response => {
                console.log('w00t, puttttttttit')
                setResult({ status: 'saved', payload: response })
                updateRev(response.rev)
              })
            })
            .catch(err => {
              console.log('[useProductsPutService] zomg error', error)
              setResult({ status: 'error', error: error.reason })
              updateRev(doc._rev)
            })
        } else {
          console.log('[useProductsPutService] zomg error', error)
          setResult({ status: 'error', error: error.reason })
          updateRev(doc._rev)
        }
      })
  }, [collection, doc, doSave, updateRev])

  return result
}

const useProductDocService = (collection: string, id: string | undefined) => {
  const [result, setResult] = useState<Service<ProductDoc>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!collection || collection.length === 0 || !id || id.length === 0) {
      return
    }
    const db = new PouchDB(DB_URL + collection, {
      skip_setup: true
    })
    db.get(id)
      .then(doc => setResult({ status: 'loaded', payload: doc as ProductDoc }))
      .catch(error => {
        console.log('useDocumentService db.get error:', error)
        if (error.name === 'not_found') {
          console.log('not_found! ...try harder?!')
        }
        setResult({ ...error })
      })
  }, [collection, id])

  return result
}

const deleteAllDocs = (collection: string) => {
  const db = new PouchDB(DB_URL + collection)
  console.log(
    '[useProductsPutService] gonna PURGE all docs for db:',
    collection
  )
  return db
    .allDocs()
    .then(docs => docs.rows.map(doc => db.remove(doc.id, doc.value.rev)))
}

export { useProductsPutService, useProductDocService, deleteAllDocs }
