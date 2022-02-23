import {inject} from '@loopback/core'
import {DefaultCrudRepository} from '@loopback/repository'
import {MainDataSource} from '../datasources'
import {Zone, ZoneRelations} from '../models'

export class ZoneRepository extends DefaultCrudRepository<Zone,
    typeof Zone.prototype.id,
    ZoneRelations> {
    constructor(
        @inject('datasources.main') dataSource: MainDataSource,
    ) {
        super(Zone, dataSource)
    }
}
