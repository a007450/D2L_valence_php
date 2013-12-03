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
	var i = 0, j = 0;
		
	// build table
	// build table row framework	
	for (i = 0; i < APIObj.groups.length; i ++) {
		html_row = "<tr><td>" + APIObj.groups[i].Name + "</td>";
		
		for (j = 0; j < APIObj.gradeobjs.length; j ++) {
			html_row += "<td id=row_'" + i + "_"+ j +"'>N/A";
			html_row += "</td>";	
			
		}
		
		html_row += "</tr>"; // end team row
		$("#table_scores").append(html_row);
	}
		
	// params: group#, quiz#, session info
	DoRow(0, 1, session);
	
	
}

function DoRow(i, j, session) {
	// get quiz scores -- loop through groups --> get SIDs in each group; 
	// loop through quizzes to get scores for each SID
	var groups = APIObj.groups, 
		gradeobjs = APIObj.gradeobjs,
		count = 0,
		groupSum = 0, 
		groupAvg;
		s = 0, 
		html_row = "",
		sid_ar = [];
		
		// array of SIDs in group
		sid_ar = groups[i].Enrollments; 
		
		//group ref
		grp_name = groups[i].Name;

		//quiz ref
		gradeobjid = gradeobjs[j].Id;	
		
		// for each student in the group
		for (s = 0 ; s < sid_ar.length ; s++) {
				
			sid = sid_ar[s];
				// query string for getting quiz grade for specific student
			qstring = session.urlRefle + session.orgUnit +"/grades/" + gradeobjid +"/values/" + sid;
			k = "grp" + i + "_q" + j + "_sid" + s;
				
			$.when( 
				x = {key: k, i :i, j: j, s: s},
				doAPIRequest(session.host, session.port, session.scheme, qstring, 'GET', '', k)
					
			).done( function(x, data){
		   		grade = JSON.parse(data[0]);
		    				    		
		   		if (grade.PointsNumerator != null) {
		   			groupSum += grade.PointsNumerator;
		   			count ++;
		   		}
		    		
		   		if (count == sid_ar.length) {
		   			groupAvg = groupSum/count;
		   			$('#row_' + i + '_' + j).html(groupAvg);
		   			console.log(grade.PointsNumerator + "/" + grade.PointsDenominator );
		   		}
		    		
		    		
		   		$('#output').html("Retrieved scores... " + count + ", ref: " + groupAvg);
				
		   	});
		};
		
		
}

