import { Injectable } from '@angular/core'

export interface DataItem {
  id: number
  name: string
  description: string
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private items = new Array<DataItem>(
    {
      id: 1,
      name: 'Item 1',
      description: 'Description for Item 1',
    },
    {
      id: 2,
      name: 'Item 2',
      description: 'Description for Item 2',
    },
    {
      id: 3,
      name: 'Item 3',
      description: 'Description for Item 3',
    },
    {
      id: 4,
      name: 'Item 4',
      description: 'Description for Item 4',
    },
    {
      id: 5,
      name: 'Item 5',
      description: 'Description for Item 5',
    },
    {
      id: 6,
      name: 'Item 6',
      description: 'Description for Item 6',
    },
    {
      id: 7,
      name: 'Item 7',
      description: 'Description for Item 7',
    },
    {
      id: 8,
      name: 'Item 8',
      description: 'Description for Item 8',
    }
  )

  getItems(): Array<DataItem> {
    return this.items
  }

  getItem(id: number): DataItem {
    return this.items.filter((item) => item.id === id)[0]
  }
}
