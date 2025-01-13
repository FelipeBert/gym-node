import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should hash user password upon registration', async () => {
        const {user} = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: 'password'
        })

        const isPasswordHashed = await compare(
            'password',
            user.password_hash
        )

        expect(isPasswordHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
        const email = 'johndoe@test.com'

        await sut.execute({
            name: 'John Doe',
            email,
            password: 'password'
        })

        await expect(() => {
            return sut.execute({
                name: 'John Doe',
                email,
                password: 'password'
             })
            },
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })

    it('should be able to register', async () => {
        const {user} = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@test.com',
            password: 'password'
        })
        expect(user.id).toEqual(expect.any(String))
    })
})