document.getElementById("getUser")
    .addEventListener("click", function(){
        let request = new XMLHttpRequest();
        let username = document.getElementById("username").value;
        request.open('GET', 'http://192.168.75.6:8080/user/' + username, true);
        request.send();
        request.addEventListener('readystatechange', function () {
           if(request.readyState === XMLHttpRequest.DONE){
               if(request.status === 200){
                   document.getElementById("testResult").innerHTML = request.responseText;
               }else{
                   document.getElementById("testResult").innerHTML = "Error " + request.status;
               }
           }
        });
    });

document.getElementById("login")
    .addEventListener("click", function(){
        let request = new XMLHttpRequest();
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let formData = new FormData();
        formData.append("login", username);
        formData.append("password", password);
        request.open('POST', 'http://192.168.75.6:8080/login/', true);
        request.send(formData);
        request.addEventListener('readystatechange', function () {
            if(request.readyState === XMLHttpRequest.HEADERS_RECEIVED){
                let token = request.getResponseHeader("Authentication");
                let origin = request.getResponseHeader("Origin");
                if(token != null){
                    window.localStorage.setItem('token', token);
                    document.getElementById("testResult").innerHTML = token;
                    document.getElementById("token").value = token;
                    document.getElementById("connected").innerHTML = "true";
                    document.getElementById("origin").value = origin;
                }else{
                    document.getElementById("connected").innerHTML = "false";
                    document.getElementById("testResult").innerHTML = "Error " + request.status;
                }
            }
        });
    });

document.getElementById("logout")
    .addEventListener("click", function(){
        let request = new XMLHttpRequest();
        let token = window.localStorage.getItem('token');
        request.open('DELETE', 'http://192.168.75.6:8080/logout/', true);
        request.setRequestHeader("Authentication", token);
        request.send();
        request.addEventListener('readystatechange', function () {
            if(request.readyState === XMLHttpRequest.DONE){
                if(request.status === 200){
                    window.localStorage.removeItem('token');
                    document.getElementById("testResult").innerHTML = "Disconnected";
                    document.getElementById("connected").innerHTML = "false";
                    document.getElementById("token").value = "";
                    document.getElementById("origin").value = "";
                }else{
                    document.getElementById("testResult").innerHTML = "Error " + request.status;
                }
            }
        });
    });

document.getElementById("authenticate")
    .addEventListener("click", function(){
        let request = new XMLHttpRequest();
        let token = window.localStorage.getItem('token');
        request.open('GET', 'http://192.168.75.6:8080/authenticate', true);
        request.setRequestHeader("Authentication", token);
        request.send();
        request.addEventListener('readystatechange', function () {
            if(request.readyState === XMLHttpRequest.DONE){
                if(request.status === 204){
                    document.getElementById("testResult").innerHTML = "Authenticate";
                    document.getElementById("connected").innerHTML = "true";
                }else{
                    document.getElementById("testResult").innerHTML = "Error " + request.status;
                }
            }
        });
    });