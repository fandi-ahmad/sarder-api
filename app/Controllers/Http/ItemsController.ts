import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Item from "App/Models/Item";

export default class ItemsController {
    public async index({request}) {
        const page = request.input('page', 1)   // angka di parameter kedua adalah value default jika parameter kosong
        const limit = request.input('limit', 0)
        return Item.query().paginate(page, limit)
    }

    public async getById({params}) {
        const item = await Item.find(params.id)
        return item?.serialize()
    }

    public async create({request, response}:HttpContextContract) {
        const inputData = (param) => {
            return request.input(param)
        }
        Item.create({
            item_name: inputData('item_name'),
            price: inputData('price'),
            image: inputData('image'),
            description: inputData('description'),
        })
        return response.created({
            'created': true
        })
    }

    public async update({request, response, params}:HttpContextContract) {
        const item = await Item.findOrFail(params.id)
        item.item_name = request.input('item_name')
        item.price = request.input('price')
        item.image = request.input('image')
        item.description = request.input('description')
        item.save()
        return response.status(202).send(item)
    }

    public async delete ({params}) {
        const deleteItem = await Item.findOrFail(params.id)
        await deleteItem.delete()
        return deleteItem
    }
}
