import { Field } from 'multer'

import { ExternalEvent } from '@kant2002-diia-inhouse/diia-queue'
import { Env } from '@kant2002-diia-inhouse/env'
import {
    ActionVersion,
    HttpMethod,
    PartnerScopes,
    PortalUserPetitionPermissions,
    PortalUserPollPermissions,
    SessionType,
} from '@kant2002-diia-inhouse/types'

import { ExternalAlias, MimeType, Proxy, Route, RouteHeaderRawName } from '@interfaces/index'
import { ProfileFeatureExpression } from '@interfaces/profileFeature'

// in bytes
export enum FileSize {
    MB_20 = 20971520,
    MB_1 = 1048576,
    MB_5 = 5242880,
    KB_500 = 524288,
}

export interface CustomHeader {
    name: RouteHeaderRawName
    versions: ActionVersion[]
}

export type SessionTypes = (
    | SessionType.None
    | SessionType.User
    | SessionType.EResident
    | SessionType.EResidentApplicant
    | SessionType.CabinetUser
)[]

export interface RouteAuthParams {
    sessionType?: SessionType
    sessionTypes?: SessionTypes
    version: ActionVersion
    blockAccess?: boolean
    skipJwtVerification?: boolean
    scopes?: PartnerScopes
    permissions?: {
        petition?: PortalUserPetitionPermissions[]
        poll?: PortalUserPollPermissions[]
    }
}

export interface UploadAttempts {
    periodSec: number
    max: number
}

export interface AppRoute extends Route {
    method: HttpMethod
    path: string
    proxyTo?: Proxy
    action?: string
    externalAlias?: ExternalAlias
    auth: RouteAuthParams[]
    mergeParams?: boolean
    headers?: CustomHeader[]
    redirect?: string
    upload?: {
        allowedMimeTypes: MimeType[]
        field?: string
        required: boolean
        maxFileSize?: FileSize
        multiple?: boolean
        fields?: Field[]
        attempts?: UploadAttempts
    }
    forbiddenEnvs?: Env[]
    externalEvent?: ExternalEvent
    metadata?: {
        tags?: string[]
        summary?: string
        deprecated?: boolean
    }
    profileFeaturesExpression?: ProfileFeatureExpression
    preserveRawBody?: boolean
}

export interface GatewayUserActivityEventPayload {
    userIdentifier: string
    mobileUid: string
}
