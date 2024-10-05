import Service from "../models/service.js";
import UpgradeService from "../models/upgradeService.js";
import users from "../models/users.js";
import categoriesModel from '../models/categories.js';
import SubCategories from '../models/subCategories.js';

// create service
export const createService = async (req, res) => {
    const userId = req.user.id;

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
        if (!categoryId, !subcategoryId) {
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
        console.log('Filter used for querying services:', filter);

        const services = await Service.find(filter)
            .populate('category', 'name')
            .populate('subcategory', 'title')


        const result = await Promise.all(
            services.map(async (service) => {
                const user = await users.findById(service.userId).select('profile_picture_url');
                const serviceData = { ...service._doc };
                delete serviceData.userId;

                return {
                    ...serviceData,
                    authorImg: user?.profile_picture_url || ''
                };
            })
        );

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Server failed to filter services" });
    }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////// //
// get all services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate('category', 'name')
            .populate('subcategory', 'title')
            .select('-userId');

        res.status(200).json({ services });
    } catch (err) {
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
    } catch (err) {
        res.status(500).json({ message: "Server failed in service" });
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////// //
// update service
export const updateService = async (req, res) => {
    const { serviceId } = req.params;
    const serviceData = req.body;

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