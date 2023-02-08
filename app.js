const fastify = require('fastify')({ logger: true });
const harperive = require('harperive');
require('dotenv').config()

const DB_CONFIG = {
  harperHost: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
}

fastify.register(require('fastify-supabase'), {
  supabaseKey: process.env.SUPABASE_KEY,
  supabaseUrl: process.env.SUPABASE_URL
})



const Client = harperive.Client;
const client = new Client(DB_CONFIG);

fastify.get('/migrate', async (request, reply) => {
   
  const { supabase } = fastify

  const { data, error } = await supabase.from('bio').select('*')


  try {
    const uploadBio = await client.insert({
        table: 'bio',
        records: data,
        
    })
    console.log("transferred info", uploadBio)
    
  }catch (error){
    console.log("an error occured", error)
  }
  return { data, error }
})



fastify.listen({port: 3000}, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})