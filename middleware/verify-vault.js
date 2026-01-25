const User = require('../models/user');

const verifyVault = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const providedPin = req.headers['x-master-pin'];
        next();
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

module.exports = verifyVault;