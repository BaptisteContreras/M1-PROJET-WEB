const axios = require('axios');

var checkAuth =  function (cred, origin) {
    return (new Promise((resolve, reject) => {
        origin = 'https://192.168.75.6'
        let headers = {
            'Authentication': cred,
            'Origin'    : origin
        };
        axios.get('http://192.168.75.6:8080/authenticate?Origin='+origin, {headers})
            .then(response => {
                resolve(true)
            })
            .catch(error => {
                console.log("auth error : ")
                console.log(error)
                reject(false)
            })
    }))
}


module.exports = checkAuth
