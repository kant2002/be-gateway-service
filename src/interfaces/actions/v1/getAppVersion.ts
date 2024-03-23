import { AppUserActionHeaders, ServiceActionArguments } from '@kant2002-diia-inhouse/types'

export type CustomActionArguments = ServiceActionArguments<AppUserActionHeaders>

export interface ActionResult {
    minVersion: string | null
}
