import { expect, describe, it, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to get user profile', async () => {
            const createdUser  = await usersRepository.create({
                name: 'John doe',
                email: 'johndoe@test.com',
                password_hash: await bcrypt.hash('12345', 6)
            })
    
            const { user } = await sut.execute({
                userId: createdUser.id,
            })
    
            expect(user.id).toEqual(expect.any(String))
            expect(user.name).toEqual('John doe')
    })

    it('should not be able to get user profile with wrong id', async () => {
        await expect(() => {
            return sut.execute({
                    userId: 'non-existing-id',
                })
            },
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    }) 
})