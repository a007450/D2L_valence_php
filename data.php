<?php 
	session_start();
	$_SESSION['appId']= "4PYJNKimTAi0DyGCBazCEw";
	$_SESSION['appKey'] = "3GeMrXvyoZ-wPI3jRFRdBA";
	$_SESSION['host'] = "learn.bcit.ca";
	$_SESSION['port'] = 443;
	$_SESSION['scheme'] = 'https';
	$_SESSION['userId'] = 'k5NOsx3JYM3447WaEp19AO';
	$_SESSION['userKey'] = 'IBzfXNTS8yn2CXQgu7n57N';
	
	$_SESSION['orgUnit'] = "159492";  // enter org unit or "" to grab the orgUnit from course home pg url
	$_SESSION['groupcatId'] = "57756";
	
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
		// https://learn.bcit.ca/d2l/home/7541
		$url = $_SERVER["HTTP_REFERER"];
		$orgUnit = substr($url, 5+strpos($url, "home/"));
	}
		
	if ($opContext!=null) {
	    $userId = $opContext->getUserId();
	    $userKey = $opContext->getUserKey();
	    $_SESSION['userId'] = $userId;
	    $_SESSION['userKey'] = $userKey;
	} elseif (isset($_SESSION['userId'])) {
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
