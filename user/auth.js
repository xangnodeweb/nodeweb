const { configpg } = require("./usermodule");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
    try {

        let token = req.headers.authorization.split(" ");
        if (token.length >= 2) {
            token = token[1];
        } else {
            token = token[0];
        }
        const pool = await configpg();

        const decode = jwt.verify(token, "SECRET_KEY_TEXT");
        const user = await pool.query('select * from smsuser where id=$1', [decode.id]);
        if (user.rowCount == 0) {
            return res.status(400).json({status : false , code : 3 , message : "Unthorized login."});
        }  // then it error Unthorizaed login new login find not found id
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, code: 1, message: "unthorized login agian.", result: null });
    }

}

module.exports = auth;