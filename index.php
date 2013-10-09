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
 	<div id="output">Loading ... </div>
 
    
</body>
<script type="text/javascript">
	var host, port, scheme, targetUrl, orgUnit;
    
    var urlReflp = "/d2l/api/lp/1.3/", urlRefle = "/d2l/api/le/1.3/";
    
    $( document ).ready( function() {
    	
    	var authenticated = <?php echo "'".$userId."'"; ?>;
    	
    	host = <?php echo "'".$host."'"; ?>,
    	port = <?php echo "'".$port."'"; ?>,
    	scheme = <?php echo "'".$scheme."'"; ?>,
    	targetUrl = <?php echo "'".$targetUrlRef."'"; ?>,
    	orgUnit = <?php echo "'".$orgUnit."'"; ?>; 
    	groupcatId = <?php echo "'".$groupcatId."'"; ?>;
    	
    	Init(authenticated);
    });
   
</script>
</html>