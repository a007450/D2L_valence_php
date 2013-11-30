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

function Deauthenticate() {
    session_start();
    unset($_SESSION['userId']);
    unset($_SESSION['userKey']);
    session_write_close();
    header("location: index2.php");
}
function Authenticate(){
    
	session_start();
	//clear settings
	unset($_SESSION['userId']);
    unset($_SESSION['userKey']);
	
	$host = $_SESSION['host'];
	$port = $_SESSION['port'];
	$scheme = $_SESSION['scheme'];
	$appId = $_SESSION['appId'];
	$appKey = $_SESSION['appKey'];
	
	$redirectPage = $_SESSION["HTTP_REFERER"];
	
	session_write_close();
	
	$authContextFactory = new D2LAppContextFactory();
	$authContext = $authContextFactory->createSecurityContext($appId, $appKey);
	$hostSpec = new D2LHostSpec($host, $port, $scheme);
	$url = $authContext->createUrlForAuthenticationFromHostSpec($hostSpec, $redirectPage);
    header("Location: $url");

}
?>
