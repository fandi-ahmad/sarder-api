import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
    public async register({request, response}:HttpContextContract) {
        const validation = schema.create({
            email: schema.string([
                rules.email(),
                rules.unique({
                    table: 'users',
                    column: 'email'
                })
            ]),
            password: schema.string([
                rules.confirmed(),
                rules.minLength(4)
            ])
            
        })
        const data = request.validate({schema:validation})
        const user = await User.create({
            email: (await data).email,
            password: (await data).password
        })
        return response.created(user)
    }

    public async login({request, auth}:HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
        const token = await auth.attempt(email, password)

        return token.toJSON()
    }
}
