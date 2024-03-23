import { AppUserActionHeaders, ServiceActionArguments } from '@kant2002-diia-inhouse/types'

import { AppSettings } from '@interfaces/services/settings'

export type CustomActionArguments = ServiceActionArguments<AppUserActionHeaders>

export type ActionResult = AppSettings
