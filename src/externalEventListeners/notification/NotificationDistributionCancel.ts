import { EventBusListener, ExternalEvent, ExternalEventBus } from '@kant2002-diia-inhouse/diia-queue'
import { ValidationError } from '@kant2002-diia-inhouse/errors'
import { ValidationSchema } from '@kant2002-diia-inhouse/validators'

import NotificationService from '@services/notification'

import ExternalEventListenersUtils from '@utils/externalEventListeners'

import { MessagePayload } from '@interfaces/externalEventListeners'
import { EventPayload } from '@interfaces/externalEventListeners/notification'

export default class NotificationDistributionCancelEventListener implements EventBusListener {
    constructor(
        private readonly externalEventListenersUtils: ExternalEventListenersUtils,
        private readonly notificationService: NotificationService,

        private readonly externalEventBus: ExternalEventBus,
    ) {}

    readonly event: ExternalEvent = ExternalEvent.NotificationDistributionCancel

    readonly validationRules: ValidationSchema = {
        uuid: { type: 'string' },
        request: {
            type: 'object',
            props: {
                partnerId: { type: 'string' },
            },
        },
    }

    async validationErrorHandler(error: ValidationError, uuid: string): Promise<void> {
        await this.externalEventListenersUtils.handleError(error, this.event, uuid)
    }

    async handler(payload: EventPayload): Promise<void> {
        const { uuid, request } = payload
        const { partnerId, ...params } = request
        const event: ExternalEvent = this.event
        try {
            const [route, session] = await this.externalEventListenersUtils.validatePartnerRoute(event, partnerId)

            const response: unknown = await this.notificationService.makeRequest(route.action, params, session)
            const message: MessagePayload = { uuid, response }

            await this.externalEventBus.publish(event, message)
        } catch (error) {
            await this.externalEventListenersUtils.handleError(error, event, uuid)
        }
    }
}
