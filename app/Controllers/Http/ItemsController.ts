// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Item from "App/Models/Item";

export default class ItemsController {
    public async index() {
        return await Item.all()
    }
}
