import { CmsEntriesMeta, CmsService, StrapiConfig } from '@kant2002-diia-inhouse/cms'
import { HttpService } from '@kant2002-diia-inhouse/http'
import { mockClass } from '@kant2002-diia-inhouse/test'
import { Logger, SessionType } from '@kant2002-diia-inhouse/types'

import { StrapiFaqProvider } from '@src/providers/faq'

import FaqCategoryCmsDataMapper from '@dataMappers/cms/faqCategoryCmsDataMapper'

describe('strapiFaqProvider', () => {
    const resultData = {
        meta: <CmsEntriesMeta>'',
        data: [],
    }

    const cmsService = new (mockClass(CmsService))(<StrapiConfig>{}, <HttpService>{}, <Logger>{})
    const faqCategoryCmsDataMapper = <FaqCategoryCmsDataMapper>{}

    const strapiFaqProvider = new StrapiFaqProvider(cmsService, faqCategoryCmsDataMapper)

    describe('method: `getCategoriesList`', () => {
        it('should return categories list', async () => {
            jest.spyOn(cmsService, 'getList').mockResolvedValueOnce(resultData)
            const list = await strapiFaqProvider.getCategoriesList(<SessionType>{}, {})

            expect(list).toStrictEqual(resultData.data)
        })
    })
})
