import { AsyncLocalStorage } from 'async_hooks';

let currentContext: AsyncLocalStorage<any> | undefined;

export function context(): AsyncLocalStorage<any> {
  if (currentContext === undefined) {
    currentContext = new AsyncLocalStorage();
  }

  return currentContext;
}
