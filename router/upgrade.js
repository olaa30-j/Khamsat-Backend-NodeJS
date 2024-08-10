import express from 'express'
import { 
    createUpgradeService,
    deleteUpgrade,
    getAllServiceUpgrades, 
    getUpgradeServiceById, 
    updateUpgrade 
} from '../controller/upgradeService.js';

const router = express.Router();

// create upgrade
router.post('/', createUpgradeService);

// create upgrade
router.get('/:serviceId', getAllServiceUpgrades);

// create upgrade
router.get('/upgrade/:serviceId/:upgradeId', getUpgradeServiceById);

// update upgrade
router.patch('/:upgradeId', updateUpgrade);

// delete upgrade
router.delete('/:upgradeId', deleteUpgrade);

export default router;