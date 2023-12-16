const mongoose=require('mongoose')
const redis=require('redis')
const util=require('util')

const redisurl='rediss://red-clu530da73kc7399rd00:9tXEI3LWO1bfOiEWCqYFSW0QXf9dhoJZ@oregon-redis.render.com:6379'
const client= redis.createClient(redisurl)


  //   client.hGet=util.promisify(client.hGet)
  //  client.hSet = util.promisify(client.hSet);
  //  client.del = util.promisify(client.del);
    // Check if the client has these methods before promisifying
   
    if (typeof client.hget === 'function' && typeof client.hget === 'function' && typeof client.del === 'function') {
     
     // console.error('function exist111');
      client.hGet = util.promisify(client.hget).bind(client);
      client.hSet = util.promisify(client.hset).bind(client);
       client.del = util.promisify(client.del).bind(client);
    } else {
      console.error('Error: Redis methods not found or invalid.');
    }

    const exec= mongoose.Query.prototype.exec;
    mongoose.Query.prototype.cache=function(options={}){
        this.useCache=true;
        this.hashkey=JSON.stringify(options.key||'default');
        return this;
    }
    mongoose.Query.prototype.exec =async function (){
       if(!this.useCache){
        return exec.apply(this,arguments)
       }
        const key=Object.assign({},this.getQuery(),{
            collection:this.mongooseCollection.name
        })
    
         const cachevalue=await client.hGet(this.hashkey.toString(),key.toString());
        
        if(cachevalue){
            console.log(cachevalue);
          const doc=  JSON.parse(cachevalue);
    
          return Array.isArray(doc)?doc.map(d=> new this.model(d)):new this.model(doc)
            
        }
        const result=await exec.apply(this,arguments);
       await client.hSet(this.hashkey.toString(), key.toString(), JSON.stringify(result), 'EX', 100000);
    
       
        
    }
    async function clearcache(hashkey) {
     await client.del(JSON.stringify(hashkey));
  }

 
module.exports.clearcache = clearcache;
  