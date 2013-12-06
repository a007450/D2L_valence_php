<?php
	require_once 'libsrc/D2LAppContextFactory.php';
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
	$userId = 'no id';
	$userKey = 'no key';
	
	if (!isset($_SESSION['userId']) || !isset($_SESSION['userKey'])) {
		$authContextFactory = new D2LAppContextFactory();
		$authContext = $authContextFactory->createSecurityContext($appId, $appKey);
		$hostSpec = new D2LHostSpec($host, $port, $scheme);
		$opContext = $authContext->createUserContextFromHostSpec($hostSpec, null, null, $_SERVER["REQUEST_URI"]);
	
		if ($opContext!=null) {
		    $userId = $opContext->getUserId();
		    $userKey = $opContext->getUserKey();
		} else if (isset($_GET['x_a']) && isset($_GET['x_b'])) {
			$userId = $_GET["x_a"];
			$userKey = $_GET["x_b"];
		} else {
			$userId = '000';
			$userKey = '000';
		    throw new Exception('PROBLEM GETTING USERID, KEY...not set' );
		}
		
		
	}else {
		$userId = '001';
		$userKey = '001';
	    throw new Exception('PROBLEM GETTING USERID, KEY...set?' );
	}
	
	$_SESSION['userId'] = $userId;
	$_SESSION['userKey'] = $userKey;
		
	if (!$orgUnit) {
		// --- ONLY WORKS if widget is on d2l course home page-- grabs from URL 
		// https://learn.bcit.ca/d2l/home/{OUID}
		$url = $_SERVER["HTTP_REFERER"];
		$_SESSION['orgUnit'] = substr($url, 5+strpos($url, "home/"));
		$_orgUnit = ($_SESSION['orgUnit'])?  $_SESSION['orgUnit'] : "159492";
		
	}
	
	
	
	// build query strings
	$whoami = $urlReflp . "users/whoami";
    $classlist = $urlRefle . $_orgUnit . "/classlist/";
    $groups = $urlReflp . $_orgUnit . "/groupcategories/" . $_groupcatId . "/groups/";
    $gradeobjs = $urlRefle . $_orgUnit . "/grades/";
	
	$sessionVars = array(
		'host' => $_host,
		'port' => $_port,
		'scheme' => $_scheme,
		'orgUnit' => $_orgUnit,
		'groupcatId' => $_groupcatId,
		'urlRefle' => $urlRefle,
		'whoami' => $whoami,
		'classlist' => $classlist, 
		'groups' => $groups, 
		'gradeobjs' => $gradeobjs,
		'userId' => $userId,
		'userKey' => $userKey,
		'opContext' => $opContext
		
	);
	
	session_write_close();
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	
<head>
	<meta charset="UTF-8">
	
	<script src="jquery/jquery-latest.js" type="text/javascript"></script>
	<script src="jquery/jquery.tablesorter.js" type="text/javascript"></script>
	<script src="jquery/jquery.metadata.js" type="text/javascript"></script>
	
	<link href="css/tablestyle.css" type="text/css" rel="stylesheet">
	<link href="css/default.css" type="text/css" rel="stylesheet">
	
</head>
<body>
	<div id="leaderboard_container" >	
		<table id="table_scores" class="tablesorter"> 
		<thead> 
			<tr> 
			    
			</tr> 
		</thead>
		<tbody>
		</tbody> 
		</table>
		
		<table id="table_badges" > 
		<thead> 
			<tr> 
			    
			</tr> 
		</thead>
		<tbody>
		</tbody> 
		</table>
		
	</div>	
	<div id="output">Loading data...</div>
</body>
	<script src="doAPIRequest.js"></script>
	<script type="text/javascript">
		$( document ).ready( function() {
			$("#table_scores").tablesorter();
			
			var session = <?php echo json_encode($sessionVars); ?>;			
				
			// jquery $.ajax calls
			var host = session.host;
			var port = session.port;
			var scheme = session.scheme;
			console.log(session);
			//listen for ajax complete
			$.when( 
				doAPIRequest(host, port, scheme, <?php echo "'".$whoami."'" ?>, 'GET', '', "whoami"),
	    		doAPIRequest(host, port, scheme, <?php echo "'".$groups."'" ?>, 'GET', '', "groups"),
				doAPIRequest(host, port, scheme, <?php echo "'".$gradeobjs."'" ?>, 'GET', '', "gradeobjs"),
				doAPIRequest(host, port, scheme, <?php echo "'".$classlist."'" ?>, 'GET', '', "classlist")
	    	).done( function(){	
				// aftert all ajax calls done... check returned objects stored in APIObj
				console.log(APIObj);
	    		TableHeader("#table_scores");
	    		ManageObjs(session);	
	    	});	 	
	    	
	    	
			 	
		});
	</script>
	
</html>