const cron = require('node-cron');
const Memory = require('../models/memory');
const { sendUnlockNotification } = require('./emailService')

const initTimeCapsule = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const memoriesToUnlock = await Memory.find({
                unlockDate: { $lte: new Date() },
                notificationSent: false
            }).populate('user');

            for (const memory of memoriesToUnlock) {
                if (memory.user && memory.user.email) {
                    await sendUnlockNotification(memory.user.email, memory.user.username, memory.title);
                    memory.notificationSent = true;
                    await memory.save();
                }
            }
        } catch (error) {
            console.error(' Cron Job Error ', error);
        }
    });
};  

module.exports = initTimeCapsule;
