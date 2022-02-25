import {Zone, ZoneWithRelations} from './zone.model'
import {Item, ItemWithRelations} from './item.model'
import {Entity, model, property, belongsTo} from '@loopback/repository'

@model({
    settings: {
        indexes: {
            marketHourZoneIdIdx: {
                keys: {zoneId: 1},
                options: {unique: false},
            },
            marketHourItemUniqueNameIdx: {
                keys: {itemUniqueName: 1},
                options: {unique: false},
            },
            marketHourQualityIdx: {
                keys: {quality: 1},
                options: {unique: false},
            },
            marketHourSnapDateTimeIdx: {
                keys: {snapDateTime: 1},
                options: {unique: false},
            },
            marketHourDirectionIdx: {
                keys: {direction: 1},
                options: {unique: false},
            },
            marketHourThresholdIdx: {
                keys: {threshold: 1},
                options: {unique: false},
            },
            marketHourUniq: {
                keys: {zoneId: 1, itemUniqueName: 1, quality: 1, snapDateTime: 1, direction: 1, threshold: 1,},
                options: {unique: true},
            }
        }
    }
})
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
        type: 'number',
        required: true,
    })
    quality: number

    @property({
        type: 'date',
        required: true,
    })
    snapDateTime: string

    @property({
        type: 'string',
        required: true,
    })
    direction: string

    @property({
        type: 'string',
        required: true,
    })
    threshold: string

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
