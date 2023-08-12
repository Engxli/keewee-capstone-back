const { Expo } = require("expo-server-sdk");
let expo = new Expo();

const createMsgNotification = (pushToken, title, body, data) => {
    return {
        to: pushToken,
        sound: "default",
        title: title,
        body: body,
        data: data || { withSome: "data" },
    };
};

const sendNotificationMsgs = async (messages) => {
    console.log(messages);
    let chunks = expo.chunkPushNotifications(messages);

    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
            } catch (error) {
                console.error(error);
            }
        }
    })();
};

module.exports = { createMsgNotification, sendNotificationMsgs };