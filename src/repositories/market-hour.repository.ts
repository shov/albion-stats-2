import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MainDataSource} from '../datasources';
import {MarketHour, MarketHourRelations} from '../models';

export class MarketHourRepository extends DefaultCrudRepository<
  MarketHour,
  typeof MarketHour.prototype.id,
  MarketHourRelations
> {
  constructor(
    @inject('datasources.main') dataSource: MainDataSource,
  ) {
    super(MarketHour, dataSource);
  }
}
