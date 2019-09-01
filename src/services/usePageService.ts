import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'

import { Service } from '../types/Service'
import { Page } from '../types/Page'

const PAGES_DB_URL = 'http://localhost:5984/pages'

const usePageService = (slug: string, setLoading: (value: boolean) => void) => {
  const [result, setResult] = useState<Service<Page>>({
    status: 'loading'
  })

  useEffect(() => {
    if (!slug || slug.length === 0) {
      setLoading(false)
      return
    }
    const db = new PouchDB(PAGES_DB_URL, {
      skip_setup: true
    })
    db.get(slug)
      .then(doc => setResult({ status: 'loaded', payload: doc as Page }))
      .catch(error => setResult({ ...error }))
      .finally(() => setLoading(false))
  }, [slug, setLoading])

  return result
}

export default usePageService
