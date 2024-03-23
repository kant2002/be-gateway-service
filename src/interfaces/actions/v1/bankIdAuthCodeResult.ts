import { ServiceActionArguments } from '@kant2002-diia-inhouse/types'

export interface CustomActionArguments extends ServiceActionArguments {
    code: string
    state?: string
    error?: string
    error_description?: string
}
