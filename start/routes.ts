/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {

  Route.group(() => {
    Route.get('/item', 'ItemsController.index')
    Route.get('/item/:id', 'ItemsController.getById')
    Route.get('/item/image/:id', 'ItemsController.getImage')
    Route.post('/item', 'ItemsController.create')
    Route.patch('/item/:id', 'ItemsController.update')
    Route.delete('/item/:id', 'ItemsController.delete')
  }).middleware('auth')

  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
}).prefix('api')
