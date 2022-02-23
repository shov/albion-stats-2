import {Entity, hasMany, model, property} from '@loopback/repository'
import {MarketHour} from './market-hour.model'

@model()
export class Item extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  externalId: number;

  @property({
    type: 'string',
    required: true,
  })
  uniqueName: string;

  @property({
    type: 'number',
  })
  tier?: number;

  @property({
    type: 'number',
  })
  quality?: number;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  desc?: string;

  @property({
    type: 'object',
    required: true,
  })
  srcData: object;

  @hasMany(() => MarketHour, {keyTo: 'itemUniqueName'})
  marketHourList: MarketHour[]

  constructor(data?: Partial<Item>) {
    super(data);
  }
}

export interface ItemRelations {
  // describe navigational properties here
}

export type ItemWithRelations = Item & ItemRelations;
