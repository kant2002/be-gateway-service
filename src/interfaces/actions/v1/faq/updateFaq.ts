import { PartnerActionArguments } from '@kant2002-diia-inhouse/types'

import { Faq } from '@interfaces/services/faq'

export interface CustomActionArguments extends PartnerActionArguments {
    params: Faq
}

export type ActionResult = Faq
