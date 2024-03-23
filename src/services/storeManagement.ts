import { InternalServerError } from '@kant2002-diia-inhouse/errors'
import { StoreService, StoreTag } from '@kant2002-diia-inhouse/redis'
import { Logger } from '@kant2002-diia-inhouse/types'

export default class StoreManagementService {
    constructor(
        private readonly store: StoreService,
        private readonly logger: Logger,
    ) {}

    async bumpTags(tags: StoreTag[]): Promise<void> {
        const result = await this.store.bumpTags(tags)

        if (!result) {
            this.logger.error('Failed to bump tags', { tags })

            throw new InternalServerError('Failed to bump tags')
        }
    }
}
