import collections from "../models/collections.js"

export const get = async (req, res)=> {

}

export const getِAll = async (req, res)=> {
    try {
        const result = await collections.find()
        if (!result) {
            return res.status(404).send({message: "No collections was found"})
        }
        res.status(200).send({data: result})
    } catch (error) {
        res.status(400).send({message: "Connot get collections"})
    }
}

export const create = async (req, res)=> {

}

export const update = async (req, res)=> {

}

export const del = async (req, res)=> {

}