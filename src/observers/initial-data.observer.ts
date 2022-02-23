import {
    inject,
    /* inject, Application, CoreBindings, */
    lifeCycleObserver, // The decorator
    LifeCycleObserver, // The interface
} from '@loopback/core'
import {repository} from '@loopback/repository'
import {ZoneRepository} from '../repositories'
import axios from 'axios'
import {LoggingBindings, WinstonLogger} from '@loopback/logging'


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
    ): Promise<void> {
        console.log(`Init seeding...`)
        const countResult = await zoneRepo.count()

        if ((countResult?.count || 0) < 1) {
            console.log(`No zones found, request from broderickhyman...`)
            const zonesRaw = await axios.get('https://raw.githubusercontent.com/broderickhyman/ao-bin-dumps/master/formatted/world.json')
            if ((zonesRaw?.data || []).length > 0) {
                console.log(`Got ${zonesRaw.data.length}, saving...`)

                try {
                    await zoneRepo.createAll(zonesRaw.data.map((raw: TDict) => {
                        return {
                            id: raw.Index,
                            uniqueName: raw.UniqueName,
                        }
                    }))
                    console.log('Done')
                } catch (e: any) {
                    console.error('Seeding error!')
                    throw e
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
