import carts from "../models/carts.js"

export const get = async (req, res)=> {
    try {
        const {user} = req
        const cart = await carts.findOne({user_id:user.id})
        if (!cart) {
            return res.status(404).json({message: "No cart was found"})
        }
        res.status(200).json({data: cart})
    } catch (error) {
        res.status(400).json({message: "Connot get cart"})
    }
}

export const addItem = async (req, res)=> {
    try {
        const {user} = req
        let cart = await carts.findOne({user_id:user.id})
        if (!cart) {
            cart = await carts.create({user_id:user.id})
        }
        cart.items.push(req.body)
        await cart.save()
        // TODO: handle duplications
        res.status(201).json({data: cart})
    } catch (error) {
        res.status(400).json({message: "Connot get carts", error:error.message})
    }
}

export const delItem = async (req, res)=> {
    try {
        const {user} = req
        let cart = await carts.findOne({user_id:user.id})
        if (!cart) {
            throw new Error()
        }
        cart.items = cart.items.filter(item => item.service_id!=req.body.service_id)
        await cart.save()
        // TODO: handle duplications
        res.status(201).json({data: cart})
    } catch (error) {
        res.status(400).json({message: "Connot get carts"})
    }
}