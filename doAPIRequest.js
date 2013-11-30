/******************************************************************************
 * Vienna Ly
 * LTC BCIT Oct 2, 2013
 * adapted from Valence API sample
 * Loading functions for custom app:
 * After authenticated through Valance API, gets JSON objects from API calls 
 ******************************************************************************/
var APIObj = {};

function doAPIRequest(host, port, scheme, req, method, data, objkey) {
		//console.log( req );
		
		var default_uid = true;
		if (objkey =='whoami')
			default_uid = false;
			
		return $.ajax({
			url: "doRequest.php",
			data: {
				host: host,
				port: port,
				scheme: scheme,
				anon: false,
				defaultuid: default_uid,
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
						obj = JSON.parse(data);		
						output = "";
								
						APIObj[objkey] = obj;
												
					} catch(e) {
						output = "Unexpected non-JSON response from the server: " + data ;
						//console.log("ajax error: " + output);
					}
				}		
			},
			error: function(jqXHR, textStatus, settings, errorThrown) {
				console.log("ajax error: " +objkey + ": " + settings + "");
			}
		});
	

}

function TableHeader(){
	
	var header = $("#table_scores thead tr"), ar = APIObj.gradeobjs,
		i = 0;
	
	for (i=0; i < ar.length + 1; i++) {
		
		quizid = i-1, colid = i+1;
			
		gradeobj = ar[quizid];
		
		htmltext = (i == 0)? "Team" : gradeobj.Name;
		
		
		$( "th:nth-child("+colid+")" ).html(htmltext);
		
	}
	
	//console.log(header.html());	
}


function ManageObjs(session) {
	DoRow(0, session);
	DoRow(1, session);
	DoRow(2, session);
	
}

function DoRow(i, session) {
	// get quiz scores -- loop through groups --> get SIDs in each group; 
	// loop through quizzes to get scores for each SID
	var groups = APIObj.groups, 
		gradeobj = APIObj.gradeobjs,
		count = 0, 
		s = 0, j = 0,
		html_row = "",
		sid_ar;
	
	//for each group
	
		grp_name = groups[i].Name;
		html_row = "<tr><td>" + grp_name + "</td>";
	
		sid_ar = groups[i].Enrollments; // array of SIDs in group
		
		groupAvg = 0;
		
		// loop through each quiz to get gradeobjid
		for (j = 0 ; j < gradeobj.length; j++) {
			gradeobjid = gradeobj[j].Id;	
			
			html_row += "<td id=row_'" + i + "_"+ j +"'>N/A";
			
			// for each student in the group
			for (s = 0 ; s < sid_ar.length ; s++) {
				
				sid = sid_ar[s];
				qstring = session.urlRefle + session.orgUnit +"/grades/" + gradeobjid +"/values/" + sid;
				k = "grp" + i + "_sid" + s + "_q" + j;
				
				$.when( 
					x = {key: k, i :i, j: j, s: s},
					doAPIRequest(session.host, session.port, session.scheme, qstring, 'GET', '', k)
					
				).done( function(x, data, textStatus, jqXHR){
		    		count = sid_ar.length * gradeobj.length;
		    		
		    		$('#output').html("Retrieved scores... " + count );
					
					console.log(x.key);
		    	});
			};
			
			html_row += "</td>";
		};
		
		
		html_row += "</tr>"; // end team row
		$("#table_scores").append(html_row);
}

