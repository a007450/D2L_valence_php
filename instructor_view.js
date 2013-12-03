/**
 * Copyright (c) 2012 Desire2Learn Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the license at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/******************************************************************************
 * Javascript functions for the sample HTML file                              *
 ******************************************************************************/
 var APIObj = {};
 var grpQuizes = [];
 
	var htmlMI1 = "";
	var htmlMI2 = "";
	var htmlMI3 = "";
	var htmlMI4 = "";
	var htmlMI5 = "";
	
	var leadDiff1 = 0;
	var leadDiff2 = 0;
	var leadDiff3 = 0;
	var leadDiff4 = 0;
	var leadDiff5 = 0;
	
	var firstQ1 = 0,firstQ2 = 0,firstQ3 = 0,firstQ4 = 0,firstQ5 = 0,firstQ6 = 0;
	var secondQ1 = 0,secondQ2 = 0,secondQ3 = 0,secondQ4 = 0,secondQ5 = 0,secondQ6 = 0;
	var thirdQ1 = 0,thirdQ2 = 0,thirdQ3 = 0,thirdQ4 = 0,thirdQ5 = 0,thirdQ6 = 0;
	var htmlFirstQ1= "",htmlFirstQ2 = "",htmlFirstQ3 = "",htmlFirstQ4 = "",htmlFirstQ5 = "",htmlFirstQ6 = "";
	var htmlSecondQ1= "",htmlSecondQ2= "",htmlSecondQ3= "",htmlSecondQ4= "",htmlSecondQ5= "",htmlSecondQ6= "";
	var htmlThirdQ1= "",htmlThirdQ2= "",htmlThirdQ3= "",htmlThirdQ4= "",htmlThirdQ5= "",htmlThirdQ6= "";

	var storedQuiz1Avg = [];
	var storedQuiz2Avg = [];
	var storedQuiz3Avg = [];
	var storedQuiz4Avg = [];
	var storedQuiz5Avg = [];
	var storedQuiz6Avg = [];
    
    var q1Sorted;
    var q2Sorted;
    var q3Sorted;
    var q4Sorted;
    var q5Sorted;
    var q6Sorted;    
    
	
function test() {
	//document.getElementById("davidField").value = "Made it to Part 1";
	var orgUnit = 159492;
	var groupcatId = 57756;
	var host = "learn.bcit.ca";
	var port = 443;
	var scheme = "https";
		
	/*
        if (authenticated=="") { 
            // not authenticated, trigger authentication
            $("form").submit();
    	}else { 
            // authenticated
            $("form").remove();
                 */   
            var whoami = "/d2l/api/lp/1.3/" + "users/whoami";
            var enrollments = "/d2l/api/lp/1.3/"+ "enrollments/myenrollments/";
            var classlist = "/d2l/api/le/1.3/"+ orgUnit + "/classlist/";
            var groups = "/d2l/api/lp/1.3/"+ orgUnit + "/groupcategories/" + groupcatId + "/groups/";
            var gradeobjs = "/d2l/api/le/1.3/"+ orgUnit + "/grades/";

            //document.getElementById("davidField").value = "Made it to Part 2";        
                    			 
			 $.when( //listen for ajax complete
                    //doAPIRequest(host, port, scheme, whoami, 'GET', '', "whoami"),
                    //doAPIRequest(host, port, scheme, classlist, 'GET', '', "classlist"),
                    //doAPIRequest(host, port, scheme, enrollments, 'GET', '', "enrollments"),
                    // GET Groups
                    // /d2l/api/lp/1.3/159492/groupcategories/57756/groups/
                    
                    doAPIRequest(host, port, scheme, groups, 'GET', '', "groups"),
                    doAPIRequest(host, port, scheme, gradeobjs, 'GET', '', "gradeobj"),
                    doAPIRequest(host, port, scheme, classlist, 'GET', '', "classlist"),
                    ManageObjs()
                    //david()
                    
			).done( function(){	
			 	//document.getElementById("davidField").value = "Made it to Part Manage Objects";
			    //document.getElementById("leaderOutput").innerHTML="MDAVIDDD";
			 	alert("SCUCCESS!");
			 	//david();
				//ManageObjs();
    		}).fail( function() {
    			alert("Error Error Error");
    			});         
	}	      
   
      function doAPIRequest(host, port, scheme, req, method, data, objkey) { 
      		
      	  //document.getElementById("davidField").value = "Made it to Part 3";
          //document.getElementById("leaderOutput").innerHTML="Made it to beside part 3";
  
         	return $.ajax({
				url: "doRequest.php",
				data: {
					host: host,
					port: port,
					scheme: scheme,
					//anon: false,
					apiRequest: req,
					apiMethod: method,
					data: data
				},
				success: function(data) {
					var output;
					if(data == '') {
						output = 'Success!';
								
						return;
					} else {
						try {
					        //output = JSON.stringify(JSON.parse(data), null, 4);
						    var obj = JSON.parse(data);		
						    output = "Im IN!";
								
						    APIObj[objkey] = obj;

						} catch(e) {
							output = "Unexpected non-JSON response from the server: " + data;
						}
					}
					//$('#davidField').val(output);
					document.getElementById("davidField").hidden = true;
					document.getElementById("responseFieldLabel").hidden = false;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					document.getElementById("error").innerHTML = "Uncaught Error.\n" + jqXHR.responseText;
				}
			});
         	//document.getElementById("leaderOutput").innerHTML = "MDAVIDDD";
			
 }
 
      function ManageObjs() {
          var orgUnit = 159492;
          var groupcatId = 57756;
          var host = "learn.bcit.ca";
          var port = 443;
          var scheme = "https";
 
 	//$('#output').val("Manage Objects");
	// output for debug and testing only
	for (var key in APIObj) {
	    //document.getElementById("leaderOutput").innerHTML = "Made it to Part Manage Objects Part 2";

		var obj = APIObj[key],
			title = "<b>APIObj["+ key +"]</b>";
		var output = JSON.stringify(obj, null, 4);
		var textArea = $('<textarea style="width:15px; display:inline-block; height: 15px"/>');

        // Test Ouput
		//document.getElementById("leaderOutput").innerHTML = output;
		//document.getElementById("leaderTitle").innerHTML = "<h1 class='instructor'>Leaderboard</h1>";

		//textArea.text(output);
		//$('#responseField').append("<b>"+title+ "</b> " );
		//$('#responseField').append(textArea);
		//$('#responseField').append(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	};
	
	// get quiz scores -- loop through groups --> get SIDs in each group; 
	// loop through quizzes to get scores for each SID
	var groups = APIObj["groups"], 
		gradeobj = APIObj["gradeobj"],
		classlist = APIObj["classlist"],
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
			    var qstring = "/d2l/api/le/1.3/" + orgUnit + "/grades/" + gradeobjid + "/values/" + sid;				
				var k = "grp" + i + "_sid" + s + "_q" + j;

			    /*
			    -- Old Code
			    			
				$.when( 
					doAPIRequest(host, port, scheme, qstring, 'GET', '', k),
                    $('#leaderOutput').append("<b><b><b> ALMOST EHRER: 3rd Level"),
          			$('#leaderOutput').append("<b><b><b> Count = " + count + "<b><b>")
				).then( function(){
					$('#leaderOutput').append("<b><b><b> Finally!  ");
		    		//count ++;
		    		
		    		//$('#leaderOutput').append("<b><b><b> ALMOST EHRER: DONE FUNCTION");
		    		//var percent = Math.round(count / ttl * 100);
		    		//$('#leaderOutput').html("Getting scores... " + percent + "%");
		    		//$('#leaderOutput').append("<b><b><b> ALMOST EHRER: 4th Level");
		    		//if (count == ttl) {
		    		    //BuildQuizTable();
		    		    //$('#leaderOutput').append("<b><b><b> SUCESSSSSSSSS");
		    		//}
		    	});			*/
		    	
		    	doAPIRequest(host, port, scheme, qstring, 'GET', '', k);
		    	
		    	count ++;
				var percent = Math.round(count / ttl * 100);
				$('#leaderOutput').html("Getting scores... " + percent + "%");
				
		    	if (count == ttl) {
		    		BuildQuizTable();
		    	}
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

function getStudentName(studentId) {
	
	//doAPIRequest(host, port, scheme, classlist, 'GET', '', "classlist");
	var classlist = APIObj["classlist"];
	var found = false;
	
	//$('#testarea').append(studentId);
	
	//while (found != true) {
	
		for (var i = 0 ; i < classlist.length; i++) {
			
			//var student = classlist[i].Identifer;
						
			if (studentId == classlist[i].Identifier){
				found = true;
				return classlist[i].DisplayName;
			}
			else 
				found = false;	
		
		}
	//}
	/*
	for (var i = 0 ; i < classlist.length; i++) {
	
		$('#testarea').append(classlist[i].DisplayName);
	}
	*/
}
function sortTop3() {
	// Sort All Averages for Quiz 1 in Decending Order
	q1Sorted = storedQuiz1Avg.sort(function(a,b) {
		    var avalue = a.grade,
		        bvalue = b.grade;
		    if (avalue < bvalue) {
		        return -1;
		    }
		    if (avalue > bvalue) {
		        return 1;
		    }
		    return 0;
		});
	// Sort All Averages for Quiz 2 in Decending Order		
	q2Sorted = storedQuiz2Avg.sort(function(a,b) {
		    var avalue = a.grade,
		        bvalue = b.grade;
		    if (avalue < bvalue) {
		        return -1;
		    }
		    if (avalue > bvalue) {
		        return 1;
		    }
		    return 0;
		});
	// Sort All Averages for Quiz 3 in Decending Order
	q3Sorted = storedQuiz3Avg.sort(function(a,b) {
		    var avalue = a.grade,
		        bvalue = b.grade;
		    if (avalue < bvalue) {
		        return -1;
		    }
		    if (avalue > bvalue) {
		        return 1;
		    }
		    return 0;
		});
	// Sort All Averages for Quiz 4 in Decending Order
	q4Sorted = storedQuiz4Avg.sort(function(a,b) {
		    var avalue = a.grade,
		        bvalue = b.grade;
		    if (avalue < bvalue) {
		        return -1;
		    }
		    if (avalue > bvalue) {
		        return 1;
		    }
		    return 0;
		});
	// Sort All Averages for Quiz 5 in Decending Order
	q5Sorted = storedQuiz5Avg.sort(function(a,b) {
		    var avalue = a.grade,
		        bvalue = b.grade;
		    if (avalue < bvalue) {
		        return -1;
		    }
		    if (avalue > bvalue) {
		        return 1;
		    }
		    return 0;
		});
	// Sort All Averages for Quiz 6 in Decending Order
	q6Sorted = storedQuiz6Avg.sort(function(a,b) {
		    var avalue = a.grade,
		        bvalue = b.grade;
		    if (avalue < bvalue) {
		        return -1;
		    }
		    if (avalue > bvalue) {
		        return 1;
		    }
		    return 0;
		});
}

function assignTop3 () {
	
	// Gold/Silver/Bronze are calculated for Quiz 1
    for (c=0; c < q1Sorted.length; c++) {
    	
    	if (parseFloat(q1Sorted[c].grade) >= firstQ1) {
    		
    		if (parseFloat(q1Sorted[c].grade) > firstQ1) {
				htmlFirstQ1 = q1Sorted[c].name;
				firstQ1 = parseFloat(q1Sorted[c].grade);
			}
			else if (parseFloat(q1Sorted[c].grade) == firstQ1) {
				htmlFirstQ1 = htmlFirstQ1 + "<br>" + q1Sorted[c].name;
				firstQ1 = parseFloat(q1Sorted[c].grade);
			}
    	}   	
    	else if (parseFloat(q1Sorted[c].grade) >= secondQ1 && parseFloat(q1Sorted[c].grade) < firstQ1) {
    		
    		if (parseFloat(q1Sorted[c].grade) > secondQ1) {
				htmlSecondQ1 = q1Sorted[c].name;
				secondQ1 = parseFloat(q1Sorted[c].grade);
			}
			else if (parseFloat(q1Sorted[c].grade) == secondQ1) {
				htmlSecondQ1 = htmlSecondQ1 + "<br>" + q1Sorted[c].name;
				secondQ1 = parseFloat(q1Sorted[c].grade);
			} 	
    	}
    	else if (parseFloat(q1Sorted[c].grade) >= thirdQ1 && parseFloat(q1Sorted[c].grade) < secondQ1) {
    		
    		if (parseFloat(q1Sorted[c].grade) > thirdQ1) {
				htmlThirdQ1 = q1Sorted[c].name;
				thirdQ1 = parseFloat(q1Sorted[c].grade);
			}
			else if (parseFloat(q1Sorted[c].grade) == thirdQ1) {
				htmlThirdQ1 = htmlThirdQ1 + "<br>" + q1Sorted[c].name;
				thirdQ1 = parseFloat(q1Sorted[c].grade);
			} 	
    	}	
    }
	// Gold/Silver/Bronze are calculated for Quiz 2
    for (c=0; c < q2Sorted.length; c++) {
    	
    	if (parseFloat(q2Sorted[c].grade) >= firstQ2) {
    		
    		if (parseFloat(q2Sorted[c].grade) > firstQ2) {
				htmlFirstQ2 = q2Sorted[c].name;
				firstQ2 = parseFloat(q2Sorted[c].grade);
			}
			else if (parseFloat(q2Sorted[c].grade) == firstQ2) {
				htmlFirstQ2 = htmlFirstQ2 + "<br>" + q2Sorted[c].name;
				firstQ2 = parseFloat(q2Sorted[c].grade);
			}
    	}   	
    	else if (parseFloat(q2Sorted[c].grade) >= secondQ2 && parseFloat(q2Sorted[c].grade) < firstQ2) {
    		
    		if (parseFloat(q2Sorted[c].grade) > secondQ2) {
				htmlSecondQ2 = q2Sorted[c].name;
				secondQ2 = parseFloat(q2Sorted[c].grade);
			}
			else if (parseFloat(q2Sorted[c].grade) == secondQ2) {
				htmlSecondQ2 = htmlSecondQ2 + "<br>" + q2Sorted[c].name;
				secondQ2 = parseFloat(q2Sorted[c].grade);
			} 	
    	}
    	else if (parseFloat(q2Sorted[c].grade) >= thirdQ2 && parseFloat(q2Sorted[c].grade) < secondQ2) {
    		
    		if (parseFloat(q2Sorted[c].grade) > thirdQ2) {
				htmlThirdQ2 = q2Sorted[c].name;
				thirdQ2 = parseFloat(q2Sorted[c].grade);
			}
			else if (parseFloat(q2Sorted[c].grade) == thirdQ2) {
				htmlThirdQ2 = htmlThirdQ2 + "<br>" + q2Sorted[c].name;
				thirdQ2 = parseFloat(q2Sorted[c].grade);
			} 	
    	}	
    }
	// Gold/Silver/Bronze are calculated for Quiz 3
    for (c=0; c < q3Sorted.length; c++) {
    	
    	if (parseFloat(q3Sorted[c].grade) >= firstQ3) {
    		
    		if (parseFloat(q3Sorted[c].grade) > firstQ3) {
				htmlFirstQ3 = q3Sorted[c].name;
				firstQ3 = parseFloat(q3Sorted[c].grade);
			}
			else if (parseFloat(q3Sorted[c].grade) == firstQ3) {
				htmlFirstQ3 = htmlFirstQ3 + "<br>" + q3Sorted[c].name;
				firstQ3 = parseFloat(q3Sorted[c].grade);
			}
    	}   	
    	else if (parseFloat(q3Sorted[c].grade) >= secondQ3 && parseFloat(q3Sorted[c].grade) < firstQ3) {
    		
    		if (parseFloat(q3Sorted[c].grade) > secondQ3) {
				htmlSecondQ3 = q3Sorted[c].name;
				secondQ3 = parseFloat(q3Sorted[c].grade);
			}
			else if (parseFloat(q3Sorted[c].grade) == secondQ3) {
				htmlSecondQ3 = htmlSecondQ3 + "<br>" + q3Sorted[c].name;
				secondQ3 = parseFloat(q3Sorted[c].grade);
			} 	
    	}
    	else if (parseFloat(q3Sorted[c].grade) >= thirdQ3 && parseFloat(q3Sorted[c].grade) < secondQ3) {
    		
    		if (parseFloat(q3Sorted[c].grade) > thirdQ3) {
				htmlThirdQ3 = q3Sorted[c].name;
				thirdQ3 = parseFloat(q3Sorted[c].grade);
			}
			else if (parseFloat(q3Sorted[c].grade) == thirdQ3) {
				htmlThirdQ3 = htmlThirdQ3 + "<br>" + q3Sorted[c].name;
				thirdQ3 = parseFloat(q3Sorted[c].grade);
			} 	
    	}	
    }
	// Gold/Silver/Bronze are calculated for Quiz 4
    for (c=0; c < q4Sorted.length; c++) {
    	
    	if (parseFloat(q4Sorted[c].grade) >= firstQ4) {
    		
    		if (parseFloat(q4Sorted[c].grade) > firstQ4) {
				htmlFirstQ4 = q4Sorted[c].name;
				firstQ4 = parseFloat(q4Sorted[c].grade);
			}
			else if (parseFloat(q4Sorted[c].grade) == firstQ4) {
				htmlFirstQ4 = htmlFirstQ4 + "<br>" + q4Sorted[c].name;
				firstQ4 = parseFloat(q4Sorted[c].grade);
			}
    	}   	
    	else if (parseFloat(q4Sorted[c].grade) >= secondQ4 && parseFloat(q4Sorted[c].grade) < firstQ4) {
    		
    		if (parseFloat(q4Sorted[c].grade) > secondQ4) {
				htmlSecondQ4 = q4Sorted[c].name;
				secondQ4 = parseFloat(q4Sorted[c].grade);
			}
			else if (parseFloat(q4Sorted[c].grade) == secondQ4) {
				htmlSecondQ4 = htmlSecondQ4 + "<br>" + q4Sorted[c].name;
				secondQ4 = parseFloat(q4Sorted[c].grade);
			} 	
    	}
    	else if (parseFloat(q4Sorted[c].grade) >= thirdQ4 && parseFloat(q4Sorted[c].grade) < secondQ4) {
    		
    		if (parseFloat(q4Sorted[c].grade) > thirdQ4) {
				htmlThirdQ4 = q4Sorted[c].name;
				thirdQ4 = parseFloat(q4Sorted[c].grade);
			}
			else if (parseFloat(q4Sorted[c].grade) == thirdQ4) {
				htmlThirdQ4 = htmlThirdQ4 + "<br>" + q4Sorted[c].name;
				thirdQ4 = parseFloat(q4Sorted[c].grade);
			} 	
    	}	
    }
	// Gold/Silver/Bronze are calculated for Quiz 5
    for (c=0; c < q5Sorted.length; c++) {
    	
    	if (parseFloat(q5Sorted[c].grade) >= firstQ5) {
    		
    		if (parseFloat(q5Sorted[c].grade) > firstQ5) {
				htmlFirstQ5 = q5Sorted[c].name;
				firstQ5 = parseFloat(q5Sorted[c].grade);
			}
			else if (parseFloat(q5Sorted[c].grade) == firstQ5) {
				htmlFirstQ5 = htmlFirstQ5 + "<br>" + q5Sorted[c].name;
				firstQ5 = parseFloat(q5Sorted[c].grade);
			}
    	}   	
    	else if (parseFloat(q5Sorted[c].grade) >= secondQ5 && parseFloat(q5Sorted[c].grade) < firstQ5) {
    		
    		if (parseFloat(q5Sorted[c].grade) > secondQ5) {
				htmlSecondQ5 = q5Sorted[c].name;
				secondQ5 = parseFloat(q5Sorted[c].grade);
			}
			else if (parseFloat(q5Sorted[c].grade) == secondQ5) {
				htmlSecondQ5 = htmlSecondQ5 + "<br>" + q5Sorted[c].name;
				secondQ5 = parseFloat(q5Sorted[c].grade);
			} 	
    	}
    	else if (parseFloat(q5Sorted[c].grade) >= thirdQ5 && parseFloat(q5Sorted[c].grade) < secondQ5) {
    		
    		if (parseFloat(q5Sorted[c].grade) > thirdQ5) {
				htmlThirdQ5 = q5Sorted[c].name;
				thirdQ5 = parseFloat(q5Sorted[c].grade);
			}
			else if (parseFloat(q5Sorted[c].grade) == thirdQ5) {
				htmlThirdQ5 = htmlThirdQ5 + "<br>" + q5Sorted[c].name;
				thirdQ5 = parseFloat(q5Sorted[c].grade);
			} 	
    	}	
    }
	// Gold/Silver/Bronze are calculated for Quiz 6
    for (c=0; c < q6Sorted.length; c++) {
    	
    	if (parseFloat(q6Sorted[c].grade) >= firstQ6) {
    		
    		if (parseFloat(q6Sorted[c].grade) > firstQ6) {
				htmlFirstQ6 = q6Sorted[c].name;
				firstQ6 = parseFloat(q6Sorted[c].grade);
			}
			else if (parseFloat(q6Sorted[c].grade) == firstQ6) {
				htmlFirstQ6 = htmlFirstQ6 + "<br>" + q6Sorted[c].name;
				firstQ6 = parseFloat(q6Sorted[c].grade);
			}
    	}   	
    	else if (parseFloat(q6Sorted[c].grade) >= secondQ6 && parseFloat(q6Sorted[c].grade) < firstQ6) {
    		
    		if (parseFloat(q6Sorted[c].grade) > secondQ6) {
				htmlSecondQ6 = q6Sorted[c].name;
				secondQ6 = parseFloat(q6Sorted[c].grade);
			}
			else if (parseFloat(q6Sorted[c].grade) == secondQ6) {
				htmlSecondQ6 = htmlSecondQ6 + "<br>" + q6Sorted[c].name;
				secondQ6 = parseFloat(q6Sorted[c].grade);
			} 	
    	}
    	else if (parseFloat(q6Sorted[c].grade) >= thirdQ6 && parseFloat(q6Sorted[c].grade) < secondQ6) {
    		
    		if (parseFloat(q6Sorted[c].grade) > thirdQ6) {
				htmlThirdQ6 = q6Sorted[c].name;
				thirdQ6 = parseFloat(q6Sorted[c].grade);
			}
			else if (parseFloat(q6Sorted[c].grade) == thirdQ6) {
				htmlThirdQ6 = htmlThirdQ6 + "<br>" + q6Sorted[c].name;
				thirdQ6 = parseFloat(q6Sorted[c].grade);
			} 	
    	}	
    }
}
// Most Improved
// Calculates and keeps track of the most improved team for each Quiz
function mostImproved(tName,q1A,q2A,q3A,q4A,q5A,q6A) {


	if (parseFloat(q2A) > parseFloat(q1A)) {
		
		if (parseFloat(q2A) > leadDiff1){
		
			htmlMI1 = tName;
			leadDiff1 = parseFloat(q2A)-parseFloat(q1A); 
		}		
	}
	else {
		htmlMI1 += "";
		}
		
	if (parseFloat(q3A) > parseFloat(q2A)) {
		
		if (parseFloat(q3A) > leadDiff2){
		
			htmlMI2 = tName;
			leadDiff2 = parseFloat(q3A)-parseFloat(q2A); 
		}		
	}
	else {
		htmlMI2 += "";
		}
	if (parseFloat(q4A) > parseFloat(q3A)) {
		
		if (parseFloat(q4A) > leadDiff3){
		
			htmlMI3 = tName;
			leadDiff3 = parseFloat(q4A)-parseFloat(q3A); 
		}		
	}
	else {
		htmlMI3 += "";
		}
	if (parseFloat(q5A) > parseFloat(q4A)) {
		
		if (parseFloat(q5A) > leadDiff4){
		
			htmlMI4 = tName;
			leadDiff4 = parseFloat(q5A)-parseFloat(q4A); 
		}		
	}
	else {
		htmlMI4 += "";
		}
	if (parseFloat(q6A) > parseFloat(q5A)) {
		
		if (parseFloat(q6A) > leadDiff5){
		
			htmlMI5 = tName;
			leadDiff5 = parseFloat(q6A)-parseFloat(q5A); 
		}		
	}
	else {
		htmlMI5 += "";
		}

 	return;
}


function BuildQuizTable(){
	
	var groups = APIObj["groups"] , 
		gradeobjs = APIObj["gradeobj"],
		html = "";
	var htmlGr = "";
	var htmlPer = "";
	var htmlMImp = "";
	
	// Prints out Header Row of the Table
	html += "<table id='rank'><tbody><tr class='header'><th>Groups</th> ";
				
		// header row
		for (var g = 1 ; g <= gradeobjs.length; g++) {
			html+= "<th>Quiz " + g + "</th>" ;  
			
			if (g == gradeobjs.length)
				html+= "</tr><tr class='space'></tr>";
		}
				
	
	// for each group
	for (var i = 0 ; i < groups.length; i++) {
		var grp = groups[i].Name;
		var sid_ar = groups[i].Enrollments; // array of SIDs in group
		var grpMembers = groups[i].Name;
		
		var ttlGrp1 = sid_ar.length;
		var ttlGrp2 = sid_ar.length;
		var ttlGrp3 = sid_ar.length;
		var ttlGrp4 = sid_ar.length;
		var ttlGrp5 = sid_ar.length;
		var ttlGrp6 = sid_ar.length;
		
		var totalQuiz1 = 0;
		var totalQuiz2 = 0; 
		var totalQuiz3 = 0; 
		var totalQuiz4 = 0; 
		var totalQuiz5 = 0;
		var totalQuiz6 = 0;
		
		var htmlGr1 = "";
		var htmlGr2 = ""; 
		var htmlGr3 = ""; 
		var htmlGr4 = ""; 
		var htmlGr5 = "";
		var htmlGr6 = "";

		var grPercent = 0;
		
		htmlGr = "";
		htmlPer = "";
		htmlMImp = "";
		grpQuizes = [];
		
		//html += "<table class='quiz' align='center'><tr class='top'><th align='left' width = '50'> Groups </th> ";
		/*
		// header row
		for (var g = 1 ; g <= gradeobjs.length; g++) {
			//html+= "<th style='width: 95px'>Quiz " + g + "</th>" ;  
			
			if (g == gradeobjs.length)
				html+= "</tr>";
		}
		*/
		//html += "<tr><td> " + "Group " + (i+1) +" </td>";

		
		
		
		// for each student
		for (var s = 0 ; s < sid_ar.length ; s++) {
			var sid = sid_ar[s];
			
						
			//htmlGr += "<tr><td>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";

			// for each quiz
			for (var j = 0 ; j < gradeobjs.length; j++) {
				
				var k = "grp" + i + "_sid" + s + "_q" + j;
				score = APIObj[k]["PointsNumerator"];
				
				/*
				// header row
				if (i = 0) {

					html+= "<th>Quiz " + g + " (" + (APIObj[k]["PointsDenominator"])")</th>" ;  
			
					if (g == gradeobjs.length)
						html+= "</tr><tr class='space'></tr>";
				}
				*/
								
				// Storing Individual Quiz Scores for HTML Output
				htmlPer = "<td align='center'>" + (Math.round((APIObj[k]["PointsNumerator"])/(APIObj[k]["PointsDenominator"])*100)) + "</td>";
				htmlPerZero = "<td align='center'>N/A</td>";	

				//htmlPer = "<td>" + (score/(APIObj[k]["PointsDenominator"])*100) + "</td>";	

				// Switch statement adding a score to a total quiz score for each group
				switch (j)
					{
						case 0:
						if (score != null){
							totalQuiz1 += score;
							grpQuizes.push(score);
							htmlGr1 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";
							break;
						}
						else {
							ttlGrp1 -= 1;
							htmlGr1 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPerZero + "</tr>";
							break;
						}
						case 1:
						if (score != null){
							totalQuiz2 += score;
							grpQuizes.push(score);
							htmlGr2 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";
							break;
						}
						else {
							ttlGrp2 -= 1;
							htmlGr2 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPerZero + "</tr>";
							break;
						}
						
						case 2:
						if (score != null){
							totalQuiz3 += score;
							grpQuizes.push(score);
							htmlGr3 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";
							break;
						}
						else {
							ttlGrp3 -= 1;
							htmlGr3 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPerZero + "</tr>";
							break;
						}
						
						
						case 3:
						if (score != null){
							totalQuiz4 += score;
							grpQuizes.push(score);
							htmlGr4 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";
							break;
						}
							else {
							ttlGrp4 -= 1;
							htmlGr4 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPerZero  + "</tr>";
							break;
						}
						
						case 4:
						if (score != null){
							totalQuiz5 += score;
							grpQuizes.push(score);
							htmlGr5 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";
							break;
						}
						else {
							ttlGrp5 -= 1;
							htmlGr5 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPerZero + "</tr>";
							break;
						}
						
						case 5:
						if (score != null){ 
							totalQuiz6 += score;
							grpQuizes.push(score);
							htmlGr6 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";
							break;
						}
						else {
							ttlGrp6 -= 1;
							htmlGr6 += "<tr><td align='center'>" + getStudentName(sid) + "</td>" + htmlPerZero + "</tr>";
							break;
						}
					}
					
				if (j == gradeobjs.length - 1)
					html+= "</tr>";
			}
			// Working
			//htmlGr += "<tr><td>" + getStudentName(sid) + "</td>" + htmlPer + "</tr>";

		}
		
		//Calculating Team Averages
		var quiz1Avg = totalQuiz1 / ttlGrp1;
		var quiz2Avg = totalQuiz2 / ttlGrp2;
		var quiz3Avg = totalQuiz3 / ttlGrp3;
		var quiz4Avg = totalQuiz4 / ttlGrp4;
		var quiz5Avg = totalQuiz5 / ttlGrp5;
		var quiz6Avg = totalQuiz6 / ttlGrp6;
		
		// push avg of each groups score into array
		storedQuiz1Avg.push({name:groups[i].Name, grade:quiz1Avg});
		storedQuiz2Avg.push({name:groups[i].Name, grade:quiz2Avg});
		storedQuiz3Avg.push({name:groups[i].Name, grade:quiz3Avg});
		storedQuiz4Avg.push({name:groups[i].Name, grade:quiz4Avg});
		storedQuiz5Avg.push({name:groups[i].Name, grade:quiz5Avg});
		storedQuiz6Avg.push({name:groups[i].Name, grade:quiz6Avg});
		
		
		// Calculate Most Improved
		mostImproved(groups[i].Name,quiz1Avg ,quiz2Avg ,quiz3Avg ,quiz4Avg ,quiz5Avg ,quiz6Avg);
		// Calculate Top 3 for Each quiz		
			
		//Calculating Team Averages and displaying them
		html += " <tr> <td style='width: 95px' align='center'>"+ groups[i].Name + " </td>";
		html += " <td align='center' ><a class='tooltip' href='#'>"+ quiz1Avg.toFixed(1) +"<span><table class='result'><tbody><tr><th>Student</th><th>Score %</th></tr>" + htmlGr1 + "</tbody></table></span></a></td>";
		html += " <td align='center' ><a class='tooltip' href='#'>"+ quiz2Avg.toFixed(1) + "<span><table class='result'><tbody><tr><th>Student</th><th>Score %</th></tr>" + htmlGr2 + "</tbody></table></span></a></td>";
		html += " <td align='center' ><a class='tooltip' href='#'>"+ quiz3Avg.toFixed(1) + "<span><table class='result'><tbody><tr><th>Student</th><th>Score %</th></tr>" + htmlGr3 + "</tbody></table></span></a></td>";
		html += " <td align='center' ><a class='tooltip' href='#'>"+ quiz4Avg.toFixed(1) + "<span><table class='result'><tbody><tr><th>Student</th><th>Score %</th></tr>" + htmlGr4 + "</tbody></table></span></a></td>";
		html += " <td align='center' ><a class='tooltip' href='#'>"+ quiz5Avg.toFixed(1) + "<span><table class='result'><tbody><tr><th>Student</th><th>Score %</th></tr>" + htmlGr5 + "</tbody></table></span></a></td>";
		html += " <td align='center' ><a class='tooltip' href='#'>"+ quiz6Avg.toFixed(1) + "<span><table class='result'><tbody><tr><th>Student</th><th>Score %</th></tr>" + htmlGr6 + "</tbody></table></span></a></td>";
		
	}
	
	//Sort Quizes 1-6 into Arrays
	sortTop3();
	
    // Reverse Quizses 1-6 to list in decending order starting from Highest Quiz Average
    q1Sorted.reverse();
    q2Sorted.reverse();
    q3Sorted.reverse();
    q4Sorted.reverse();
    q5Sorted.reverse();
    q6Sorted.reverse();
    
    // Assign Teams to Gold/Silver/Bronze 
    assignTop3();
	
	
	// Top 3 Teams
	html += " <tr class='first'><th><img src='image/first.png' alt='Gold' height='87' width='86'></th><td align='center'>" + htmlFirstQ1 + "</td><td align='center'>" + htmlFirstQ2 + "</td><td align='center'>" + htmlFirstQ3 + "</td><td align='center'>" + htmlFirstQ4 + "</td><td align='center'>" + htmlFirstQ5 + "</td><td align='center'>" + htmlFirstQ6 + "</td></tr>";
	html += " <tr class='second'><th><img src='image/second.png' alt='Silver' height='87' width='86'></th><td align='center'>" + htmlSecondQ1 + "</td><td align='center'>" + htmlSecondQ2 + "</td><td align='center'>" + htmlSecondQ3 + "</td><td align='center'>" + htmlSecondQ4 + "</td><td align='center'>" + htmlSecondQ5 + "</td><td align='center'>" + htmlSecondQ6 + "</td></tr>";
	html += " <tr class='third'><th><img src='image/third.png' alt='Bronze' height='87' width='86'></th><td align='center'>" + htmlThirdQ1 + "</td><td align='center'>" + htmlThirdQ2 + "</td><td align='center'>" + htmlThirdQ3 + "</td><td align='center'>" + htmlThirdQ4 + "</td><td align='center'>" + htmlThirdQ5 + "</td><td align='center'>" + htmlThirdQ6 + "</td></tr>";
	
	// Most Improved
	html += " <tr class='mi'><th><img src='image/most_improved.png' alt='Gold' height='87' width='86'></th><td align='center'>-</td><td>"+ htmlMI1 +"</td><td>"+ htmlMI2 +"</td><td>"+ htmlMI3 +"</td><td>"+ htmlMI4 +"</td><td>"+ htmlMI5 +"</td></tr>";
	
	// Clost Table Tag and Display Table
	html += "</table><br />";
	$("#leaderOutput").html(html);
	
		
		//$('#testarea').append(grpQuizes.length);

	
	
}


function david() {
			/*
			var test1 = getStudentName(345293);
			var test2 = getStudentName(419800);
		
			$('#testarea').append(" " + test1 + " " + test2);
		*/
}