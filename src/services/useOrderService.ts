import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { PartialOrderDoc } from '../types/Order'

/*  GUH, this shuold just be a fetch() post to a node service
 *  not pouchDB. anyhow, for now:
 */

const DB_URL = 'http://localhost:5984/'

const useOrderService = (
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
    console.log('useOrderService gonna save doc:', doc)
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

export { useOrderService }
