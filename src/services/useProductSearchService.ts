import { useEffect, useState } from 'react'
import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

import { Service } from '../types/Service'
// import { ProductDoc } from '../types/Product'

PouchDB.plugin(PouchDBFind)

const DB_URL = 'http://localhost:5984/'

const useProductSearchService = (q: string) => {
  const [result, setResult] = useState<Service<PouchDB.Core.Response>>({
    status: 'loading'
  })

  const db = new PouchDB(DB_URL + 'products_wholesale')

  // db.createIndex({
  //   index: {
  //     fields: ['data']
  //   }
  // }).then(function (result) {
  //   // yo, a result
  // }).catch(function (err) {
  //   console.warn('[useProductSearchService] db.createIndex caught error:',err)
  // });

  useEffect(() => {
    if (!q) {
      return
    }

    console.log('useProductSearchService] gonna search:', q, ' db:', db)

    // db.find({
    //   selector: {name: 'Mario'},
    //   fields: ['_id', 'name'],
    //   sort: ['name']
    // }).then(function (result) {
    //   // yo, a result
    // }).catch(function (err) {
    //   // ouch, an error
    // });
  }, [q])

  return result
}

export { useProductSearchService }
