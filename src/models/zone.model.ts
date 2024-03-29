import {Entity, hasMany, model, property} from '@loopback/repository'
import {MarketHour} from './market-hour.model'

@model({
    settings: {
        indexes: {
            zoneUniqueNameIdx: {
                keys: {uniqueName: 1},
                options: {unique: false},
            },
        }
    }
})
export class Zone extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: false,
    })
    id: string

    @property({
        type: 'string',
        required: true,
    })
    uniqueName: string

    @hasMany(() => MarketHour, {keyTo: 'zoneId'})
    marketHourList: MarketHour[]

    constructor(data?: Partial<Zone>) {
        super(data)
    }
}

export interface ZoneRelations {
    // describe navigational properties here
}

export type ZoneWithRelations = Zone & ZoneRelations;
