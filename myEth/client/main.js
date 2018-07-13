import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';


userBase = new Mongo.Collection("users");
carBase = new Mongo.Collection("cars");





Template.userAdder.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var getBc = event.target.bcAddress.value;
    var getName = event.target.Name.value;
    funcContract.taskfunc("addUser",web3.eth.accounts[0],getBc,getName,"", function(err, res){
      TemplateVar.set(template, "num", res);
    }); 
    Meteor.call('addUser',getBc, getName);
    console.log("user: " + getName);
    event.target.bcAddress.value = "";
    event.target.Name.value = "";
  }
});

Template.userAdder.helpers({
  'users':function(){
    return userBase.find({});
  }
})

Template.userSearcher.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var getBc = event.target.bcAddress.value;
    var getName = event.target.Name.value;
      funcContract.taskfunc("searchUser",web3.eth.accounts[0],getBc,getName,"", function(err, res){
    if(!err){
    var searchDict = {};
    if (getBc != ""){
      searchDict["bcAddress"] = getBc;
    }
    if (getName != ""){
      searchDict["name"] = getName;
    }
    requestResult = userBase.find(searchDict).fetch()
    document.getElementById("p3").innerHTML = "";
    for (let value of requestResult) {
      document.getElementById("p3").innerHTML += "<p>Address: " + value.bcAddress + " Name: " + value.name + "</p>";
    }
    Meteor.call('findUser', getBc, getName);
    console.log("user: " + getName);
  
}
    event.target.bcAddress.value = "";
    event.target.Name.value = "";
  });
  }
});

Template.rightsGiver.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var _address = event.target.bChainAddress.value;
    var _user = web3.eth.accounts[0];
    if(userBase.find({bcAddress:_user}).fetch().length >0){
    if(userBase.find({bcAddress:_user}).fetch()[0].adminRights == true){
      if(userBase.find({bcAddress:_address}).fetch().length != 0){
        userBase.find({bcAddress:_address}).fetch()[0].adminRights = true;
    }
  }
}else{
  console.log("No such user in base");
}
    console.log("user: " + _address);
    event.target.bChainAddress.value = "";
  }
});

Template.addCar.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var getBuyer = event.target.buyerAddress.value;
    var getVIN = event.target.carVIN.value;
    funcContract.taskfunc("addCar",web3.eth.accounts[0],getBuyer,getVIN,"", function(err, res){
      if(!err){
    Meteor.call('addCar',getBuyer,getVIN);
    console.log("owner " + getBuyer + " VIN " + getVIN);
      }    
    });
    event.target.buyerAddress.value = "";
    event.target.carVIN.value = "";
  }
});

Template.addCar.helpers({
  'cars':function(){
    return carBase.find({});
  }
})



Template.searchCarHistory.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var getVIN = event.target.carVIN.value;
      
    var searchDict = {};
    if (getVIN != ""){
      searchDict["VIN"] = getVIN;
    }
    funcContract.taskfunc("searchCarHistory",web3.eth.accounts[0],"",getVIN,"", function(err, res){
      if(!err){
    requestResult = carBase.find(searchDict).fetch()
    if(requestResult == undefined){
      console.log('No data by request');
      return;
    }
    document.getElementById("p4").innerHTML = "";
    for (let value of requestResult) {
      document.getElementById("p4").innerHTML += "<p><b>ПТС</b>: " + value.VIN + "<b> Владелец</b>: " + value.owner + "</p>";
    }
  }
});
    console.log("car: " + getVIN);
  

    event.target.carVIN.value = "";
  
  }
});

Template.modifyCarOwner.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var getVIN = event.target.carVIN.value;
    var getnew = event.target.new.value;
    var getold = event.target.old.value;
    var searchDict = {};
    if (getVIN != ""){
      searchDict["VIN"] = getVIN;
    }
    searchDict["active"] = "да";
    funcContract.taskfunc("modifyCarOwner",web3.eth.accounts[0],getold,getVIN,getnew, function(err, res){
      if(!err){
    requestResult = carBase.find(searchDict).fetch();
    if (requestResult!=undefined){
      carBase.update(requestResult[0]._id,
        { $set: { active: "нет" } 
      });
      requestResult[0].owner = getnew;
      carBase.insert({owner:requestResult[0].owner, active:"да", VIN:requestResult[0].VIN});
    console.log("car: " + getVIN);
    
  } else{
    console.log("NO SUCH PTS");
  }
}
    });

    event.target.carVIN.value = "";
  
  }
});




const cABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "funcname",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "user",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "arg1",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "arg2",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "arg3",
				"type": "string"
			}
		],
		"name": "task",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "funcname",
				"type": "string"
			},
			{
				"name": "user",
				"type": "string"
			},
			{
				"name": "arg1",
				"type": "string"
			},
			{
				"name": "arg2",
				"type": "string"
			},
			{
				"name": "arg3",
				"type": "string"
			}
		],
		"name": "taskfunc",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const cAddress = "0xdf41cf15cec8bd811e39fd66482bb057141c6ba2";

const funcContract = web3.eth.contract(cABI).at(cAddress);