const { graphql, buildSchema } = require('graphql')

const model = require('./model') //Database

let DB
model.getDB().then(db => {DB=db})

const sse  = require('./utils/notifications') //Notifications
sse.start()

const schema = buildSchema(`
  type Query {
    getApps:[App]
    getApp(level:Int!):[String]
    getStatistics:[AppTracing]
  }
  type Mutation {
    insert(codApp:Int!,name:String!):App
    update(hoursUse:Int!,codApp:Int!):App
    delete(codApp:Int!):String
  }

  type App{
    codApp: Int
    name: String
    downloadDate: String
    hoursUse: Int
  }

  type AppLevel{
    codApp: Int
    level: Int
  }

  type AppTracing{
    codApp: Int
    hoursUse: Int
    restrictions: String
  }
`)

const rootValue = {
  getApps : () => DB.objects('App'),
  getApp : ({ level }) => {
    return DB.objects('AppLevel').filter(x => x.level == level);
  },
  getStatistics : () => DB.objects('AppTracing'),
  insert : ({ codApp, name }) => {
    cApp = DB.objectForPrimaryKey('App', codApp)

    if(cApp == null){
      app = {
        codApp: codApp,
        name: name,
        downloadDate: '14/03/2022',
        hoursUse: 0
      }
      console.log(app)
      DB.write( () => DB.create('App', app) )
    }
    return app
  }, 
  update: ({ codApp, hoursUse }) => {
    cApp = DB.objectForPrimaryKey('App', codApp)
    
    DB.write( () => {
      cApp.hoursUse = hoursUse
    })

    return app
  },
  delete: ({ codApp }) => {
    cApp = DB.objectForPrimaryKey('App', codApp)

    if(cApp != null)
     DB.write( () => DB.delete('codApp', cApp) )

    return "Se ha eliminado correctamente la app " + codApp;
  }
}


exports.root   = rootValue
exports.schema = schema
exports.sse    = sse
