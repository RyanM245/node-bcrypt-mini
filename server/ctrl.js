const bcrypt = require('bcryptjs')

module.exports = {
    signup: async (req, res, next) => {
        const {email, password} = req.body;
        let db = req.app.get('db');
        let foundUser = await db.check_user_exists([email]);
        if(foundUser[0]){
            return res.status(409).send('User already exists')
        }
        let salt = bcrypt.genSaltSync(15);
        let hash = bcrypt.hashSync(password, salt);
        let createdUser = await db.create_user([email, hash])
        req.session.user = {
            id: createdUser[0].id,
            email: createdUser[0].email
        };
        res.status(200).send(req.session.user)

        // db.check_user_exists([email]).then(foundUser => {
        //     if (foundUser[0]){
        //         return res.status(409).send('User already exists')
        //     }else {
        //         let salt = bcrypt.genSaltSync(15);
        //         let hash = bcrypt.hashSync(password, salt);
        //         db.create_user([email, hash]).then( createdUser => {
        //         req.session.user = {
        //             id: createdUser[0].id,
        //             email: createdUser[0].email
        //         };
        //         res.status(200).send(req.session.user)
        //     }})
        // })
    },
    login: async (req, res) => {
        let {email, password} = req.body;
        let db = req.app.get('db');
        let foundUser = await db.check_user_exists([email]);
        if(!foundUser[0]){
            return res.status(401).send('Incorrect login information')
        }
        let result = bcrypt.compareSync(password, foundUser[0].user_password)
        if(result){
            req.session.user = {
                id: foundUser[0].id,
                email: foundUser[0].email
            }
            res.status(200).send(req.session.user);
        } else {
            return res.status(401).send('Incorrect login information')
        }
    },
    logout: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    }
}