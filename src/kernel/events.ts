import mitt from 'mitt'
import type { KernelEventMap } from '../types'

export const kernelBus = mitt<KernelEventMap>()
