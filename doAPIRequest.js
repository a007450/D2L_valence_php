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
						//console.log("ajax error: " + output);
					}
				}		
			},
			error: function(jqXHR, textStatus, settings, errorThrown) {
				//console.log("ajax error: " +objkey + ": " + settings + "<br />");
			}
		});
	

 }
 
function ManageObjs() {
	
	var id = APIObj["whoami"].Identifier;
	
	$('#responseField').append("<b>id: </b>" + id + "<br />" );
	//$('#responseField').append("<b>"+title+ "</b> <br />" );
	
	
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
	
	// loop through all gradeobjects to get gradeobjid	
	for (var i = 0 ; i < APIObj.gradeobj.length; i++) {
		
		var gradeobjid = APIObj.gradeobj[i].Id;
		var qstring = urlRef2 + orgUnit +"/grades/" + gradeobjid +"/values/";
		
		// loop through class list for studentid	
		var classSize = APIObj.classlist.length;
		if (classSize > 0 ) {
						
			for (var j = 0; j < classSize; j++) {
				var studentid = APIObj.classlist[j]['Identifier'];
				var reqString = qstring + studentid;
				var key = "q"+i+"s_" + j;
				
				$.when(
		    		
		    		doAPIRequest(host, port, scheme, reqString, 'GET', '', key)    			
		    	
		    	).then( function(obj){
		    		var o = $.parseJSON(obj);
		    		
		    		//console.log(o)
		    		$('#responseField').append(": " + o.GradeObjectName + ": " + o.PointsNumerator + "<br />");
		    		
		    	});
			}
			
		}
		
	
	}// end gradeobjid loop

}

