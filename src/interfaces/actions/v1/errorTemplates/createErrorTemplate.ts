import { PartnerActionArguments } from '@kant2002-diia-inhouse/types'

import { ErrorTemplate } from '@interfaces/models/errorTemplate'

export interface CustomActionArguments extends PartnerActionArguments {
    params: ErrorTemplate
}

export type ActionResult = ErrorTemplate
