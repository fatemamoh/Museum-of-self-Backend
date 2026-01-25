const User = require('../models/user');

const verifyVault = async (req, res, next) => {
    try {
        const providedPin = req.headers['x-master-pin'];
        if (!providedPin) return res.status(403).json({ err: "MasterPIN required." });

        const user = await User.findById(req.user._id);
        const isMatch = await user.comparePin(providedPin);

        if (isMatch) {
            next();
        } else {
            res.status(401).json({ err: "Invalid MasterPIN." });
        }
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
};

module.exports = verifyVault;