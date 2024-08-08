import orders from "../models/orders.js"

export const get = async (req, res)=> {

}

export const getِAll = async (req, res)=> {
    try {
        const result = await orders.find()
        if (!result) {
            return res.status(404).send({message: "No orders was found"})
        }
        res.status(200).send({data: result})
    } catch (error) {
        res.status(400).send({message: "Connot get orders"})
    }
}

export const create = async (req, res)=> {

}

export const update = async (req, res)=> {

}

export const del = async (req, res)=> {

}