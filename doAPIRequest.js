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
    		
    	var whoami = urlReflp + "users/whoami",
    		enrollments = urlReflp + "enrollments/myenrollments/",
    		classlist = urlRefle + orgUnit + "/classlist/",
    		groups = urlReflp + orgUnit + "/groupcategories/" + groupcatId + "/groups/",
    		gradeobjs = urlRefle+ orgUnit + "/grades/";
    		
    	$.when( //listen for ajax complete
    		doAPIRequest(host, port, scheme, whoami, 'GET', '', "whoami"),
    		//doAPIRequest(host, port, scheme, classlist, 'GET', '', "classlist"),
    		doAPIRequest(host, port, scheme, groups, 'GET', '', "groups"),
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
	// output for debug and testing only
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
	
	// get quiz scores -- loop through groups --> get SIDs in each group; 
	// loop through quizzes to get scores for each SID
	var groups = APIObj["groups"], 
		gradeobj = APIObj["gradeobj"],
		count = 0;
	var ttl = getTtl();
	
	for (var i = 0 ; i < groups.length; i++) {
		
		var sid_ar = groups[i].Enrollments; // array of SIDs in group
		
		// for each student
		for (var s = 0 ; s < sid_ar.length ; s++) {
			
			var sid = sid_ar[s];
			
			// loop through each quiz to get mark
			
			
			for (var j = 0 ; j < gradeobj.length; j++) {
				
				var gradeobjid = APIObj.gradeobj[j].Id;
				var qstring = urlRefle + orgUnit +"/grades/" + gradeobjid +"/values/" + sid;
				var k = "grp" + i + "_sid" + s;
				
				$.when( 
					//console.log(k),
					doAPIRequest(host, port, scheme, qstring, 'GET', '', k)
				).done( function(){
		    		count ++;
		    		
		    		if (count == ttl) {
		    			BuildQuizTable();
		    		}
		    	});
			};
		};
	};
	
	
	
	
}

function getTtl() {
	var groups = APIObj["groups"] , 
		gradeobjs = APIObj["gradeobj"].length,
		ttl = 0;
		
	for (var i = 0 ; i < groups.length; i++) {
		var t = (groups[i].Enrollments.length ) * gradeobjs;
		
		ttl += t;

	}
	
	return ttl;
}

function BuildQuizTable(){

	var groups = APIObj["groups"] , 
		gradeobjs = APIObj["gradeobj"].length,
		html = "<table>";
	
	//html += "<tr><th width = '150'> Group </th> <th width = '150'> SID </th> <th width = '150'> Score </th> </tr>";
	console.log(APIObj["grp3_sid4"]);
	
	for (var i = 0 ; i < groups.length; i++) {
		var grp = groups[i].Name;
		var sid_ar = groups[i].Enrollments; // array of SIDs in group
		
		// for each student
		for (var s = 0 ; s < sid_ar.length ; s++) {
			var sid = sid_ar[s];
			
			for (var j = 0 ; j < gradeobjs; j++) {
				var k = "grp" + i + "_sid" + s;
				/*
				html += "<tr><td> " + grp
				+" </td> <td> "+ sid
				+" </td> <td> "+ APIObj[k]["WeightedNumerator"]; 
				+" </td> </tr>";
				*/
				console.log(k);
			}
			
		}
	}
	
	//html += "</table>"
	
	//$('#output').append(html);
	
}
