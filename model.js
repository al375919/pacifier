const Realm = require('realm')
const ObjectId = require('bson-objectid')

const app = new Realm.App({ id: "application-0-ghmwt"})

let AppSchema = {
	name: 'App',
  primaryKey: '_id',
	properties: {
      _id: 'objectId',
      _partition: 'string',
      codApp: 'int',
      name: 'string',
      downloadDate: 'string',
      hoursUse: 'int'
  }
}

let AppLevelSchema = {
    name: 'AppLevel',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      codApp: 'int',
      level: 'int'
  }
}

let AppTracingSchema = {
    name: 'AppTracing',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      codApp: 'int',
      hoursUse: 'int',
      restrictions: 'string'
  }
}

let ElementsSchema = {
    name: 'Elements',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      codEl: 'int',
      listElementsOFF: 'string[]'
  }
}

let AlertsSchema = {
    name: 'Alerts',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      codAl: 'int',
      listAlerts: 'string[]'
  }
}

let PosSchema = {
    name: 'Pos',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      _partition: 'string',
      codPos: 'int',
      x: 'int',
      y: 'int',
      localitation: 'string'
    }
}

// // // MODULE EXPORTS

const myPartitionKey = "PacifierDigitalApps"

let sync = { user: app.currentUser, partitionValue: myPartitionKey }

let config = {path: './data/apps.realm', sync: sync, schema: [AppSchema, AppLevelSchema, AppTracingSchema, AlertsSchema, ElementsSchema, PosSchema]}

// exports.getDB = async () => await Realm.open(config)

exports.getDB = async () => {
    await app.logIn(new Realm.Credentials.anonymous())
    return await Realm.open(config)
}

exports.partitionKey = myPartitionKey

exports.app = app

// // // // // 

if (process.argv[1] == __filename){ //TESTING PART

  if (process.argv.includes("--create")){ //crear la BD

      Realm.deleteFile({path: './data/apps.realm'}) //borramos base de datos si existe

      app.logIn(new Realm.Credentials.anonymous()).then(() => {// puede que sea desde aqui?++++++++++++++++++++++

      let DB = new Realm({
        path: './data/apps.realm',
        sync:sync,
        schema: [AppSchema, AppLevelSchema, AppTracingSchema, AlertsSchema, ElementsSchema, PosSchema]
      })
     
      DB.write(() => {
        let app = DB.create('App', {
                                    _id: ObjectId(),
                                    _partition: myPartitionKey,                          
                                    codApp: 1,
                                    name: 'Instagram', 
                                    downloadDate: '01/01/2020', 
                                    hoursUse: 20})
        
        let appLevel = DB.create('AppLevel', {
                                              _id: ObjectId(),
                                              _partition: myPartitionKey,   
                                              codApp: 1, 
                                              level: 10})
        
        let appTracing = DB.create('AppTracing', {
                                                  _id: ObjectId(),
                                                  _partition: myPartitionKey,   
                                                  codApp: 1,
                                                  hoursUse: 20,
                                                  restrictions: 'Limitación días pares'})
        
        let alerts = DB.create('Alerts', {
                                        _id: ObjectId(),
                                        _partition: myPartitionKey,   
                                        codAl: 1,
                                        listAlerts: ['Aceleración de corazón']})

        let elements = DB.create('Elements', {
                                              _id: ObjectId(),
                                              _partition: myPartitionKey,   
                                              codEl: 1,
                                              listElementsOFF: ['Notificación']})

        let pos = DB.create('Pos', {
                                    _id: ObjectId(),
                                    _partition: myPartitionKey,   
                                    codPos: 1,
                                    x: 5,
                                    y: 10,
                                    localitation: 'Trabajo'})

        console.log('Inserted objects', app, appLevel, appTracing, alerts, elements, pos)
      })
      DB.close()
    })
    .catch(err => console.log(err))
  }
  else { //consultar la BD

      Realm.open({ path: './data/apps.realm' , sync: sync, schema: [AppSchema, AppLevelSchema, AppTracingSchema, AlertsSchema, ElementsSchema, PosSchema] }).then(DB => {
        let apps = DB.objects('App')
        apps.forEach(x => console.log(x.name))
        
        let app = DB.objectForPrimaryKey('codApp', 1)
        if (app)
           console.log(app.name)

        let appLevel = DB.objectForPrimaryKey('codApp', 1)
        if (appLevel)
          console.log(app.level)

        let appTracing = DB.objectForPrimaryKey('codApp', 1)
        if (appTracing)
          console.log(app.hoursUse)

        let elements = DB.objectForPrimaryKey('codEl', 1)
        if (elements)
          console.log(app.listElementsOFF)

        let alerts = DB.objectForPrimaryKey('codAl', 1)
        if (alerts)
          console.log(app.listAlerts)

        let pos = DB.objectForPrimaryKey('codPos', 1)
        if (pos)
          console.log(app.localitation)
        DB.close()
      })
  }
  
}
