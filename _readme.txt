Vienna Ly
Nov 28, 2013
BCIT
Prototype - proof of concept for authentication to D2L

data.php -- specifies all initial session vars --
for scalability, all D2L parameters (appID, key…course info…etc.) should be defined in one place for easy updates/portability to other courses

index.php -- initial landing page -- 
No UI implemented, just calls Authenticate() 

authenticateUser.php  -- handles authentication calls to D2L --
Loads Valence libs, data.php
Creates security context through Valence api
Redirects to index2.php

index2.php  -- handles api requests based on authenticated session vars --
example demonstrating how to handle session vars to make requests

doAPIRequest.js 
Ajax call method:
doAPIRequest(host, port, scheme, query, method, data, key)  	
	host, port, scheme, query -- from session vars
	key -- 	string reference to be for APIObj
 		returned objects stored in APIObj[key]


doRequest.php  -- handles ajax requests to D2L --
creates new security context (Valence API)
determines which userId/key to use to make request (default or user)
	default -- full permissions	
	user -- limited permissions 