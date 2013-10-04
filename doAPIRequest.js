/******************************************************************************
 * Vienna Ly
 * LTC BCIT Oct 2, 2013
 * adapted from Valence API sample
 * Loading functions for custom app:
 * After authenticated through Valance API, gets JSON objects from API calls 
 ******************************************************************************/
var APIObj = {};

function Init(authenticated) {
	if (authenticated=="") { 
    	// not authenticated, trigger authentication
    	$("form").submit();
    }else { 
    	// authenticated
    	$("form").remove();
    		
    	var whoami = urlRef1 + "users/whoami",
    		enrollments = urlRef1 + "enrollments/myenrollments/",
    		classlist = urlRef2 + orgUnit + "/classlist/",
    		gradeobjs = urlRef2+ orgUnit + "/grades/";
    		
    	$.when( //listen for ajax complete
    		doAPIRequest(host, port, scheme, whoami, 'GET', '', "whoami"),
    		doAPIRequest(host, port, scheme, classlist, 'GET', '', "classlist"),
    		doAPIRequest(host, port, scheme, enrollments, 'GET', '', "enrollments"),
    		doAPIRequest(host, port, scheme, gradeobjs, 'GET', '', "gradeobj")
    			
    	).done( function(){
    		ManageObjs();
    	});
    }
}

function doAPIRequest(host, port, scheme, req, method, data, objkey) {

		return $.ajax({
			url: "doRequest.php",
			data: {
				host: host,
				port: port,
				scheme: scheme,
				anon: false,
				apiRequest: req,
				apiMethod: method,
				data: data,
			},
			success: function(data) {
				var output;
				
				if(data == '') {
					output = 'Success!';
					return;
				} else {
					try {
						// display data obj
						var obj = JSON.parse(data);
						
						
						output = "";
								
						APIObj[objkey] = obj;
												
					} catch(e) {
						output = "Unexpected non-JSON response from the server: " + data ;
						$('#responseField').html(output);
					}
				}		
			},
			error: function(jqXHR, textStatus, errorThrown) {
				
				$("#responseField").html("Ajax error");
			}
		});
	

 }
 
function ManageObjs() {
	
	for (var key in APIObj) {
		
		var obj = APIObj[key],
			title = "<b>APIObj["+ key +"]</b>";
		var output = JSON.stringify(obj, null, 4);
		var textArea = $('<textarea style="width:150px; display:inline-block" />'); 
		
		textArea.text(output);
		$('#responseField').append("<b>"+title+ "</b> <br />" );
		$('#responseField').append(textArea);
		$('#responseField').append("<br / ><br />");
	};
		
	for (var i = 0 ; i < APIObj.gradeobj.length; i++) {
		// loop through all gradeobjects to get gradeobjid
		// console.log(APIObj.gradeobj[i].Id);
		var gradeobjid = APIObj.gradeobj[i].Id;
		var qstring = urlRef2 + orgUnit +"/grades/" + gradeobjid +"/values/";
		console.log(qstring);
	};
	
}
