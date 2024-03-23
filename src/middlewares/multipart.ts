import { IncomingMessage } from 'http'

import formidable from 'formidable'

import { Logger } from '@kant2002-diia-inhouse/types'

import { MimeType, Request, Response, RouteHeaderRawName } from '@interfaces/index'
import { MiddlewareNext } from '@interfaces/middlewares'

export default class MultipartMiddleware {
    constructor(private readonly logger: Logger) {}

    parse(req: Request, _res: Response, next: MiddlewareNext): void {
        const requestHeaders = req.headers
        const contentType = requestHeaders[RouteHeaderRawName.CONTENT_TYPE]

        if (!contentType || !contentType.includes(MimeType.MultipartMixed)) {
            next()

            return
        }

        const parser = formidable({ multiples: true })
        const incomingRequest = <unknown>req

        parser.parse(<IncomingMessage>incomingRequest, (err: Error, fields: object): void => {
            if (err) {
                this.logger.error('Unable to parse multipart', { error: err })
                next(err)

                return
            }

            req.$params.body = Object.assign(req.$params.body, { ...fields })
            next()
        })
    }
}
