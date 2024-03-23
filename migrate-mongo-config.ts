require('dotenv-flow').config({ silent: true })

import { MongoHelper } from '@kant2002-diia-inhouse/db'

module.exports = {
    ...MongoHelper.migrateMongoConfig,
}
