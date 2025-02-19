import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-In Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able validate the check-in', async () => {
        const createdCheckIn = await checkInRepository.create({
            gymId: 'gym-01',
            user_id: 'user-01'
        })
        
        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })
    
        expect(checkIn.validate_at).toEqual(expect.any(Date))
        expect(checkInRepository.items[0].validate_at).toEqual(expect.any(Date))
    })

    it('should not be able validate an inexistent check-in', async () => {    
        await expect(
                sut.execute({
                checkInId: 'inexistent id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able validate the check-in after 20 minutes of its creation', async () => {    
        vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

        const createdCheckIn = await checkInRepository.create({
            gymId: 'gym-01',
            user_id: 'user-01'
        })
        
        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(sut.execute({
                checkInId: createdCheckIn.id
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError)
    })

})