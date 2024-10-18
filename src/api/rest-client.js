function performRequest(request, callback){
    const jwtToken = sessionStorage.getItem("jsonWebToken");

    if (jwtToken) {
      request.headers.set('Authorization', `Bearer ${jwtToken}`);
    }

    fetch(request)
        .then(
            function(response) {
                if (response.ok) {
                    response.json().then(json => callback(json, response.status,null));
                }
                else {
                    response.json().then(err => callback(null, response.status,  err));
                }
            })
        .catch(function (err) {
            //catch any other unexpected error, and set custom code for error = 1
            callback(null, 1, err)
        });
}

module.exports = {
    performRequest
};
