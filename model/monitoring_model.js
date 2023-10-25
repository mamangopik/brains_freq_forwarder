const Database = require('./database');
class Monitoring_model{
    constructor(pool){
        this.pool = pool;
    }

    set_config = async (payload) => {
        const query = `insert into moitoring_config (cloud_addr,token,log_interval,sampling_duration,freq_thres,acc_thres)
              values ('${payload.addr}','${payload.token}',${payload.log_interval},${payload.sampling_duration},${payload.freq_thres},${payload.acc_thres});`;
        const [result] = await this.pool.query(query);
    }

    updateConfig = async (updatedData) => {
        const query = `UPDATE monitoring_config 
                      SET cloud_addr = '${updatedData.cloud_address}', 
                          token = '${updatedData.token}', 
                          log_interval = ${updatedData.log_interval}, 
                          sampling_duration = ${updatedData.sampling_duration}, 
                          freq_thres = ${updatedData.freq_thres}, 
                          acc_thres = ${updatedData.acc_thres} 
                      WHERE id = 0;`;
        
        const [result] = await this.pool.query(query);
    }

    deleteConfig = async (id) => {
        const query = `DELETE FROM monitoring_config WHERE id = ${id};`;
        const [result] = await this.pool.query(query);
    }

    getConfig = async () => {
        const query = `SELECT * FROM monitoring_config WHERE id = 0;`;
        const [result] = await this.pool.query(query);
        return result[0]; // Assuming it returns a single record
    }  
    
}
module.exports = Monitoring_model;