const { configpg } = require("./usermodule");
const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(400).json({ status: false, code: 4, message: "request headers authorization. not found" })
        }
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
            return res.status(400).json({ status: false, code: 3, message: "Unthorized login." });
        }  // then it error Unthorizaed login new login find not found id
        req.user = user.rows[0];

        next();

    } catch (error) {
        if (error) {
            const err = JSON.stringify(error);
            const errs = JSON.parse(err);
            console.log(errs)
            if (errs.code == "ETIMEDOUT") {
                return res.status(500).json({ status: false, code: 5    , message: "cannot connect database ConnectTimeout.", result: null });
            } else {
                return res.status(401).json({ status: false, code: 1, message: "unthorized login agian.", result: null });
            }
        }
    }
}

module.exports = auth;