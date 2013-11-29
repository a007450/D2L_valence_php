<?php
	//require_once 'libsrc/D2LAppContextFactory.php';
	$_host; $_port; $_scheme; $_targetUrl; $_orgUnit;
    
    $urlReflp = "/d2l/api/lp/1.3/"; 
    $urlRefle = "/d2l/api/le/1.3/";
	
	session_start();
	
	// retrieving session vars
	$_host = $_SESSION['host'];
	$_port = $_SESSION['port'];
	$_scheme = $_SESSION['scheme'];
	$_appId = $_SESSION['appId'];
	$_appKey = $_SESSION['appKey'];
	$_orgUnit = $_SESSION['orgUnit'];
	$_groupcatId = $_SESSION['groupcatId'];
	$_SESSION['userId'] =  $_GET["x_a"];
	$_SESSION['userKey'] =  $_GET["x_b"];
	
	session_write_close();
	
	// build query strings
	$whoami = $urlReflp . "users/whoami";
    //$enrollments = $urlReflp . "enrollments/myenrollments/";
    $classlist = $urlRefle . $_orgUnit . "/classlist/";
    $groups = $urlReflp . $_orgUnit . "/groupcategories/" . $_groupcatId . "/groups/";
    $gradeobjs = $urlRefle . $_orgUnit . "/grades/";
	
	$ar_queries = array(
		'classlist' => $classlist, 
		'groups' => $groups, 
		'gradeobjs' => $gradeobjs
	);
	
	if ($orgUnit == "") {
		// --- ONLY WORKS if widget is on d2l course home page-- grabs from URL 
		// https://learn.bcit.ca/d2l/home/{OUID}
		$url = $_SERVER["HTTP_REFERER"];
		$_SESSION['orgUnit'] = substr($url, 5+strpos($url, "home/"));
	}
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	
<head>
	<meta charset="UTF-8">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type = "text/javascript"></script>
	<script src="doAPIRequest.js"></script>
	
</head>
<body>
	<div id="output">	</div>
		
</body>

	<script type="text/javascript">
		$( document ).ready( function() {
			// jquery $.ajax calls

			var host = <?php echo "'".$_host."'" ?>;
			var port = <?php echo "'".$_port."'" ?>;
			var scheme = <?php echo "'".$_scheme."'" ?>;

			var obj_queries = <?php echo json_encode($ar_queries); ?>;
			
			//listen for ajax complete
			$.when( 
				doAPIRequest(host, port, scheme, <?php echo "'".$whoami."'" ?>, 'GET', '', "whoami"),
	    		doAPIRequest(host, port, scheme, <?php echo "'".$groups."'" ?>, 'GET', '', "groups"),
				doAPIRequest(host, port, scheme, <?php echo "'".$gradeobjs."'" ?>, 'GET', '', "gradeobjs")
	    		
	    	).done( function(){	
	    		
				// aftert all ajax calls done... check returned objects stored in APIObj
				
	    		console.log(APIObj);
	    		//var s = APIObj["whoami"].FirstName + " " + APIObj["whoami"].LastName ;
	    		//$("#output").html("Current User: " + s);	
	    		
	    	});	 	
	    	
			 	
		});
	</script>
	
</html>