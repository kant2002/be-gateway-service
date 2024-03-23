import { AppAction } from '@kant2002-diia-inhouse/diia-app'

import { ActionVersion, SessionType } from '@kant2002-diia-inhouse/types'
import { ValidationSchema } from '@kant2002-diia-inhouse/validators'

import ErrorTemplateService from '@services/errorTemplate'

import { ActionResult, CustomActionArguments } from '@interfaces/actions/v1/errorTemplates/createErrorTemplate'

export default class CreateErrorTemplateAction implements AppAction {
    constructor(private errorTemplateService: ErrorTemplateService) {}

    readonly sessionType: SessionType = SessionType.Partner

    readonly actionVersion: ActionVersion = ActionVersion.V1

    readonly name: string = 'createErrorTemplate'

    readonly validationRules: ValidationSchema<CustomActionArguments['params']> = {
        errorCode: { type: 'number' },
        template: {
            type: 'object',
            props: {
                description: { type: 'string' },
            },
        },
    }

    async handler(args: CustomActionArguments): Promise<ActionResult> {
        const { params: template } = args

        return await this.errorTemplateService.createErrorTemplate(template)
    }
}
