import { SimpleStorage } from './generated/schema'
import { DataSet as DataSetEvent } from './generated/SimpleStorage/SimpleStorage'

function getStorage(id: string): SimpleStorage {
  let storage = SimpleStorage.load(id)

  if (storage === null) {
    storage = new SimpleStorage(id)
    storage.save()
  }

  return storage as SimpleStorage
}

export function handleDataSet(event: DataSetEvent): void {
  var address = event.address.toHexString()
  const storage = getStorage(address)
  storage.lastSetBy = event.params.from
  storage.save()
}
