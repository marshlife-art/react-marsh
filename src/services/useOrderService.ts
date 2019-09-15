import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { PartialOrderDoc, OrderDoc } from '../types/Order'

/*  GUH, this shuold just be a fetch() post to a node service
 *  not pouchDB. anyhow, for now:
 */

const DB_URL = 'http://localhost:5984/'

const useOrderPutService = (
  doc: PartialOrderDoc | undefined,
  doSave: boolean,
  updateRev: (rev: string) => void
) => {
  const [result, setResult] = useState<Service<PartialOrderDoc>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!doSave || doc === undefined) {
      return
    }
    const db = new PouchDB(DB_URL + 'orders')
    console.log('useOrderPutService gonna save doc:', doc)
    doc._id = `${Date.now()}`
    db.put(doc)
      .then(response => {
        setResult({ status: 'saved', payload: response as PartialOrderDoc })
        updateRev(response.rev)
      })
      .catch(error => setResult({ ...error }))
  }, [doc, doSave, updateRev])

  return result
}

// #TODO: this is pretty much the same as usePageService
const useOrderDocService = (collection: string, id: string | undefined) => {
  const [result, setResult] = useState<Service<OrderDoc>>({
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
      .then(doc => setResult({ status: 'loaded', payload: doc as OrderDoc }))
      .catch(error => {
        console.log('useOrderDocService db.get error:', error)
        setResult({ ...error })
      })
  }, [collection, id])

  return result
}

export { useOrderPutService, useOrderDocService }
