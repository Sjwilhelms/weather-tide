# Weather and Tide Project

Two users live at the coast and want to plan their days off.

User A likes to fish. When the weather is fine and the tide is high is a good time for them to go fishing.

User B likes to mudlark. When the weather is fine and the tide is low is a good time for them to go mudlarking.

User A wants to get fresh worms for bait. When the weather is rainy and the tide is low is a good time for them to go worming.

This project will access Weather, Tide, Geocoding APIs.

The users will input their schedule and the optimum conditions for their hobby.

## Anticipated Error Cases

Many cities share a name (eg. Berlin).

Many cities are not coastal

Tide API's are an unknown quantity at present

## weatherapp 0.01 rudimentary weather app that makes api calls to fetch info

## weatherapp 0.02 add caching for api daya - call cache instead

Reducing uneccessary API calls

## pseudocode for checking the cache

take user input

how old is the cache
is there a cache

if there is a valid cache

else get new data
overwrite cache

use data from the cache

display the data

## issues

the getAPI functions only care about the cacheAge. need conditions for overwriting in the case of a different seach

## to do

store previous results on the front screen
append children to an empty list
log action

if cache.name matches the userinput
log result

if exact match call the cache
else make the api call and overwrite
log result









