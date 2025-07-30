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

## weatherApp 0.03 three api calls, caches

we use tide data, geo data, and weather data

display it on the screen

## issues

utc timestamp format not ideal for display?

user select the date and convert that into UT and search for a match?

## pseudcode

take user input

for each i in data 
if i includes dateInput
display result

limit date input to next 7 days?

or simply show 7 days by default eliminating the need to sanitise user input

display previous searches overview from cache

## TO DO NEXT:

need to resolve main function error
show 7 day weather forecast
show 7 day tide timestamp
remove date user input

## TO DO LATER:

visualise the trend over the 7 days ahead



