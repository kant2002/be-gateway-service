import { AsyncLocalStorage } from 'async_hooks'

import DiiaLogger from '@kant2002-diia-inhouse/diia-logger'
import { QueueContext } from '@kant2002-diia-inhouse/diia-queue'
import { mockClass } from '@kant2002-diia-inhouse/test'

export const logger = new (mockClass(DiiaLogger))()

export const asyncLocalStorageMock = <AsyncLocalStorage<QueueContext>>(<unknown>{
    getStore: jest.fn(),
})
