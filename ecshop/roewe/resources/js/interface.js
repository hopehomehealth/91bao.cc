var protocol = location.protocol;
var host = location.host;
var port = location.port;
var api_host = protocol + "//api." + host.replace(/www\./, "");
// if (port) {
//     api_host += ":" + port;
// }
var interface = {
    indexSubmit:{
        url:api_host+'/v2/ecapi.policy.car'
    },
    indexNext:{
        url:''
    },
    indexVerificationCode:{
        url:api_host+'/v2/ecapi.auth.mobile.send'
    }

}