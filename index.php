<?php
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
	require_once 'libsrc/D2LAppContextFactory.php';	
	require_once 'data.php';
	
	session_start();
	$host = $_SESSION['host'];
	$port = $_SESSION['port'];
	$scheme = $_SESSION['scheme'];
	$appId = $_SESSION['appId'];
	$appKey = $_SESSION['appKey'];
	$orgUnit = $_SESSION['orgUnit'];
	
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>D2L Auth For App </title>
    <script src="doAPIRequest.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type = "text/javascript"></script>
</head>
<body id="appFrame">
	
	<form method="get" action="authenticateUser.php" id="configForm">
		<input type="submit" name="authBtn" value="Authenticate" id="authenticateBtn" />
	</form>
	 	
 	<div id="responseField"></div>
    
</body>
<script type="text/javascript">
	var host, port, scheme, targetUrl, orgUnit;
    
    var urlRef1 = "/d2l/api/lp/1.3/", urlRef2 = "/d2l/api/le/1.3/";
    
    $( document ).ready( function() {
    	
    	var authenticated = <?php echo "'".$userId."'"; ?>;
    	
    	host = <?php echo "'".$host."'"; ?>,
    	port = <?php echo "'".$port."'"; ?>,
    	scheme = <?php echo "'".$scheme."'"; ?>,
    	targetUrl = <?php echo "'".$targetUrlRef."'"; ?>,
    	orgUnit = <?php echo "'".$orgUnit."'"; ?>; 
    	
    	Init(authenticated);
    });
   
</script>
</html>