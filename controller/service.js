import Service from "../models/service.js";
import UpgradeService from "../models/upgradeService.js";
import categoriesModel from '../models/categories.js';
import SubCategories from '../models/subCategories.js';
import { io } from "../index.js";
import users from "../models/users.js";
import socketService from "../services/socketService.js";

// create service
export const createService = async (req, res) => {
    const userId = req.user.id;
    
    const {
        title,
        description,
        BuyerRules,
        categoryId,
        subcategoryId,
        price,
        keywords,
        deliveryTime
    } = req.body;

    let imagesFiles = [];
    if (req.files && req.files.images) {
        imagesFiles = req.files.images.map(file => file.path.replace(/\\/g, '/'));
    }

    try {
        const checkCategory = await categoriesModel.findById(categoryId)
        const checkSubCategorie= await SubCategories.findById(subcategoryId)
        if (!checkCategory || !checkSubCategorie) {
            return res.status(400).json({ message: "Category and Subcategory are required correctly" });
        }

        const newService = new Service({
            userId,
            title,
            description,
            category: categoryId,
            subcategory: subcategoryId,
            BuyerRules,
            price,
            images: imagesFiles,
            keywords,
            status: 'waiting',
            deliveryTime
        });
        const serviceUser = await users.findById(userId)
        const savedService = await newService.save();
        console.log(savedService,title)
        socketService.notifyAdmin(`${serviceUser.first_name.en?.toString()} added a new service: ${title.en}`)
        res.status(201).json({ message: "Service created successfully", savedService });
    } catch (err) {
        res.status(500).json({ message: "Server failed to create service", error: err.message });
    }
};


// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// filter data 
const createFilter = async (query) => {
    const filter = {};

    if (query.title) {
        const titleRegex = new RegExp(query.title, 'i');
        filter['$or'] = [
            { 'title.ar': { $regex: titleRegex } },
            { 'title.en': { $regex: titleRegex } }
        ];
    }

    if (query.categoryName) {
        const category = await categoriesModel.findOne({
            $or: [
                { 'name.ar': query.categoryName },
                { 'name.en': query.categoryName }
            ]
        });
        if (category) {
            filter.category = category._id;
        }
    }

    if (query.subcategoryName) {
        const subcategory = await SubCategories.findOne({
            $or: [
                { 'title.ar': query.subcategoryName },
                { 'title.en': query.subcategoryName }
            ]
        });
        if (subcategory) {
            filter.subcategory = subcategory._id;
        }
    }

    if (query.rating) {
        filter['serviceCard.totalRated'] = { $gte: query.rating };
    }

    return filter;
}

export const filterServices = async (req, res) => {
    try {
        const filter = await createFilter(req.query);

        const services = await Service.find(filter)
            .populate('category', 'name')
            .populate('subcategory', 'title')
            .populate('userId', ['profilePicture', 'username', '-_id'])
            .select('-status')

        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: "Server failed to filter services" });
    }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////// //
// get Users services
export const getUsersServices = async (req, res) => {
    try {
        const filter = await createFilter(req.query);
        filter.status = 'active'
        const services = await Service.find(filter)
            .populate('category', 'name')
            .populate('subcategory', 'title')
            .populate('userId', ['profilePicture', 'username', '-_id'])
            .select('-userId');

        res.status(200).json({ services });
    } catch (err) {
        res.status(500).json({ message: "Server failed to get services" });
    }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////// //
// get all services
export const getServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate('category', 'name')
            .populate('subcategory', 'title')
            .populate('userId', ['profilePicture', 'username']);
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: "Server failed to get services" });
    }
}


// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// get user services 
export const getUserServices = async (req, res) => {
    const { userId } = req.params;
    try {
        const service = await Service.find({userId:userId})
                        .populate('category', 'name')
                        .populate('subcategory', 'title')
                        .populate('userId', ['profilePicture', 'username', '-_id'])

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ service });
    } catch (err) {
        res.status(500).json({ message: "Server failed in service" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// get service by id
export const getServiceById = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const service = await Service.findById(serviceId)
                        .populate('category', 'name')
                        .populate('subcategory', 'title')
                        .populate('userId', ['profilePicture', 'username', '-_id'])

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ service });
    } catch (err) {
        res.status(500).json({ message: "Server failed in service" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// update service
export const updateService = async (req, res) => {
    const { serviceId } = req.params;
    const serviceData = { ...req.body };

    delete serviceData.status;

    let imagesFiles;
    if (req.file) {
        imagesFiles = req.file.path.map(file => file.path.replace(/\\/g, '/'))
    }else{
        imagesFiles = []
    }

    try {
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { $set: serviceData },
            { new: true }
        );

        res.status(200).json({ message: "Service updated successfully", updatedService });
    } catch (err) {
        res.status(500).json({ message: "Server failed to update service" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// Update service status
export const updateServiceStatus = async (req, res) => {
    const { serviceId } = req.params;
    const { status } = req.body; 

    try {
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { $set: { status } },
            { new: true } 
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.status(200).json({ message: "Service status updated successfully", updatedService });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server failed to update service status" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// delete service
export const deleteService = async (req, res) => {
    const { serviceId } = req.params;
    try {

        const upgradeService = await UpgradeService.find({ serviceId });
        if (upgradeService.length < 0) {
            await UpgradeService.deleteMany({ serviceId });
        }

        const serviceDeleted = await Service.findByIdAndDelete(serviceId);
        if (!serviceDeleted) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server failed to delete service" });
    }
}