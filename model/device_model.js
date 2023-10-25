class Device_model{
    constructor(pool){
        this.pool = pool;
    }
    add_device = async (payload) => {
        try {
          const query = `insert into nodes (type,name,topic,id,log_raw)
              values ('${payload.type}','${payload.name}','${payload.topic}','${payload.id}',0);`;
          const [result] = await this.pool.query(query);
          return 1;
        } catch (error) {
          return 0;
        }
      }
    
      get_devices = async () => {
        const query = `select * from nodes;`
        const [result] = await this.pool.query(query);
        return result;
      }
    
      get_topic_by_id = async (id) => {
        const query = `select topic from nodes where id = '${id}';`
        const [result] = await this.pool.query(query);
        return result;
      }
    
      update_device = async (payload) => {
        try {
          console.log({"payload":payload})
          const query = `UPDATE nodes
                         SET type = '${payload.type}', name = '${payload.name}', topic = '${payload.topic}' ,log_raw = '${payload.log_raw}'
                         WHERE id = '${payload.id}';`;
          const [result] = await this.pool.query(query);
          if (result.affectedRows > 0) {
            return 1; // Update was successful
          } else {
            return 0; // No rows were updated, possibly because the ID doesn't exist
          }
        } catch (error) {
          return 0; // An error occurred during the update
        }
      }
    
      delete_device = async (device_id) => {
        try {
          const query = `DELETE FROM nodes WHERE id = '${device_id}';`;
          const [result] = await this.pool.query(query);
          if (result.affectedRows > 0) {
            return 1; // Deletion was successful
          } else {
            return 0; // No rows were deleted, possibly because the ID doesn't exist
          }
        } catch (error) {
          return 0; // An error occurred during the deletion
        }
      }
}
module.exports = Device_model;