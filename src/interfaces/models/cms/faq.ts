import { CmsBaseAttributes, CmsEntries } from '@kant2002-diia-inhouse/cms'
import { ProfileFeature, SessionType } from '@kant2002-diia-inhouse/types'

import { FaqParameter } from '@interfaces/models/faqCategory'

export interface CmsFaq extends CmsBaseAttributes {
    question: string
    answer: string
    parameters: FaqParameter[]
}

export interface CmsFaqCategory extends CmsBaseAttributes {
    code: string
    name: string
    sessionType: SessionType
    faq: CmsEntries<CmsFaq>
    features?: {
        value: ProfileFeature
    }[]
    order: number
}
