const Database = require('./database');
class User_model{
    constructor(pool){
        this.pool = pool;
    }
    user_is_exist = async (email)=>{
        const query = `SELECT email FROM akun WHERE email = '${email}'`;
        const [result] = await this.pool.query(query);
        console.log(result.length >= 1);
        return (result.length >= 1);
    }
    user_validation = async (email, password) => {
      const query = `SELECT * FROM akun WHERE email = '${email}' AND password = '${password}'`;
      console.log(query);
      const [result] = await this.pool.query(query);
      if(result.length >= 1){
        const payload = {
          status:true,
          uid:result[0].hash
        }
        console.log(payload);
        return payload;
      }else{
        const payload = {
          status:false,
          uid:''
        }
        console.log(payload);
        return payload;
      }
    }
    user_register = async (email, password,hash) => {
      const already_exist = await this.user_is_exist(email,hash);
      if(already_exist){
        return false;
      }else{
        const query = `INSERT INTO akun (email, password, hash)
        VALUES ('${email}', '${password}','${hash}');`;
        const [result] = await this.pool.query(query);
        console.log(result);
        return true;
      }
    }
}
module.exports = User_model;