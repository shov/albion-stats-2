import {
    /* inject, Application, CoreBindings, */
    lifeCycleObserver, // The decorator
    LifeCycleObserver, // The interface
} from '@loopback/core'
import {repository} from '@loopback/repository'
import {ItemRepository, ZoneRepository} from '../repositories'
import axios from 'axios'


/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class InitialDataObserver implements LifeCycleObserver {
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
    ): Promise<void> {
        console.log(`Init seeding...`)


        {
            console.log(`Zones`)
            const countResult = await zoneRepo.count()
            if ((countResult?.count || 0) < 1) {
                console.log(` - No zones found, request from broderickhyman...`)
                const zonesRaw = await axios.get('https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/world.json')
                if ((zonesRaw?.data || []).length > 0) {
                    console.log(` - Got ${zonesRaw.data.length}, saving...`)

                    try {
                        await zoneRepo.createAll(zonesRaw.data.map((raw: TDict) => {
                            return {
                                id: raw.Index,
                                uniqueName: raw.UniqueName,
                            }
                        }))
                        console.log(' - Done')
                    } catch (e: unknown) {
                        console.error(' - Seeding error!')
                        throw e
                    }
                }
            }
        }

        {
            console.log(`Items`)
            const countResult = await itemRepo.count()
            if ((countResult?.count || 0) < 1) {
                console.log(` - No items found, request from broderickhyman...`)
                const itemsRaw = await axios.get('https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/items.json')
                if ((itemsRaw?.data || []).length > 0) {
                    console.log(` - Got ${itemsRaw.data.length}, saving...`)

                    try {
                        await itemRepo.createAll(itemsRaw.data.map((raw: TDict) => {

                            const groups = (raw?.UniqueName as string || '')
                                .match(/^(?<rawTier>T\d_)?(?<name>[^_][^@]+)(?<rawEnchantment>@\d)?$/i)
                                ?.groups

                            const tier = 'string' === typeof groups?.rawTier ? Number(groups.rawTier.replace('T', '').replace('_', '')) : undefined
                            const enchantment = 'string' === typeof groups?.rawEnchantment ? Number(groups.rawEnchantment.replace('@', '')) : undefined

                            return {
                                externalId: raw.Index,
                                uniqueName: raw.UniqueName,
                                tier,
                                enchantment,
                                title: ((raw?.LocalizedNames as TDict) || {'RU-RU': undefined})['RU-RU'] || raw?.LocalizationNameVariable,
                                desc: ((raw?.LocalizedDescriptions as TDict) || {'RU-RU': undefined})['RU-RU'] || raw?.LocalizationDescriptionVariable,
                                srcData: raw,
                            }
                        }))
                        console.log(' - Done')
                    } catch (e: unknown) {
                        console.error(' - Seeding error!')
                        throw e
                    }
                }
            }
        }
    }

    /**
     * This method will be invoked when the application stops.
     */
    async stop(): Promise<void> {
        // Add your logic for stop
    }
}
