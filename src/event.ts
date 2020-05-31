export type Listener = (...args: any[]) => void

export type ListenerMap = {
  [name: string]: Set<Listener>
}

export type EventEmitter = {
  on(name: string, listener: Listener): () => void
  once(name: string, listener: Listener): () => void
  off(name: string, listener: Listener): void
  emit(name: string, ...args: any[]): void
}

export function createEventEmitter(props = {}): EventEmitter {

  const listeners: ListenerMap = {}

  const emitter = {
    on(name: string, listener: Listener) {
      (listeners[name] || (listeners[name] = new Set())).add(listener)
      return () => emitter.off(name, listener)
    },
    once(name: string, listener: Listener) {
      const off = emitter.on(name, (event?: any) => {
        off()
        listener(event)
      })
      return off
    },
    off(name: string, listener: Listener) {
      listeners[name] && listeners[name].delete(listener)
    },
    emit(name: string, ...args: any[]) {
      listeners[name] && listeners[name].forEach(listener => listener(...args))
    }
  }

  return Object.assign(emitter, props)
}