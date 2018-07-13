import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

Template.info.onCreated(function() {
  var template = this;
  web3.eth.getAccounts(function(err, res){
      TemplateVar.set(template, "account", res[0]);
      web3.eth.getBalance(res[0], function(err, res){
        TemplateVar.set(template, "balance", res)
    });
  });
  myContract.num(function (err, res) {
    TemplateVar.set(template, "num", res);
  });
});

Template.info.events({
  'click button'(event, instance) {
    let template = Template.instance();
    // syncFunc = Meteor._wrapAsync(myContract.bet);
    // res = syncFunc();
    // console.log(res);
    myContract.bet(function(err, res) {
      alert(res);
    })
  }
})

/*emp = new Meteor.Collection("Employees");
Template.form.events({
  'submit #insert-form':function(e,t){
    e.preventDefault();
    var name = t.find('#name').value;
    var salary = t.find('#salary').value;
    emp.insert({name:name, salary:salary});
  }
}
)*/

testBase = new Mongo.Collection("testBase");
userBase = new Mongo.Collection("users");
carBase = new Mongo.Collection("cars");

Template.myTemplate.events({

  'submit form': function(event) {
     event.preventDefault();
     var textValue = event.target.myForm.value;
     testBase.insert({data:textValue});
     console.log(textValue);
     event.target.myForm.value = "";
  }
});

Template.myTemplate.helpers({
  'records':function(){
    return testBase.find({});
  }
})



Template.userAdder.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var getBc = event.target.bcAddress.value;
    var getName = event.target.Name.value;
    addUserContract.addUser("lolo",getBc,getName, function (err, res) {
      TemplateVar.set(template, "num", res);
    }); 
    userBase.insert({bcAddress:getBc, name:getName, adminRights:false, staffRights:false});
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
    addUserContract.addUser("lolo",getBc,getName, function (err, res) {
      
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
    //userBase.find({bcAddress:getBc, name:getName});
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
    carBase.insert({owner:getBuyer, VIN:getVIN, active:true});
    console.log("owner " + getBuyer + " VIN " + getVIN);
    event.target.buyerAddress.value = "";
    event.target.carVIN.value = "";
  }
});


Template.searchCarHistory.events({
  'submit form': function(event, template) {
    event.preventDefault();
    var getVIN = event.target.carVIN.value;
      
    var searchDict = {};
    if (getVIN != ""){
      searchDict["VIN"] = getVIN;
    }
    requestResult = carBase.find(searchDict).fetch()
    document.getElementById("p4").innerHTML = "";
    for (let value of requestResult) {
      document.getElementById("p4").innerHTML += "<p>Address: " + value.VIN + " Name: " + value.owner + "</p>";
    } 
    //userBase.find({bcAddress:getBc, name:getName});
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
    requestResult = carBase.find(searchDict).fetch();
    if (requestResult.length != 0){
      carBase.update(requestResult[0]._id,
        { $set: { active: false } });
      requestResult[0]._id = new mongoose.Types.ObjectId();
      requestResult[0].owner = getnew;
      
    console.log("car: " + getVIN);
  }

    event.target.carVIN.value = "";
  
  }
});

var fileId = mongoose.Types.ObjectId();

const contractAddress = "0xdaf4dfc26bdeeea119e2c3cd1e513f001882d57e";

const contractABI = [
	{
		"constant": false,
		"inputs": [],
		"name": "bet",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "num",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];


const addrABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "who",
				"type": "string"
			},
			{
				"name": "adr",
				"type": "string"
			},
			{
				"name": "name",
				"type": "string"
			}
		],
		"name": "addUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "who",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "adr",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			}
		],
		"name": "userAdded",
		"type": "event"
	}
];
const addcAddr = "0x6fd0ebfbef686e8dcc3c0091b34288428cd72036";
const addUserContract = web3.eth.contract(addrABI).at(addcAddr);

const myContract = web3.eth.contract(contractABI).at(contractAddress);

