import {
    /* inject, Application, CoreBindings, */
    lifeCycleObserver, // The decorator
    LifeCycleObserver, // The interface
} from '@loopback/core'
import {repository} from '@loopback/repository'
import {ItemRepository, MarketHourRepository, ZoneRepository} from '../repositories'
import axios from 'axios'

const cron = require('node-cron')

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class JobsObserver implements LifeCycleObserver {
    /*
    constructor(
      @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    ) {}
    */

    /**
     * This method will be invoked when the application initializes. It will be
     * called at most once for a given application instance.
     */
    async init(): Promise<void> {
        // Add your logic for init
    }

    /**
     * This method will be invoked when the application starts.
     */
    async start(
        @repository(ZoneRepository) zoneRepo: ZoneRepository,
        @repository(ItemRepository) itemRepo: ItemRepository,
        @repository(MarketHourRepository) mhRepo: MarketHourRepository,
    ): Promise<void> {
        // Fetch data from API
        cron.schedule('06 * * * *', async () => {
            console.log('# Fetching data from www.albion-online-data.com...')

            const zoneList = await zoneRepo.find({})
            console.log(`Got ${zoneList.length} zones`)

            const itemList = await itemRepo.find({})
            console.log(`Got ${itemList.length} items`)

            console.log(`Request by 20 zones, by 20 items...`)


            // Not to be blocked, request of sync style
            for (let zi = 0; zi < zoneList.length; zi += 20) {
                const zoneBatch = zoneList.slice(zi, 20)

                for (let ii = 0; ii < itemList.length; ii += 20) {
                    const itemBatch = itemList.slice(ii, 20)

                    try {
                        const marketDataRaw = await axios.get(
                            `https://www.albion-online-data.com/api/v2/stats/prices/${
                                encodeURIComponent(itemBatch.map(i => i.uniqueName).join(','))
                            }?locations=${
                                encodeURIComponent(zoneBatch.map(z => z.uniqueName).join(','))
                            }`)
                        if ((marketDataRaw?.data || []).length > 0) {
                            console.log(`# received for ${zi} - ${ii}`)

                            await Promise.all(marketDataRaw.data.map(async (piece: TAODPiece1) => {
                                const zone = zoneBatch.find(z => z.uniqueName === piece.city)!
                                const item = itemBatch.find(i => i.uniqueName === piece.item_id)!

                                if(!zone) {
                                    console.warn(`Skip for zone in ${zi} - ${ii}`)
                                    console.log(piece)
                                    return
                                }
                                if(!item) {
                                    console.warn(`Skip for item in ${zi} - ${ii}`)
                                    console.log(piece)
                                    return
                                }

                                for (const direction of ['buy', 'sell']) {
                                    for (const threshold of ['min', 'max']) {
                                        const existing = await mhRepo.findOne({
                                            // @ts-ignore
                                            zoneId: zone.id,
                                            itemUniqueName: item.uniqueName,
                                            quality: piece.quality,
                                            // @ts-ignore
                                            snapDateTime: new Date(piece[`${direction}_price_${threshold}_date`]),
                                            direction,
                                            threshold,
                                        })

                                        if (!existing) {
                                            console.log(`# +`)
                                            await mhRepo.create({
                                                // @ts-ignore
                                                zoneId: zone.id,
                                                itemUniqueName: item.uniqueName,
                                                quality: piece.quality,
                                                // @ts-ignore
                                                snapDateTime: new Date(piece[`${direction}_price_${threshold}_date`]),
                                                direction,
                                                threshold,
                                                // @ts-ignore
                                                price: piece[`${direction}_price_${threshold}`],
                                            })
                                        } else {
                                            console.log(`# 0`)
                                        }
                                    }
                                }
                            }))

                        } else {
                            console.warn(`# no response for ${zi} - ${ii}`)
                        }
                        await new Promise(r => setTimeout(r, 70_1000))
                    } catch (e: unknown) {
                        console.error(`Exception for ${zi} - ${ii} \n${itemBatch.map(i => i.uniqueName).join(',')} \n${zoneBatch.map(z => z.uniqueName).join(',')}\n`, (e as Error).message)
                        console.error(`URL: https://www.albion-online-data.com/api/v2/stats/prices/${
                            encodeURIComponent(itemBatch.map(i => i.uniqueName).join(','))
                        }?locations=${
                            encodeURIComponent(zoneBatch.map(z => z.uniqueName).join(','))
                        }`)
                    }
                }
            }


        })
    }

    /**
     * This method will be invoked when the application stops.
     */
    async stop(): Promise<void> {
        // Add your logic for stop
    }
}
