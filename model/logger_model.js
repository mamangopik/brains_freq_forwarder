class Logger_model{
    constructor(pool){
        this.pool = pool;
    }
    log_single_data = async (data) => {
        const meassurement_data = data.value;
        const timestamp_data = data.timestamp;
        const variable_name = data.label;
        const topic = data.topic;
        const query = `INSERT INTO single_data_log (value, topic, variable_name,timestamp)
                        VALUES (${parseFloat(meassurement_data)},'${topic}','${variable_name}',${timestamp_data}); `;
        const result = await this.pool.query(query);
        console.log('data logged');
        return 1;
      }

      get_nodes = async () => {
        const [result] = await this.pool.query("SELECT DISTINCT node_name FROM acc_data_log");
        return result;
      }
    
      get_acc = async (query) => {
        const [result] = await this.pool.query(query);
        return result;
      }
    
      node_data_len = async (node) => {
        const query = "SELECT count(*) FROM `acc_data_log` WHERE node_name = '" + node + "';";
        const result = await this.pool.query(query);
        return result[0][0]['count(*)'];
      }
    
      log_data = async (payload) => {
        const meassurement_data = JSON.stringify(payload.meassurement_data);
        const timestamp_data = JSON.stringify(payload.time_data);
        const query = `INSERT INTO data_log (unix_timestamp, json, node, time_data)
                         VALUES (${parseInt(payload.timestamp)},'${meassurement_data}','${payload.node}','${timestamp_data}'); `;
        // console.log(payload);
        const result = await this.pool.query(query);
        console.log('data logged');
        return 1;
      }
    
      read_data_bundle = async (node, unix, limit, offset) => {
        const query = `select * from data_log where node='${node}' and unix_timestamp>=${unix} limit ${limit} offset ${offset};`
        const [result] = await this.pool.query(query);
        return result;
      }
}
module.exports = Logger_model;