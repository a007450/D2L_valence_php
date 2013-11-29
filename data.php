<?php 
	session_start();
	$_SESSION['appId']= "4PYJNKimTAi0DyGCBazCEw";
	$_SESSION['appKey'] = "3GeMrXvyoZ-wPI3jRFRdBA";
	$_SESSION['host'] = "learn.bcit.ca";
	$_SESSION['port'] = 443;
	$_SESSION['scheme'] = 'https';
	
	$_SESSION['userId'] = '';
	$_SESSION['userKey'] = '';
	
	// default user ID (Master user)
	$_SESSION['defaultUserId'] = 'k5NOsx3JYM3447WaEp19AO';
	$_SESSION['defaultUserKey'] = 'IBzfXNTS8yn2CXQgu7n57N';
	
	// enter url of redirect pg after login
	$_SESSION["HTTP_REFERER"] = 'http://localhost/~vienna/D2L_valence_php/index2.php';  
	
	// enter org unit or use "" to grab the orgUnit from course home pg url
	// ONLY WORKS IF THE WIDGET IS EMBEDDED IN D2L COURSE HOME PAGE
	$_SESSION['orgUnit'] = "159492";   
	$_SESSION['groupcatId'] = "57756";
	
	session_write_close();
?>