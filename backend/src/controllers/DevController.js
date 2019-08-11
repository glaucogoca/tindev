const axios = require('axios-proxy-fix');
//const proxy = require('../proxy');
const http = require('http');
const Dev = require('../models/Dev');


function doGet(url) {
    return new Promise((resolve,reject) => {
        http.get(url, (response) => {
            let chunks_of_data = [];

			response.on('data', (fragments) => {
				chunks_of_data.push(fragments);
			});

			response.on('end', () => {
				let response_body = Buffer.concat(chunks_of_data);
				resolve(JSON.parse(response_body.toString()));
			});

			response.on('error', (error) => {
				reject(error);
			});
        });
    });
}

module.exports = {
    async index(req, res) {
        const {user} = req.headers;

        const loggedDev = await Dev.findById(user);

        console.log(loggedDev);

        const users = await Dev.find({
           $and: [
               {_id: {$ne: user}},
               {_id: {$nin: loggedDev.likes }},
               {_id: {$nin: loggedDev.dislikes }},
           ],
        });

        return res.json(users);
    },

    async store(req, res) {
        const { username } = req.body;
        //console.log(username);
        //console.log(proxy);
        
        const userExists = await Dev.findOne( { user: username});
        if(userExists) {
            return res.json(userExists);
        }


        //const url = `http://localhost:4444/categoria/github/${username}`;        
        //const url = `https://api.github.com/users/${username}`;  
        //let get_promise = doGet(url);
        //let response_body = await get_promise;

        let response = await axios.get(`https://api.github.com/users/${username}`);


        console.log(response.data);

        const {name, bio, avatar_url: avatar } = response.data;

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        });

        return res.json(dev);
        
    }
};