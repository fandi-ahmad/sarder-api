import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import fs from 'fs'
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

    public async getImage({ response, params }: HttpContextContract) {
        const item = await Item.findOrFail(params.id)
        const imagePath = Application.makePath('public/uploads', item.image)
    
        return response.download(imagePath)
    }

    public async create({request, response}:HttpContextContract) {
        const name = request.input('item_name')
        const price = request.input('price')
        const description = request.input('description')

        const image = request.file('image', {
            size: '10mb',
            extnames: ['jpg', 'jpeg', 'png'],
        })
    
        // validate file upload
        if (!image) {
            return response.badRequest('Please select an image to upload')
        }

        // generate unique filename for uploaded image
        const uniqueName = `${Date.now()}_${image.clientName}`
        const filename = `${uniqueName.replace(/ /g,"_")}`

        await image.move(Application.publicPath('uploads'), {
            name: filename,
            overwrite: true,
        })

        // create new item in database
        await Item.create({
            item_name: name,
            price: price,
            image: filename,
            description: description,
        })

        return response.created({
            created: true,
        })
    }

    public async update({request, response, params}:HttpContextContract) {
        const item = await Item.findOrFail(params.id)
        const name = request.input('item_name')
        const price = request.input('price')
        const description = request.input('description')
      
        // Check if a new file has been uploaded
        const image = request.file('image', {
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png'],
        })
      
        if (image) {
            // Validate file upload
            if (!image.isValid) {
                return response.badRequest('Please select a valid image to upload')
            }
        
            // Delete old image file
            const oldImage = item.image
            if (oldImage) {
                const oldImagePath = Application.publicPath(`uploads/${oldImage}`)
                if (await fs.existsSync(oldImagePath)) {
                    await fs.unlinkSync(oldImagePath)
                }
            }
        
            // Generate unique filename for uploaded image
            const uniqueName = `${Date.now()}_${image.clientName}`
            const filename = `${uniqueName.replace(/ /g,"_")}`
            await image.move(Application.publicPath('uploads'), {
                name: filename,
                overwrite: true,
            })
        
            // Update item with new image file name
            item.image = filename
        }
        
        // Update item details
        item.item_name = name
        item.price = price
        item.description = description
        await item.save()
    
        return response.status(202).send(item)
    }
      
    public async delete ({params}) {
        const deleteItem = await Item.findOrFail(params.id)

        // hapus file gambar terkait item yang akan dihapus
        const imagePath = Application.publicPath('uploads') + '/' + deleteItem.image
        fs.unlinkSync(imagePath)
        
        await deleteItem.delete()
        return deleteItem
    }
}
