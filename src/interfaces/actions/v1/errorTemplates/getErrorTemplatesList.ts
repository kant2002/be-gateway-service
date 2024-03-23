import { PartnerActionArguments } from '@kant2002-diia-inhouse/types'

import { ErrorTemplateListResult } from '@interfaces/services/errorTemplate'

export interface CustomActionArguments extends PartnerActionArguments {
    params: {
        skip?: number
        limit?: number
    }
}

export type ActionResult = ErrorTemplateListResult
