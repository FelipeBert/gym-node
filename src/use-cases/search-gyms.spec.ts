import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gym'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'javascript gym',
            description: '',
            phone: '',
            latitude: -7.9587732,
            longitude: -34.9166711
        })

        await gymsRepository.create({
            title: 'typescript gym',
            description: '',
            phone: '',
            latitude: -7.9587732,
            longitude: -34.9166711
        })

        const { gyms } = await sut.execute({
            query: 'typescript',
            page: 1
        })
    
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({title: 'typescript gym'})
        ])
    })

     it('should be able to fetch paginated gyms search', async () => {
            for(let i = 1; i <= 22; i++){
                await gymsRepository.create({
                    title: `typescript gym ${i}`,
                    description: '',
                    phone: '',
                    latitude: -7.9587732,
                    longitude: -34.9166711
                })
            }
    
            const { gyms } = await sut.execute({
                query: 'typescript',
                page: 2
            })
        
            expect(gyms).toHaveLength(2)
            expect(gyms).toEqual([
                expect.objectContaining({title: 'typescript gym 21'}),
                expect.objectContaining({title: 'typescript gym 22'})
            ])
    })
})