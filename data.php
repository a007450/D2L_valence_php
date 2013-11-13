<?php 
	session_start();
	$_SESSION['appId']= "4PYJNKimTAi0DyGCBazCEw";
	$_SESSION['appKey'] = "3GeMrXvyoZ-wPI3jRFRdBA";
	$_SESSION['host'] = "learn.bcit.ca";
	$_SESSION['port'] = 443;
	$_SESSION['scheme'] = 'https';  // must use https
	
	// enter default user ID/Key, this is your the (hidden) 'mega' user
	$_SESSION['userId'] = 'k5NOsx3JYM3447WaEp19AO';		
	$_SESSION['userKey'] = 'IBzfXNTS8yn2CXQgu7n57N';
	
<<<<<<< HEAD
	$_SESSION['orgUnit'] = "159492";  // enter org unit or "" to grab the orgUnit from course home pg url
	$_SESSION['groupcatId'] = "57756";
=======
	// hard code org unit or use "" to grab the orgUnit from course home pg url
	$_SESSION['orgUnit'] = "159492";  // this is the OU id for gamefication course.
	$_SESSION['groupcatId'] = "57756"; // the is the group category ID for the groups
>>>>>>> faebad71492b476b13a34415124700b75e40288e
	
	$host = $_SESSION['host'];
	$port = $_SESSION['port'];
	$scheme = $_SESSION['scheme'];
	$appId = $_SESSION['appId'];
	$appKey = $_SESSION['appKey'];
	$orgUnit = $_SESSION['orgUnit'];
	$groupcatId = $_SESSION['groupcatId'];
	
	$authContextFactory = new D2LAppContextFactory();
	$authContext = $authContextFactory->createSecurityContext($appId, $appKey);
	$hostSpec = new D2LHostSpec($host, $port, $scheme);
		
	$opContext = $authContext->createUserContextFromHostSpec($hostSpec, null, null, $_SERVER["REQUEST_URI"]);
	
	if ($orgUnit == "") {
		// current org unit ---if widget is on home page the url would be 
		// https://learn.bcit.ca/d2l/home/{OUId}
		$url = $_SERVER["HTTP_REFERER"];
		$orgUnit = substr($url, 5+strpos($url, "home/"));
	}
		
	if ($opContext!=null) {
	    // user id not set, get user id, key
	    $userId = $opContext->getUserId();
	    $userKey = $opContext->getUserKey();
	    $_SESSION['userId'] = $userId;
	    $_SESSION['userKey'] = $userKey;
	} elseif (isset($_SESSION['userId'])) {
	    // use default IDs 
	    $userId = $_SESSION['userId'];
	    if (isset($_SESSION['userKey'])) {
	        $userKey = $_SESSION['userKey'];
	    } else {
	        $userKey = '';
	    }
	} else {
	    $userId = '';
	    $userKey = '';	
	}

	session_write_close();
?>
