const express = require('express');
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const jsonParser = require('body-parser').json;

mongoose.connect("mongodb://localhost:27017/RPG");
const db = mongoose.connection;

db.on("error", function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

app.get('/', (req, res) =>{
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.use(express.static('public'));
app.use(jsonParser());

app.listen(8000, () => {
	console.log('The application is listening on port 8000.');
});

const Schema = mongoose.Schema;

const CharacterSchema = new Schema ({
    name: {type: String, default: 'John Doe'},
    baseStr: {type: Number, default:5},
    baseDex: {type: Number, default:5},
    baseSta: {type: Number, default:5},
    health: {type: Number, default:10},
    money: {type: Number, default:100},
    weapon: {type: String, default: ' Knife'},
    armor: {type: String, default: ' Clothes'},
    weaponDam: {type: Number, default:1},
    defense: {type: Number, default:1},
    exp: {type: Number, default:10},
    level: {type: Number, default:1},
    eStats: {type: Number, default:0},
    inventory: {type: Array,},
    questFlags: {type: Object, default:{princess: 1,}},
    saveCode: {type: String, defualt: 'password'},
});

const Character = mongoose.model("Character", CharacterSchema);

app.post('/save', (req, res) =>{
	console.log("Saved!");
	console.log(req.body);
	const playerChar = new Character(req.body);
	console.log(playerChar);
	playerChar.save((err, playerChar) =>{
		if(err) return next(err);
		res.status(201);
		res.json(playerChar);
	});
});

app.post('/load', (req, res) =>{
	console.log(req.body.save);
	Character.findOne({saveCode: req.body.save}, function (err, Character) {
  		if (err) return console.error(err);
  		console.log(Character);
  		res.json(Character);
	});
});

app.post('/delete', (req, res) =>{
	Character.deleteOne({saveCode: req.body.save}, function (err, Character) {
  		if (err) return console.error(err);
  		console.log(Character);
	});
});