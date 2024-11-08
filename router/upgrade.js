import express from 'express'
import { 
    createUpgradeService,
    deleteUpgrade,
    getAllServiceUpgrades, 
    getUpgradeServiceById, 
    updateUpgrade 
} from '../controller/upgradeService.js';
import { authenticateUser, checkRoles } from '../middleware/auth.js';

const router = express.Router();

// create upgrade
router.post('/:serviceId', authenticateUser, checkRoles('seller'), createUpgradeService);

// create upgrade
router.get('/:serviceId', getAllServiceUpgrades);

// create upgrade
router.get('/upgrade/:serviceId/:upgradeId', getUpgradeServiceById);

// update upgrade
router.patch('/:upgradeId', authenticateUser, checkRoles('seller'), updateUpgrade);

// delete upgrade
router.delete('/:upgradeId', authenticateUser, checkRoles('seller'), deleteUpgrade);

export default router;