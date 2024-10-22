import express from 'express'
import { 
    createUpgradeService,
    deleteUpgrade,
    getAllServiceUpgrades, 
    getUpgradeServiceById, 
    updateUpgrade 
} from '../controller/upgradeService.js';
import { checkRoles, verfiyToken } from '../middleware/auth.js';

const router = express.Router();

// create upgrade
router.post('/', createUpgradeService);

// create upgrade
router.get('/:serviceId', getAllServiceUpgrades);

// create upgrade
router.get('/upgrade/:serviceId/:upgradeId', getUpgradeServiceById);

// update upgrade
router.patch('/:upgradeId', verfiyToken, checkRoles('seller'), updateUpgrade);

// delete upgrade
router.delete('/:upgradeId', verfiyToken, checkRoles('seller'), deleteUpgrade);

export default router;