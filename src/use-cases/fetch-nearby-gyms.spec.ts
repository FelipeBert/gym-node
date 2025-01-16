import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near gym',
            description: '',
            phone: '',
            latitude: -7.9587732,
            longitude: -34.9166711
        })

        await gymsRepository.create({
            title: 'Far gym',
            description: '',
            phone: '',
            latitude: -8.071133,
            longitude: -34.8826821
        })

        const { gyms } = await sut.execute({
            userLatitude: -7.9587732,
            userLongitude: -34.9166711
        })
    
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'Near gym'})
        ])
    })
})