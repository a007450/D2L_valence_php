/******************************************************************************
 * Vienna Ly
 * LTC BCIT Oct 2, 2013
 * adapted from Valence API sample
 * Loading functions for custom app:
 * After authenticated through Valance API, gets JSON objects from API calls 
 ******************************************************************************/

var APIObj = {},   	// refers to objects returned from AJAX valence calls
	count = 0,		// tracks d/l AJAX progress
	Badges = {}; 	// tracks badges for each team
	
function doAPIRequest(host, port, scheme, req, method, data, objkey) {
		//console.log( req );
		
		var default_uid = 'default';
		if (objkey =='whoami')
			default_uid = 'user';
		
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
		
		htmltext = (i == 0)? "Team" :gradeobj.Name  +  "<span class='small'><br>/" + APIObj.gradeobjs[quizid].MaxPoints + "</span>";
		
		
		$( "th:nth-child("+colid+")" ).html(htmltext);
		
	}
	
}


function ManageObjs(session) {
	var i = 0, j = 0;
		
	// build table
	// build table row framework	
	for (i = 0; i < APIObj.groups.length; i ++) {
		html_row = "<tr><td class = 'teamName'>" + APIObj.groups[i].Name + "</td>";
		
		for (j = 0; j < APIObj.gradeobjs.length; j ++) {
			html_row += "<td id='row_" + i + "_"+ j +"'> N/A </td>";	
		}
		
		html_row += "</tr>"; // end team row
		$("#table_scores tbody").append(html_row);
		
	}
	
	
	for (i = 0; i < APIObj.groups.length; i ++) {

		for (j = 0; j < APIObj.gradeobjs.length; j ++) {
			DoRow(i, j, session);
		}
		
	}
	
	// for logged in user score
	console.log(APIObj.whoami);	
}

function DoRow(i, j, session) {
	// get quiz scores -- loop through group i, quiz j --> get SIDs in each group; 
	// loop through quizzes to get scores for each SID
	var groups = APIObj.groups, 
		gradeobjs = APIObj.gradeobjs,
		groupTtl = 0,
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
		    	count++;
		    	$('#output').html(count + "...retrieving group..." + groups[i].Name );
		    	    		
		   		if (grade.PointsNumerator != null) {
		   			groupSum += grade.PointsNumerator;
		   			groupTtl ++;
		   		}
		    		
		   		if (groupTtl == sid_ar.length) {
		   			groupAvg = groupSum/groupTtl;
		   			$('#row_' + i + '_' + j).html( "<span class='grade'> " + groupAvg + "</span>");
		   			
		   			// last group
		   			if (i == groups.length-1)
		   				$('#output').html("Done loading table of AVERAGE TEAM scores");
		   				setTimeout(function() {
						   $('#output').html("");
						  $("#table_scores").tablesorter(); 
						}, 1000);
		   		}
		    	
		   		
				
		   	});
		};
		
}


