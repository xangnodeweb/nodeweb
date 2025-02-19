const Pool = require("pg").Pool;
const buffer = require("buffer").Buffer;

exports.configpg = async (req, res) => {
    try {
        return new Pool({
            user: "postgres",
            password: "12345678",
            host: "172.28.17.243",
            port: "5432",
            database: "smsuser"
        });

    } catch (error) {
        console.log(error)
    }
}

exports.getuserbyusername = async (username) => {
    try {

        const pool = await this.configpg();
        const user = await pool.query('select * from smsuser where username=$1', [username]);
        if (user.rowCount > 0) {
            return user.rows;
        }
        return [];

    } catch (error) {
        console.log(error);
    }
}
exports.getuseroptionby = async (optionvalue, value) => {
    try {

        const pool = await this.configpg();
        const user = await pool.query(`select * from smsuser where ${optionvalue}`, [value]);
        if (user.rowCount > 0) {
            return user.rows;
        }
        return [];

    } catch (error) {
        console.log(error);
    }
}

exports.genaratepasswordhash = (value) => {
    try {

        const password = buffer.from(value).toString("base64");
        return password;
    } catch (error) {
        console.log(error);
    }
}

exports.showpassword = (value) => {
    try {

        const password = buffer.from(value, "base64").toString("ascii")
        return password;
    } catch (error) {
        console.log(error);
    }

}