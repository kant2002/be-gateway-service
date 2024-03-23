import { BalancingStrategy, CorsConfig, MetricsConfig, TracingConfig, TransporterConfig } from '@kant2002-diia-inhouse/diia-app'

import { StrapiConfig } from '@kant2002-diia-inhouse/cms'
import { IdentifierConfig } from '@kant2002-diia-inhouse/crypto'
import { AppDbConfig, ReplicaSetNodeConfig } from '@kant2002-diia-inhouse/db'
import { ListenerOptions, QueueConfig, QueueConnectionConfig, QueueConnectionType } from '@kant2002-diia-inhouse/diia-queue'
import { EnvService } from '@kant2002-diia-inhouse/env'
import { HealthCheckConfig } from '@kant2002-diia-inhouse/healthcheck'
import { RedisConfig } from '@kant2002-diia-inhouse/redis'
import { DurationMs, DurationS, GenericObject, HttpMethod } from '@kant2002-diia-inhouse/types'

import { AuthConfig, MinioConfig } from '@interfaces/config'
import { MinAppVersionConfigType } from '@interfaces/services/version'

export default async (envService: EnvService, serviceName: string): Promise<GenericObject> => {
    const PORT = envService.getVar('APP_PORT', 'number')

    const signAlgorithm = 'RS256'

    return {
        isMoleculerEnabled: true,
        transporter: <TransporterConfig>{
            type: envService.getVar('TRANSPORT_TYPE', 'string'),
            options: envService.getVar('TRANSPORT_OPTIONS', 'object', {}),
        },

        balancing: <BalancingStrategy>{
            strategy: process.env.BALANCING_STRATEGY_NAME,
            strategyOptions: envService.getVar('BALANCING_STRATEGY_OPTIONS', 'object', {}),
        },

        db: <AppDbConfig>{
            database: process.env.MONGO_DATABASE,
            replicaSet: process.env.MONGO_REPLICA_SET,
            user: await envService.getSecret('MONGO_USER', 'username'),
            password: await envService.getSecret('MONGO_PASSWORD', 'password'),
            authSource: process.env.MONGO_AUTH_SOURCE,
            port: envService.getVar('MONGO_PORT', 'number'),
            replicaSetNodes:
                process.env.MONGO_HOSTS &&
                process.env.MONGO_HOSTS.split(',').map((replicaHost: string): ReplicaSetNodeConfig => ({ replicaHost })),
            readPreference: process.env.MONGO_READ_PREFERENCE,
            indexes: {
                sync: process.env.MONGO_INDEXES_SYNC === 'true',
                exitAfterSync: process.env.MONGO_INDEXES_EXIT_AFTER_SYNC === 'true',
            },
        },

        redis: <RedisConfig>{
            readWrite: envService.getVar('REDIS_READ_WRITE_OPTIONS', 'object'),

            readOnly: envService.getVar('REDIS_READ_ONLY_OPTIONS', 'object'),
        },

        store: <RedisConfig>{
            readWrite: envService.getVar('STORE_READ_WRITE_OPTIONS', 'object'),

            readOnly: envService.getVar('STORE_READ_ONLY_OPTIONS', 'object'),
        },

        rabbit: <QueueConnectionConfig>{
            [QueueConnectionType.Internal]: <QueueConfig>{
                connection: {
                    hostname: process.env.RABBIT_HOST,
                    port: envService.getVar('RABBIT_PORT', 'number', 5672),
                    username: process.env.RABBIT_USERNAME,
                    password: process.env.RABBIT_PASSWORD,
                    heartbeat: envService.getVar('RABBIT_HEARTBEAT', 'number', 60),
                },
                socketOptions: {
                    clientProperties: {
                        applicationName: `${serviceName} Service`,
                    },
                },
                reconnectOptions: {
                    reconnectEnabled: true,
                },
                listenerOptions: <ListenerOptions>{
                    prefetchCount: envService.getVar('RABBIT_QUEUE_PREFETCH_COUNT', 'number', 10),
                },
            },
            [QueueConnectionType.External]: <QueueConfig>{
                connection: {
                    hostname: process.env.EXTERNAL_RABBIT_HOST,
                    port: envService.getVar('EXTERNAL_RABBIT_PORT', 'number', 5672),
                    username: process.env.EXTERNAL_RABBIT_USERNAME,
                    password: process.env.EXTERNAL_RABBIT_PASSWORD,
                    heartbeat: envService.getVar('EXTERNAL_RABBIT_HEARTBEAT', 'number', 60),
                },
                socketOptions: {
                    clientProperties: {
                        applicationName: `${serviceName} Service`,
                    },
                },
                reconnectOptions: {
                    reconnectEnabled: true,
                },
                listenerOptions: <ListenerOptions>{
                    prefetchCount: envService.getVar('EXTERNAL_RABBIT_QUEUE_PREFETCH_COUNT', 'number', 1),
                },
                assertExchanges: process.env.EXTERNAL_RABBIT_ASSERT_EXCHANGES === 'true',
            },
        },

        healthCheck: <HealthCheckConfig>{
            isEnabled: process.env.HEALTH_CHECK_IS_ENABLED === 'true',
            port: envService.getVar('HEALTH_CHECK_IS_PORT', 'number', 3000),
        },

        metrics: <MetricsConfig>{
            moleculer: {
                prometheus: {
                    isEnabled: envService.getVar('METRICS_MOLECULER_PROMETHEUS_IS_ENABLED', 'boolean', true),
                    port: envService.getVar('METRICS_MOLECULER_PROMETHEUS_PORT', 'number', 3031),
                    path: envService.getVar('METRICS_MOLECULER_PROMETHEUS_PATH', 'string', '/metrics'),
                },
            },
            custom: {
                disabled: envService.getVar('METRICS_CUSTOM_DISABLED', 'boolean', false),
                port: envService.getVar('METRICS_CUSTOM_PORT', 'number', 3030),
                moleculer: {
                    disabled: envService.getVar('METRICS_CUSTOM_MOLECULER_DISABLED', 'boolean', false),
                    port: envService.getVar('METRICS_CUSTOM_MOLECULER_PORT', 'number', 3031),
                    path: envService.getVar('METRICS_CUSTOM_MOLECULER_PATH', 'string', '/metrics'),
                },
                disableDefaultMetrics: envService.getVar('METRICS_CUSTOM_DISABLE_DEFAULT_METRICS', 'boolean', false),
                defaultLabels: envService.getVar('METRICS_CUSTOM_DEFAULT_LABELS', 'object', {}),
                responseTimingBuckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 0.7, 1, 5, 10],
                requestTimingBuckets: [0.01, 0.05, 0.1, 0.2, 0.5, 0.7, 1, 5, 10, 20, 40, 60],
            },
        },

        cacheDb: <AppDbConfig>{
            isEnabled: process.env.MONGO_CACHE_IS_ENABLED === 'true',
            database: process.env.MONGO_CACHE_DATABASE,
            replicaSet: process.env.MONGO_CACHE_REPLICA_SET,
            user: process.env.MONGO_CACHE_USER,
            password: process.env.MONGO_CACHE_PASSWORD,
            authSource: process.env.MONGO_CACHE_AUTH_SOURCE,
            port: envService.getVar('MONGO_CACHE_PORT', 'number', null),
            replicaSetNodes: envService
                .getVar('MONGO_CACHE_HOSTS', 'string', '')
                .split(',')
                .map((replicaHost: string): ReplicaSetNodeConfig => ({ replicaHost })),
            readPreference: process.env.MONGO_CACHE_READ_PREFERENCE,
        },

        cors: <CorsConfig>{
            // Configures the Access-Control-Allow-Origin CORS header.
            origins: [`http://localhost:${PORT}/`, `http://127.0.0.1:${PORT}/`, 'https://api2oss.diia.gov.ua'],
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: [HttpMethod.GET, HttpMethod.OPTIONS, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ['*', 'Access-Control-Allow-Origin', 'Authorization', 'Content-Type', 'x-requested-with'],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600,
        },

        auth: <AuthConfig>{
            authHeader: 'authorization',
            authSchema: 'bearer',
            deviceHeaderUuidVersions: ['4', '5'],
            jwt: {
                tokenVerifyOptions: {
                    algorithms: [signAlgorithm],
                    ignoreExpiration: false,
                },
                tokenSignOptions: {
                    algorithm: signAlgorithm,
                    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
                },
                publicKey: process.env.JWE_SECRET_TOKEN_PUBLIC_KEY,
                privateKey: process.env.JWE_SECRET_TOKEN_PRIVATE_KEY,
            },
            jwk: envService.getVar('JWE_SECRET_DATA_JWK'),
        },

        tracing: <TracingConfig>{
            zipkin: {
                isEnabled: process.env.ZIPKIN_IS_ENABLED === 'true',
                baseURL: envService.getVar('ZIPKIN_URL'),
                sendIntervalSec: envService.getVar('ZIPKIN_SEND_INTERVAL_SEC', 'number'),
            },
        },

        minio: <MinioConfig>{
            isEnabled: process.env.MINIO_IS_ENABLED === 'true',
            host: process.env.MINIO_HOST,
            port: envService.getVar('MINIO_PORT', 'number', 9000),
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        },

        identifier: <IdentifierConfig>{
            salt: process.env.SALT,
        },

        [MinAppVersionConfigType.MinAppVersion]: {
            android: envService.getVar('ANDROID_MIN_APP_VERSION', 'string', '30'),
            ios: envService.getVar('IOS_MIN_APP_VERSION', 'string', '2.0'),
        },

        [MinAppVersionConfigType.MinEResidentAppVersion]: {
            android: envService.getVar('ANDROID_MIN_ERESIDENT_APP_VERSION', 'string', '10'),
            ios: envService.getVar('IOS_MIN_ERESIDENT_APP_VERSION', 'string', '1.0'),
        },

        faq: {
            expirationTimeInSec: envService.getVar('FAQ_EXPIRATION_TIME_IN_SEC', 'number', DurationS.Hour),
            filePath: process.env.FAQ_FILE_PATH,
            eResidentFilePath: envService.getVar('FAQ_ERESIDENT_FILE_PATH', 'string', './faqEResident.json'),
        },

        processCodesTemplates: {
            folderPath: envService.getVar('PROCESS_CODES_TEMPLATES_FOLDER_PATH'),
            eResidentFolderPath: envService.getVar('PROCESS_CODES_TEMPLATES_ERESIDENT_FOLDER_PATH'),
            cabinetFolderPath: envService.getVar('PROCESS_CODES_TEMPLATES_CABINET_FOLDER_PATH'),
        },

        routeAccess: {
            blockItns: envService.getVar<string[]>('ROUTE_ACCESS_BLOCK_ITNS', 'object', []),
        },

        swagger: {
            isEnabled: process.env.SWAGGER_IS_ENABLED === 'true',
            path: process.env.SWAGGER_PATH,
        },

        strapi: <StrapiConfig>{
            isEnabled: process.env.STRAPI_IS_ENABLED === 'true',
            host: process.env.STRAPI_API_HOST,
            port: envService.getVar('STRAPI_API_PORT', 'number', null),
            token: process.env.STRAPI_API_TOKEN,
        },

        appPort: PORT,

        userActivity: {
            isEnabled: envService.getVar('USER_ACTIVITY_IN_ENABLED', 'boolean', true),
            ttl: envService.getVar('USER_ACTIVITY_TTL', 'number', DurationMs.Second * 30),
        },
    }
}
