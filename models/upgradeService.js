import mongoose from "mongoose";

const upgradeServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 5,
        required: true
    },
    deliveryTime: {
        type: Number,
        required:true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    }
},{
    timestamps: true
})

const UpgradeService = mongoose.model('upgradeService', upgradeServiceSchema);
export default UpgradeService;