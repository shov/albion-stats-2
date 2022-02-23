import {Zone, ZoneWithRelations} from './zone.model'
import {Item, ItemWithRelations} from './item.model'
import {Entity, model, property, belongsTo} from '@loopback/repository'

@model()
export class MarketHour extends Entity {
    @property({
        type: 'number',
        id: true,
        generated: true,
    })
    id: number

    @belongsTo(() => Zone, {keyTo: 'id'}, {required: true})
    zoneId: number

    @belongsTo(() => Item, {keyTo: 'uniqueName'}, {required: true})
    itemUniqueName: string

    @property({
        type: 'date',
        required: true,
    })
    snapTime: string

    @property({
        type: 'string',
        required: true,
    })
    type: string

    @property({
        type: 'number',
        required: true,
    })
    price: number


    constructor(data?: Partial<MarketHour>) {
        super(data)
    }
}

export interface MarketHourRelations {
    item: ItemWithRelations,
    zone: ZoneWithRelations,
}

export type MarketHourWithRelations = MarketHour & MarketHourRelations;
