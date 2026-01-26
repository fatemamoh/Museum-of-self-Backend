const cron = require('node-cron');
const Memory = require('../models/memory');
const { sendUnlockNotification } = require('./emailService');

const initTimeCapsule = () => {
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const memoriesToUnlock = await Memory.find({
                unlockDate: { $lte: now, $ne: null },
                notificationSent: false
            }).populate('user');

            if (memoriesToUnlock.length === 0) return;

            await Promise.allSettled(memoriesToUnlock.map(async (memory) => {
                if (memory.user && memory.user.email) {
                    try {
                        await sendUnlockNotification(
                            memory.user.email,
                            memory.user.username,
                            memory.title
                        );

                        memory.notificationSent = true;
                        await memory.save();

                    } catch (error) {
                        console.error(`❌ Failed to notify for memory ${memory._id}:`, error.message);
                    }
                }
            }));

        } catch (error) {
            console.error('❌ Critical Cron Job Error:', error);
        }
    });
};

module.exports = initTimeCapsule;