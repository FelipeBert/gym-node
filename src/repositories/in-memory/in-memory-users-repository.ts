import { User, Prisma } from "@prisma/client";
import type { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements UsersRepository{
    public items: User[] = []

    async findById(id: string){
        const user = this.items.find(item => {return item.id == id})

        if(!user){
            return null
        }

        return user
    }

    async findByEmail(email: string){
        const user = this.items.find(item => {return item.email == email})

        if(!user){
            return null
        }

        return user
    }

    async create(data: Prisma.UserCreateInput) {
        const user =  {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: data.created_at
        }

        this.items.push(user)

        return user
    }
}