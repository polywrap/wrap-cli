import { SimpleStorage } from './generated/schema'
import { DataSet as DataSetEvent } from './generated/SimpleStorage/SimpleStorage'

function getStorage(id: string): SimpleStorage {
  let storage = SimpleStorage.load(id)

  if (storage === null) {
    storage = new SimpleStorage(id)
    storage.save()
  }

  return storage
}

export function handleDataSet(event: DataSetEvent) {
  const storage = getStorage(event.address.toHexString())
  storage.lastSetBy = event.params.from.toHexString()
  storage.save()
}
