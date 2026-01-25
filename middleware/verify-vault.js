const User = require('../models/user');
const bcrypt = require('bcrypt');

const verifyVault = async (req, res, next) => {
    try {
        const providedPin = req.headers['x-master-pin'];
        if (!providedPin) {
            return res.status(403).json({ err: "Access Denied: MasterPIN required." });
        }
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ err: "User not found." });

        const isMatch = await bcrypt.compare(providedPin, user.masterPin);

        if (isMatch) {
            next();
        } else {
            res.status(401).json({ err: "Invalid MasterPIN." });
        }
    } catch (error) {
        res.status(500).json({ err: "Security check failed." });
    }
};

module.exports = verifyVault;