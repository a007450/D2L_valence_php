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

session_start();

/**
 * App ID, APP key, user ID and user key should all be unavailable to the end user of the application in real world scenarios
 */
if (isset($_SESSION['appId'])) {
    $appId = $_SESSION['appId'];
} else {
    // default Application ID
    $appId = '4PYJNKimTAi0DyGCBazCEw';
    $_SESSION['appId']= $appId;
}

if (isset($_SESSION['appKey'])) {
    $appKey = $_SESSION['appKey'];
} else {
    // default Application key
    $appKey = '3GeMrXvyoZ-wPI3jRFRdBA';
    $_SESSION['appKey'] = $appKey;
}

if (isset($_SESSION['host'])) {
    $host = $_SESSION['host'];
} else {
    $host="learn.bcit.ca";
}

if (isset($_SESSION['port'])) {
    $port = $_SESSION['port'];
} else {
    $port=443;
}

if (isset($_SESSION['scheme'])) {
    $scheme = $_SESSION['scheme'];
} else {
    $scheme = 'https';
}

$authContextFactory = new D2LAppContextFactory();
$authContext = $authContextFactory->createSecurityContext($appId, $appKey);
$hostSpec = new D2LHostSpec($host, $port, $scheme);
$opContext = $authContext->createUserContextFromHostSpec($hostSpec, null, null, $_SERVER["REQUEST_URI"]);

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
    <title>Desire2Learn Auth SDK Sample</title>
    <style type = "text/css">
    	body{
    		font-size: 11px;
    		font-family: Arial;
    	}
        table.plain
        {
          border-color: transparent;
          border-collapse: collapse;
        }

        table td.plain
        {
          padding: 5px;
          border-color: transparent;
        }

        table th.plain
        {
          padding: 6px 5px;
          text-align: left;
          border-color: transparent;
        }

        tr:hover
        {
            background-color: transparent !important;
        }

        .error
        {
            color: #FF0000;
        }
    </style>
    <script src="sample.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type = "text/javascript"></script>
</head>
<body>
    <span id="errorField1" class="error" hidden="true">Error: </span><span id="errorField2"></span>
    <form method="get" action="authenticateUser.php" id="configForm">
    <input type="submit" name="authBtn" value="Load Defaults" id="resetButton" />
    <hr />
    <table>
        <tr>
            <td>
                <b>Host: </b>
            </td>
            <td>
                <input name="hostField" type="text" style="width:20em" value="<?php echo $host; ?>" id="hostField" />
            </td>
            <td>
                <b>Port:</b>
            </td>
            <td>
                <input name="portField" type="text" style="width:20em" value="<?php echo $port; ?>" id="portField" />
            </td>
            <td>
                <input id="schemeField" type="checkbox" name="schemeField" <?php echo $scheme == 'https' ? 'checked="true"' : '';?> />
                HTTPS
            </td>
        </tr>
        <tr>
            <td>
                <b>App ID:</b>
            </td>
            <td>
                <input name="appIDField" type="text" style="width:20em" value="<?php echo $appId; ?>" id="appIDField" />
            </td>
            <td>
                <b>App Key:</b>
            </td>
            <td>
                <input name="appKeyField" type="text" style="width:20em" value="<?php echo $appKey; ?>" id="appKeyField" />
            </td>
        </tr>
    </table>
    <div id="userDiv">
        <br />
        <span>This information is returned by the authentication server and is valid only for this application:</span>
        <table>
            <tr>
                <td>
                    <b>User ID:</b>
                </td>
                <td>
                    <input type="text" name="userIDField" id="userIDField" style="width:20em" value="<?php echo $userId; ?>" />
                </td>
                <td>demo user 01 ID: vblE-N5AckOFgjRSeHLr-v</td>
            </tr>
            <tr>
                <td>
                    <b>User Key:</b>
                </td>
                <td>
                    <input type="text" name="userKeyField" id="userKeyField" style="width:20em" value="<?php echo $userKey; ?>" />
                </td>
                <td>demo user 01 key: pceDXSau_TLQubhAxiVW3f</td>
            </tr>
        </table>
        <input type="submit" name="authBtn" value="Deauthenticate" id="deauthBtn">
    </div>
    <input type="submit" name="authBtn" value="Authenticate" id="authenticateBtn" />
    <input type="button" id="manualBtn" value="Manually set credentials" onclick="setCredentials()" /><br>
    <span id="authNotice"> This will authenticate against currently logged in user.  Use Set Manual Credentials to authenticate against sample users. <br >
    	e.g. demo 01 user <br />SID: 314523<br />ID: vblE-N5AckOFgjRSeHLr-v <br />Key: pceDXSau_TLQubhAxiVW3f	
    </span><br />
    
    <input type="submit" name="authBtn" value="Save" id="manualAuthBtn" hidden=true />
    </form>

    <hr />
    <table>
        <tr>
            <td>
                <b>Examples:</b>
            </td>
            <td>
                <button type="button" onclick="exampleGetVersions()">
                    Get Versions</button> 
            </td>
            <td>lp, le current version is 1.3</td>
        </tr>
        <tr>
            <td></td>
            <td>
                <button type="button" onclick="exampleOrgUnit()">
                    OrgUnit</button> 
            </td>
            <td>OrgUnitId identifies the current D2L course. You'll need to check for it or preset it. <br />Current dev course OrgunitId: 159492 </td>
        </tr>
        <tr>
            <td></td>
            <td>
                <button type="button" onclick="exampleClasslist()">
                    Class List</button>
            </td>
            <td>Use this to get list of SIDs <a href="http://docs.valence.desire2learn.com/res/enroll.html#Enrollment.ClasslistUser" target="_balnk">Valence Reference</a></td>
        </tr>
        <tr>
            <td></td>
            <td>
                <button type="button" onclick="getGradeObjects()">
                    Grade Objects</button>
            </td>
            <td>To get GradeObjIds. To get values, loop through each GradeObjID for each SID, use: <br /> /d2l/api/le/(version#)/(OrgunitID)/grades/(GradeObjIds)/values/(SID)
			<br /> <a href="http://docs.valence.desire2learn.com/res/grade.html#id1" target="_balnk">Valence Reference</a>
			</td>
        </tr>
        <tr>
            <td></td>
            <td>
                <button type="button" onclick="exampleWhoAmI()">
                    WhoAmI</button>
            </td>
            <td>
            	returns current authenticated user
            </td>
        </tr>
    </table>
    <br />
    <b>Method:</b>&nbsp;
    <input value="GET" name="method" type="radio" id="GETField" checked="checked" onclick="hideData()" />GET
    &nbsp;
    <input value="POST" name="method" type="radio" id="POSTField" onclick="showData()" />POST
    &nbsp;
    <input value="PUT" name="method" type="radio" id="PUTField" onclick="showData()" />PUT
    &nbsp;
    <input value="DELETE" name="method" type="radio" id="DELETEField" onclick="hideData()" />DELETE<br />
    <b>Action:</b>&nbsp;<input name="actionField" type="text" id="actionField" style="width:400px;" />
    <input type="button" name="submitButton" value="Submit" id="submitButton" onclick="doAPIRequest()"/><br />
    <b id="dataFieldLabel">Data:</b><br />
    
    <textarea name="dataField" rows="2" cols="20" id="dataField" style="height:400px;width:600px;"></textarea>
    <br />
    <b id="responseFieldLabel" hidden=true>Response:</b><br />
    <textarea name="responseField" hidden=true rows="2" cols="20" id="responseField" style="height:400px;width:600px;">
</textarea><br />
    

</body>
<script type="text/javascript">
    function showData() {
        document.getElementById("dataFieldLabel").hidden = false;
        document.getElementById("dataField").hidden=false;
    }

    function hideData() {
        document.getElementById("dataFieldLabel").hidden = true;
        document.getElementById("dataField").hidden=true;
    }

    function exampleGetVersions() {
        hideData();
        document.getElementById("GETField").checked = true;
        document.getElementById("actionField").value = "/d2l/api/versions/";
    }

    function exampleWhoAmI() {
        hideData();
        document.getElementById("GETField").checked = true;
        document.getElementById("actionField").value = "/d2l/api/lp/1.3/users/whoami";
    }
	function exampleOrgUnit(){
		hideData();
        document.getElementById("GETField").checked = true;
        document.getElementById("actionField").value = "/d2l/api/lp/1.3/enrollments/myenrollments/";
	}
	function exampleClasslist() {
        hideData();
        /*requires authentication credentials w appropriate access*/
        document.getElementById("GETField").checked = true;
        document.getElementById("actionField").value = "/d2l/api/le/1.3/159492/classlist/";
    }
    function getGradeObjects() {
    	hideData();
        /*requires authentication credentials w appropriate access*/
        document.getElementById("GETField").checked = true;
        document.getElementById("actionField").value = "/d2l/api/le/1.3/159492/grades/";
    }
    function exampleCreateUser() {
        showData();
        document.getElementById("POSTField").checked = true;
        document.getElementById("actionField").value = "/d2l/api/lp/1.3/users/";
        document.getElementById("dataField").value = "{\n  \"OrgDefinedId\": \"<string>\",\n  \"FirstName\": \"<string>\",\n  \"MiddleName\": \"<string>\",\n  \"LastName\": \"<string>\",\n  \"ExternalEmail\": \"<string>|null\",\n  \"UserName\": \"<string>\",\n  \"RoleId\": \"<number>\",\n  \"IsActive\": \"<boolean>\",\n  \"SendCreationEmail\": \"<boolean>\"\n}";
    }

    function setCredentials() {
        document.getElementById("manualAuthBtn").hidden = false;
        document.getElementById("deauthBtn").hidden = true;
        document.getElementById("userDiv").hidden = false;
        document.getElementById("userIDField").hidden = false;
        document.getElementById("userKeyField").hidden = false;
        document.getElementById("manualBtn").hidden = true;
        document.getElementById("authenticateBtn").hidden = true;
        document.getElementById("authNotice").hidden = true;
    }

    hideData();

    if(document.getElementById("userIDField").value != "") {
        document.getElementById("userIDField").disabled = true;
        document.getElementById("userKeyField").disabled = true;
        document.getElementById("manualBtn").hidden = true;
        document.getElementById("authenticateBtn").hidden = true;
        document.getElementById("authNotice").hidden = true;
        document.getElementById("hostField").disabled = true;
        document.getElementById("portField").disabled = true;
        document.getElementById("appKeyField").disabled = true;
        document.getElementById("appIDField").disabled = true;
    } else {
        document.getElementById("userIDField").hidden = true;
        document.getElementById("userKeyField").hidden = true;
        document.getElementById("userDiv").hidden = true;
        document.getElementById("hostField").disabled = false;
        document.getElementById("portField").disabled = false;
        document.getElementById("appKeyField").disabled = false;
        document.getElementById("appIDField").disabled = false;
    }

    $("body").ajaxError(function(e, request) {
        console.log("AJAX error!");
    });
</script>
</html>