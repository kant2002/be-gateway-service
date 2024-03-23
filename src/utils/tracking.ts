import { Span, SpanStatusCode } from '@opentelemetry/api'

import { MetricsService, RequestStatus, TotalRequestsLabelsMap } from '@kant2002-diia-inhouse/diia-metrics'
import { ErrorType } from '@kant2002-diia-inhouse/errors'
import { HttpStatusCode } from '@kant2002-diia-inhouse/types'

import { ResponseError } from '@interfaces/index'

export default class TrackingUtils {
    constructor(private readonly metrics: MetricsService) {}

    trackError(error: ResponseError, labels: Partial<TotalRequestsLabelsMap>, requestStart?: bigint, span?: Span): void {
        if (!span?.isRecording()) {
            return
        }

        const { name, message, code = HttpStatusCode.INTERNAL_SERVER_ERROR, type = ErrorType.Unoperated } = error

        span?.recordException({ message, code, name })

        if (requestStart) {
            this.metrics.totalTimerMetric.observeSeconds(
                {
                    ...labels,
                    status: RequestStatus.Failed,
                    errorType: <ErrorType>type,
                    statusCode: code,
                },
                process.hrtime.bigint() - requestStart,
            )
        }

        span?.setStatus({ code: SpanStatusCode.ERROR, message })

        span?.end()
    }

    trackSuccess(labels: Partial<TotalRequestsLabelsMap>, requestStart?: bigint, span?: Span): void {
        if (!span?.isRecording()) {
            return
        }

        if (requestStart) {
            this.metrics.totalTimerMetric.observeSeconds(
                {
                    ...labels,
                    status: RequestStatus.Successful,
                },
                process.hrtime.bigint() - requestStart,
            )
        }

        span?.end()
    }
}
