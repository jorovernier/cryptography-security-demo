const bcryptjs = require('bcryptjs')

let chats = []

module.exports = {
    createMessage: (req, res) => {
        const {pin, message} = req.body;

        for(let i = 0; i < chats.length; i++){
            const existingPin = bcryptjs.compareSync(pin, chats[i].pinHash);

            if(existingPin){
                chats[i].messages.push(message)
                let existingSecureMessage = {...chats[i]}
                delete existingSecureMessage.pinHash
                return res.status(200).send(existingSecureMessage)
            }
        }

        const salt = bcryptjs.genSaltSync(5)
        const pinHash = bcryptjs.hashSync(pin, salt)
        
        let msgObj = {
            pinHash,
            messages: [message]
        }

        chats.push(msgObj)
        let securedMessage = {...msgObj}
        delete securedMessage.pinHash
        res.status(200).send(securedMessage)
    }
}