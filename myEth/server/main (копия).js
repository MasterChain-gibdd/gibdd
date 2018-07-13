import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  userBase = new Mongo.Collection("users");
  carBase = new Mongo.Collection("cars");
  myBcAddress = "0x8c0D8658d15c1943e293dE87248c38397B6D1745";
  if(userBase.find({bcAddress:myBcAddress}).fetch().length == 0){
    userBase.insert({bcAddress:myBcAddress, name:"admin", adminRights:true, staffRights:true});
  }
  // code to run on server at startup
});


/// ??? какие должны быть разделители здесь в фигурных скобках
Meteor.methods({
   addUser(getBc, getName){userBase.insert({bcAddress:getBc, name:getName, adminRights:false, staffRights:false});},
   findUser(getBc, getName){userBase.find({bcAddress:getBc, name:getName});},
   addCar(getBuyer, getVIN){carBase.insert({owner:getBuyer, VIN:getVIN, active:"да"});},
   findCar(searchDict){carBase.find(searchDict).fetch();}
   
   
})

