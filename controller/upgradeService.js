import UpgradeService from "../models/upgradeService.js";

// create upgrade
export const createUpgradeService = async (req, res) => {
    const { title, price, deliveryTime, serviceId } = req.body;

    try {
        const newUpgradeService = new UpgradeService({
            title,
            price,
            deliveryTime,
            serviceId
        });

        await newUpgradeService.save();

        res.status(201).json({ message: "Upgrade Service created successfully", newUpgradeService });
    } catch (err) {
        res.status(500).json({ message: "Server failed to create Upgrade Service" });
    }
};

// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// get upgrade by id
export const getUpgradeServiceById = async (req, res) => {
    const { serviceId, upgradeId } = req.params;
    try {
        const upgradeService = await UpgradeService.findById(upgradeId);

        if (!upgradeService || upgradeService.serviceId != serviceId) {
            return res.status(404).json({ message: "Upgrade Service not found" });
        }

        res.status(200).json({ message: "Upgrade Service found successfully", upgradeService });
    } catch (err) {
        res.status(500).json({ message: "Server failed to get Upgrade Service" });
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// get all service upgrades
export const getAllServiceUpgrades = async (req, res) => {
    const { serviceId } = req.params;

    try {
        const upgrades = await UpgradeService.find({ serviceId: serviceId }).select('-serviceId');
        if (!upgrades) {
            return res.status(404).json({ message: "No upgrades found" });
        }
        res.status(200).json({ message: "All upgrades found successfully", upgrades });
    } catch (err) {
        res.status(500).json({ message: "Server failed to get all upgrades" });
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// update upgrade
export const updateUpgrade = async (req, res) => {
    const { upgradeId } = req.params;
    const { title, price, deliveryTime } = req.body;
    try {
        const upgradeService = await UpgradeService.findByIdAndUpdate(upgradeId,
            {
                $set: {
                    title,
                    price,
                    deliveryTime
                }
            },
            { new: true }
        )

        if (!upgradeService) {
            return res.status(404).json({ message: "Upgrade Service not found" });
        }
        res.status(200).json({ message: "Upgrade Service updated successfully", upgradeService });
    } catch (err) {
        res.status(500).json({ message: "Server failed to update Upgrade Service" });
    }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// delete upgrade
export const deleteUpgrade = async (req, res) => {
    const { upgradeId } = req.params;
    try {
        const upgradeDeleted = await UpgradeService.findByIdAndDelete(upgradeId);
        if (!upgradeDeleted) {
            return res.status(404).json({ message: "Upgrade Service not found" });
        }

        res.status(200).json({ message: "Upgrade Service deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server failed to delete Upgrade Service" });
    }
}
