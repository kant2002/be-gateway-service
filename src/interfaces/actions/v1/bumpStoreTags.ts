import { StoreTag } from '@kant2002-diia-inhouse/redis'
import { PartnerActionArguments } from '@kant2002-diia-inhouse/types'

export interface CustomActionArguments extends PartnerActionArguments {
    params: {
        tags: StoreTag[]
    }
}

export interface ActionResult {
    success: true
}
