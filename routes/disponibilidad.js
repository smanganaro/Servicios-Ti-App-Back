var express = require("express");
var router = express(); 

var request = require('request');
var querystring = require('querystring');

var currentdate = new Date(); 
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " at "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds() ;

router.use((req, res, next) => {
  	res.header('Access-Control-Allow-Origin', '*');
  	next();
});

/*router.post('/token', (req, res) => {
	request(
    { url: 'https://login.microsoftonline.com/33d05390-0e0b-4269-9ced-768a7458bb20/oauth2/token' },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});*/

router.get('/gettoken', (req, res) => {

        const form = {
            grant_type: 'client_credentials',
            client_id: '51a1f5e3-21b3-4a28-bfa4-e653adbe6a8c@33d05390-0e0b-4269-9ced-768a7458bb20',
            client_secret: 'h2ajlGhznSgZIOB7x2dlWC4wXvXI=*._',
            resource: '00000003-0000-0ff1-ce00-000000000000/prismamediosdepago.sharepoint.com@33d05390-0e0b-4269-9ced-768a7458bb20'
        }

        var requestBody = querystring.stringify(form);
            
        request({headers:{
                	'Content-Type': ' application/x-www-form-urlencoded'
            	},
            	uri: 'https://accounts.accesscontrol.windows.net/33d05390-0e0b-4269-9ced-768a7458bb20/tokens/OAuth/2',
            	body: requestBody}, (error, response, body) => {
			  if (error) {
			    console.error(error)
			    return
			  }
			  //console.log(`statusCode: ${res.statusCode}`)
			  //console.log(body)
			  res.send(body)
			  
			}) ;
        
})


router.post('/getdisponibilidades', (req, res) => {

 		const token = req.body.token;

 		//console.log(token);

        request({headers:{
                	'Authorization': ' Bearer ' + token,
                	'Accept': 'application/json;odata=verbose'
            	},
            	uri: "https://prismamediosdepago.sharepoint.com/sites/DP/ServiciosTI/_api/web/lists/"+
            		"getbytitle('Disponibilidad%20Plataformas')/items?$top=30&$select=D_x00ed_a,"+
            		"NonStop_x0020_BE,TodoPago,Decidir_x0020_2_x002e_0,Transacciones_x0020_QR,Pagomiscuentas,"+
            		"PHE,Mainframe,TRX_x0020_Mainframe,TRX_x0020_NonStop_x0020_BE,OData__x0074_ya3,r8x4,oobi,"+
            		"d6ti,VHB_x0028_8_x0029_,OData__x0025__x0020_VHB_x0020__x0028_8,OData__x0025__x0020_VHS_x0020__x0028_9,"+
            		"OData__x0025__x0020_WS_x0020_BE,REQ_x0020_VHS_x0020__x0028_9_x00,TRX_x0020_QR,"+
            		"TRX_x0020_WS_x0020_BE_x0020__x00&$orderby=Id desc"}, (error, response, body) => {
				
				  if (error) {
				    console.error(error)
				    return
				  }
				  //console.log(`statusCode: ${res.statusCode}`)
				  //console.log(body)
				  res.send(body)
			  
			});
        
})

module.exports = router;