import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async () => {
        const {gym} = await sut.execute({
           title: 'JavaScript gym',
           description: '',
           phone: '',
           latitude: -7.9587732,
           longitude: -34.9166711
        })

        expect(gym.id).toEqual(expect.any(String))
    })

})