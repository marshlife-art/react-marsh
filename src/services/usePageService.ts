import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { Page } from '../types/Page'

const DB_URL = 'http://localhost:5984/'

const PAGES_DB = 'pages'

const usePageService = (slug: string, setLoading: (value: boolean) => void) => {
  const [result, setResult] = useState<Service<Page>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!slug || slug.length === 0) {
      setLoading(false)
      return
    }
    const db = new PouchDB(DB_URL + PAGES_DB, {
      skip_setup: true
    })
    db.get(slug)
      .then(doc => setResult({ status: 'loaded', payload: doc as Page }))
      .catch(error => setResult({ ...error }))
      .finally(() => setLoading(false))
  }, [slug, setLoading])

  return result
}

// Promise<Core.AllDocsResponse<Content & Model>>
type AllDocsResponse = Service<PouchDB.Core.AllDocsResponse<any>>

const useAllDocumentsService = (
  collection: string,
  include_docs: boolean = false
) => {
  const [result, setResult] = useState<AllDocsResponse>({
    status: 'loading'
  })

  useEffect(() => {
    if (!collection || collection.length === 0) {
      return
    }
    const db = new PouchDB(DB_URL + collection, {
      skip_setup: true
    })
    db.allDocs({ include_docs: include_docs })
      .then(docs => setResult({ status: 'loaded', payload: docs }))
      .catch(error => setResult({ ...error }))

    const changes = db
      .changes({
        since: 'now',
        live: true,
        include_docs: include_docs
      })
      .on('change', change => {
        if (change.deleted) {
          db.allDocs({ include_docs: include_docs })
            .then(docs => setResult({ status: 'loaded', payload: docs }))
            .catch(error => setResult({ ...error }))
        }
      })
      .on('complete', info => {
        // changes() was canceled
      })
      .on('error', err => {
        console.warn('useCartDocService caught error:', err)
      })

    return () => changes.cancel()
  }, [collection, include_docs])

  return result
}

const useDocumentService = (collection: string, id: string | undefined) => {
  const [result, setResult] = useState<Service<Page>>({
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
      .then(doc => setResult({ status: 'loaded', payload: doc as Page }))
      .catch(error => {
        console.log('useDocumentService db.get error:', error)
        if (error.name === 'not_found') {
          console.log('BUT! try harder...')
          db.put({ _id: id, content: '' })
            .then(response =>
              setResult({
                status: 'loaded',
                payload: {
                  _id: response.id,
                  _rev: response.rev,
                  content: ''
                } as Page
              })
            )
            .catch(error => setResult({ ...error }))
        } else {
          setResult({ ...error })
        }
      })
  }, [collection, id])

  return result
}

const useDocumentPutService = (
  collection: string,
  doc: Page | undefined,
  doSave: boolean,
  updateRev: (rev: string) => void
) => {
  const [result, setResult] = useState<Service<PouchDB.Core.Response>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!doSave || !doc) {
      return
    }
    const db = new PouchDB(DB_URL + collection, {
      skip_setup: true
    })
    console.log('useDocumentPutService gonna save doc:', doc)
    db.put(doc)
      .then(response => {
        setResult({ status: 'saved', payload: response })
        updateRev(response.rev)
      })
      .catch(error => setResult({ ...error }))
  }, [collection, doc, doSave, updateRev])

  return result
}

export {
  usePageService,
  useAllDocumentsService,
  useDocumentService,
  useDocumentPutService
}
