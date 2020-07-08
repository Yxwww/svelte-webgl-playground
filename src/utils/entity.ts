type Subscriber<T> = (newState: T) => void
type Unsubscriber = () => void
export function createStore<T>(initialState: T) {
  let state = {
    ...initialState,
  }
  const subscribers: Subscriber<T>[] = []
  function reset() {
    state = {
      ...initialState,
    }
  }
  function update(newState: Partial<T>) {
    state = {
      ...state,
      ...newState,
    }
    subscribers.forEach(fn => fn(state))
  }
  function getState() {
    return {
      ...state,
    }
  }
  return {
    update,
    getState,
    subscribe(subscriber: Subscriber<T>) {
      subscriber(getState())
      subscribers.push(subscriber)
      return function unsubscriber() {
        const index = subscribers.indexOf(subscriber)
        if (index !== -1) {
          subscribers.splice(subscribers.indexOf(subscriber), 1)
        }
      }
    },
    reset() {
      update(initialState)
    },
  }
}

interface Entity<T> {
  update(newState: Partial<T>): Promise<any>
  subscribe(sub: Subscriber<T>): Unsubscriber
}
export function createEntity<T>(initialState: T) {
  const store = createStore(initialState)
  return {
    update(newState: Partial<T>) {
      return store.update(newState)
    },
    subscribe(sub: Subscriber<T>) {
      return store.subscribe(sub)
    },
  }
}
