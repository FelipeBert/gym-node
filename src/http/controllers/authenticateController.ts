import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentiasError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(request: FastifyRequest, reply: FastifyReply){
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try{
        const authenticateBodySchema = makeAuthenticateUseCase()

        const { user } = await authenticateBodySchema.execute({
            email, 
            password
        })

        const token = await reply.jwtSign({}, {
            sign: {
                sub: user.id
            }
        })

        return reply.status(200).send(token)
    } catch(err){
        if(err instanceof InvalidCredentiasError){
            return reply.status(400).send({message: err.message})
        }

        throw err
    }
}