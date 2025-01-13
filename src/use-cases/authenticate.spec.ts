import { expect, describe, it, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentiasError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'John doe',
            email: 'johndoe@test.com',
            password_hash: await bcrypt.hash('12345', 6)
        })

        const { user } = await sut.execute({
            email: 'johndoe@test.com',
            password: '12345',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() => {
                return sut.execute({
                    email: 'john doe',
                    password: 'password'
                })
            },
        ).rejects.toBeInstanceOf(InvalidCredentiasError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'John doe',
            email: 'johndoe@test.com',
            password_hash: await bcrypt.hash('12345', 6)
        })

        await expect(() => {
                return sut.execute({
                    email: 'john doe',
                    password: 'password'
                })
            },
        ).rejects.toBeInstanceOf(InvalidCredentiasError)
    })
})