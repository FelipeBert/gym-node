import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInRepository, gymsRepository)
        
        await gymsRepository.create({
            id: 'gym-01',
            title: 'Gym Node',
            description: '',
            phone: '',
            latitude: new Decimal(-7.9587732),
            longitude: new Decimal(-34.9166711)
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -7.9587732,
            userLongitude: -34.9166711
        })
    
        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 0, 12, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -7.9587732,
            userLongitude: -34.9166711
        })

        await expect(() => {
            return sut.execute({
                    gymId: 'gym-01',
                    userId: 'user-01',
                    userLatitude: -7.9587732,
                    userLongitude: -34.9166711
                })
            },
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice but in diferent days', async () => {
        vi.setSystemTime(new Date(2022, 0, 12, 8, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -7.9587732,
            userLongitude: -34.9166711
        })

        vi.setSystemTime(new Date(2022, 0, 13, 8, 0, 0))

        const { checkIn } = await sut.execute({
                    gymId: 'gym-01',
                    userId: 'user-01',
                    userLatitude: -7.9587732,
                    userLongitude: -34.9166711
                })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in to a distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'Gym Node',
            description: '',
            phone: '',
            latitude: new Decimal(-8.071133),
            longitude: new Decimal(-34.8826821)
        })

        await expect(() => {
            return sut.execute({
                    gymId: 'gym-02',
                    userId: 'user-01',
                    userLatitude: -7.9587732,
                    userLongitude: -34.9166711
                })
            },
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})