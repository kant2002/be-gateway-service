import { SessionType, UserFeatures } from '@kant2002-diia-inhouse/types'

import { FaqCategory } from '@interfaces/models/faqCategory'

export interface FaqProvider {
    getCategoriesList(session: SessionType, userFeatures: UserFeatures): Promise<FaqCategory[]>
}
