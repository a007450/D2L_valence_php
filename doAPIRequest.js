/******************************************************************************
 * Vienna Ly
 * LTC BCIT Oct 2, 2013
 * adapted from Valence API sample
 * Loading functions for custom app:
 * After authenticated through Valance API, gets JSON objects from API calls 
 ******************************************************************************/

var APIObj = {},   		// refers to objects returned from AJAX valence calls
	CellInfos = {}, 	// tracks names, scores, badges...etc for each team/quiz
	BadgeValues = {		// weight for awarding points
		first: 5, second: 4, third: 3,
		mostImp: 2, plus80: 1 
	};	
	
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

function TableHeader(tabId){
	
	var header = $(tabId + " thead tr"), 
		ar = APIObj.gradeobjs,
		classid = "header",
		i = 0;
	
	for (i=0; i < ar.length + 1; i++) {
		
		quizid = i-1, colid = i+1;
			
		gradeobj = ar[quizid];
		
		classid = (i == 0)? "{sorter: false} teamName" : "header";
		
		htmltext = "<th class=' "+ classid+"'>";
		htmltext += (i == 0)? "Team" :gradeobj.Name  +  "<span class='small'><br>/" + APIObj.gradeobjs[quizid].MaxPoints + "</span></th>";
		
		if (i==ar.length)
			htmltext += "<th class='header total'>Total Badge Points</th>";
		
		header.append(htmltext);
		
	}
	
	
	
}


function ManageObjs(session) {
	var i = 0, j = 0;
		
	// build table
	// build table row framework	
	for (i = 0; i < APIObj.groups.length; i ++) {
		html_row = "<tr id='row_" + i + "'><td class = 'teamName'>" + APIObj.groups[i].Name + "</td>";
		
		for (j = 0; j < APIObj.gradeobjs.length; j ++) {
			html_row += "<td class='grade'  id='cell_" + i + "_"+ j +"' onclick='CellClick("+ i + "," + j +")'> - </td>";	

			if (j == APIObj.gradeobjs.length-1) {
				html_row += "<td class='grade' id='cell_" + i  + "_totla'> </td>";					
			}
		}
		html_row += "</tr>"; // end team row
		$("#table_scores tbody").append(html_row);
		
		
		
	}
	
	for (j = 0; j < APIObj.gradeobjs.length; j ++) {
		for (i = 0; i < APIObj.groups.length; i ++) {
			DoGrade(i, j, session);
		}
		
	}
	
	// for logged in user score -- who am i should be loggined in user
	//console.log(APIObj.whoami);	
}

// i: group # (row); j = quiz# (column)
function DoGrade(i, j, session) {
	var groups = APIObj.groups, 
		gradeobjs = APIObj.gradeobjs, 
		mySID = APIObj.whoami.Identifier,
		s, sid_ar,
		gradeobjid = gradeobjs[j].Id,
		cellId = "cell_" + i + "_" + j;
		
	// get quiz scores -- loop through group i, quiz j --> get SIDs in each group; 
	// loop through quizzes to get scores for each SID
		
	sid_ar = groups[i].Enrollments;
	
	CellInfos[cellId] = {};
	CellInfos[cellId].sum = 0;
	CellInfos[cellId].n = 0;
	CellInfos[cellId].count = 0;
	CellInfos[cellId].ttl = sid_ar.length;
	CellInfos[cellId].students = [];
	CellInfos[cellId].grades = [];
	CellInfos[cellId].avg = 0;
	
	// TRACK BADGE ACHIEVEMENTS
	CellInfos[cellId].badges = {};
	CellInfos[cellId].badges.plus80 = false;
	CellInfos[cellId].badges.rank = 0;
	CellInfos[cellId].badges.mostImp = false;
			
		// for each student in the group
		for (s=0; s < sid_ar.length; s++)	{
			sid = sid_ar[s];
			
			//console.log(mySID + ", " + sid);
			if (mySID == sid) {
				$("#row_" + i).addClass("row_myGroup");
			}
			// query string for getting quiz grade for specific student
			qstring = session.urlRefle + session.orgUnit +"/grades/" + gradeobjid +"/values/" + sid_ar[s];
			k = "grp" + i + "_q" + j + "_sid" + s;	
			
			$.when( 
					x = {key: k, s: s, length: sid_ar.length, sid: sid},
					doAPIRequest(session.host, session.port, session.scheme, qstring, 'GET', '', k)
				
					
			).done( function(x, data){
				d = JSON.parse(data[0]);
				
		   		grade = d.PointsNumerator;
		   		
				CellInfos[cellId].grades[x.s] = grade;
				CellInfos[cellId].students[x.s] = getName(x.sid);
				CellInfos[cellId].count ++;	    	
		    	
		    	//console.log(cellId + ": " + CellInfos[cellId].students[x.s] + " " + grade);

		   		if (grade != null) {
		   			
		   			CellInfos[cellId].sum += grade;
		   			CellInfos[cellId].n ++;
		   		}
		   		
		   		// finished all count for quiz j, group i   		
		   		if (CellInfos[cellId].count == CellInfos[cellId].ttl  && CellInfos[cellId].n !=0) {
		   			
		   			groupAvg = CellInfos[cellId].avg = Math.round(100*CellInfos[cellId].sum/CellInfos[cellId].n)/100;
		   			$('#cell_' + i + '_' + j).html( "<a style='display:table; width: 100%; height:100%' href='#'>" + groupAvg + "</>" );
		   			
		   			// BADGE for 80 % plus for all
		   			CellInfos[cellId].badges.plus80 = Plus80(i, j);
		   			
		   			
		   			// last group
		   			if (i == groups.length-1) {
		   				
		   				// BADGE first, second, third for each quiz (j)
		   				CellInfos[cellId].badges.rank = GetRank(j);
						
		   				
		   				$('#output').html("Done loading table of AVERAGE TEAM scores for quiz" + j);
		   				
		   				setTimeout(function() {
						  	$('#output').html("");
						  	
						}, 3000);

						// finish table
						if (j == gradeobjs.length-1) {
							
							// BADGE for most improved
							CellInfos[cellId].badges.mostImp = MostImp();
							
							$("#table_scores").tablesorter();
						}
					}
					
					
					// calcuate badges for each quiz
		   		}
				
		   	});
		
		}
}

function CellClick(i,j) {
	console.log(CellInfos["cell_" + i + "_" + j]);
	var bgorig = $("#cell_" + i + "_" + j).css('background');
	
	$("#cell_" + i + "_" + j).css('background', 'rgba(255,255,100,.2)');
	setTimeout(function() {
		$("#cell_" + i + "_" + j).css('background', bgorig);
	}, 300);
}

// AWARDING BADGES
function Plus80(i, j){
	//console.log(CellInfos["cell_" + i + "_" + j]);
	
	var rewardBadge = true,
		denom = APIObj.gradeobjs[j].MaxPoints,
		marks = CellInfos["cell_" + i + "_" + j].grades,
		s = 0;
	
	if (denom !=0 || denom != null) {
		
		for (s = 0; s < marks.length; s++) {
			if (marks[s] < 0.8*denom) {
				rewardBadge = false;
				break;
			}
		}
		
		
	}
	
	return rewardBadge;
}
function GetRank(j) {
	var rank = 0;
		groups = APIObj.groups,  // array
		i = 0,
		quizRank = [],
		rankedObj = {};
	
	// compare scores for each group in quiz j	
	for (i = 0 ; i < groups.length ; i++) {
		grade = CellInfos["cell_" + i + "_" + j].avg;
		
		quizRank.push({team: i, grade: grade});
		
		if (i == groups.length -1) {
			quizRank.sort(function(a,b){return b.grade - a.grade});
			console.log(quizRank);
			// adjust rank for tie
			
			
		}
	}
		
	return rank;
}


function MostImp(){
	//console.log(CellInfos["cell_" + i + "_" + j]);
	
	var rewardBadge = true,
		avg = 0, // CellInfos["cell_" + i + "_" + j].avg,
		s = 0;
	
	return rewardBadge;
}

function getName(sid) {
	var i = 0, 
		name = "",
		classlist = APIObj.classlist;
	
	for (i = 0 ; i < classlist.length ; i ++) {
		if (sid == classlist[i].Identifier){
			name = classlist[i].DisplayName;
			break;
		}
			
	}
	
	return name;
}
