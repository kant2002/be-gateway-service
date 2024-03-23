import { AppAction } from '@kant2002-diia-inhouse/diia-app'

import { ActionVersion, SessionType } from '@kant2002-diia-inhouse/types'
import { UserActionArguments } from '@kant2002-diia-inhouse/types/dist/types/actions/actionArguments'

import FaqService from '@services/faq'

import { ActionResult } from '@interfaces/actions/v1/getFaq'

export default class GetFaqAction implements AppAction {
    constructor(private readonly faqService: FaqService) {}

    readonly sessionType: SessionType = SessionType.User

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'getFaq'

    async handler(args: UserActionArguments): Promise<ActionResult> {
        const {
            session: { sessionType, features = {} },
        } = args

        return await this.faqService.getFaq(sessionType, features)
    }
}
