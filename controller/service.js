import Service from "../models/service.js";
import UpgradeService from "../models/upgradeService.js";

// create service
export const createService = async (req, res) => {
    const { userId } =  req.params;
    
    const {
        title,
        description,
        categoryId,
        subcategoryId,
        price,
        images,
        keywords,
        deliveryTime
    } = req.body;

    try {
        if(!categoryId, !subcategoryId){
            return res.status(400).json({ message: "Category and Subcategory are required" });
        }

        const newService = new Service({
            userId,
            title,
            description,
            category: categoryId,
            subcategory: subcategoryId,
            price,
            images,
            keywords,
            deliveryTime
        });

        const savedService = await newService.save();
        res.status(201).json({ message: "Service created successfully", savedService });
    } catch (err) {
        res.status(500).json({ message: "Server failed to create service" });
    }
};

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// get all services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().select('-userId');

        res.status(200).json({ services });
    }catch(err){
        res.status(500).json({ message: "Server failed to get services" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// get service by id
export const getServiceById = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ service });
    }catch(err){
        res.status(500).json({ message: "Server failed in service" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// update service
export const updateService = async (req, res) => {
    const { serviceId } = req.params;
    const serviceData  = req.body;

    try{
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { $set: serviceData },
            { new: true }
        );

        res.status(200).json({ message: "Service updated successfully", updatedService });
    }catch(err){
        res.status(500).json({ message: "Server failed to update service" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// delete service
export const deleteService = async (req, res) => {
    const { serviceId } = req.params;
    try{

        const upgradeService = await UpgradeService.find({serviceId});
        if(upgradeService.length < 0){
            await UpgradeService.deleteMany({ serviceId });
        }

        const serviceDeleted = await Service.findByIdAndDelete(serviceId);
        if(!serviceDeleted){
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted successfully" });
    }catch(err){
        res.status(500).json({ message: "Server failed to delete service" });
    }
}