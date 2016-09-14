//node modules set up

var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var Promise = require('bluebird');

//set up client request variables
var tweets = 'statuses/user_timeline';
var friends = 'friends/list';
var messages = 'direct_messages';
var BrokenWingsDev = 'users/show';

//array to hold promises and stringify data
var promises = [];
var stringify = [];


//set up the twitter client authentication
var client = new Twitter({
  consumer_key: 
  consumer_secret: 
  access_token_key: 
  access_token_secret: 
});


//function to promise all requests in the promises array and render the index.jade template
function PromiseGetRequests(array) {
		router.get('/', function(req, res, next) {
			//promise all promises, then do something with the array of objects (results)
			Promise.all(array).then(function (results) {

			//stringify the results array so we can read it and interpret the array of objects
				for(var i = 0; i < results.length; i++) {
					stringify.push(JSON.stringify(results[i]));
				}
			console.log(stringify);


//GetProfileInfo variables

		var ProfileImage = results[3].ProfileImage;
		var ScreenName = results[3].ScreenName;
		var Name = results[3].Name;

//GetTweets Variables

		var tweetText = results[0].tweetText;
		var Retweets = results[0].Retweets;
		var TotalLikes = results[0].TotalLikes;
		var DateTweeted = results[0].DateTweeted;

//GetFriends Variables

		var ProfileImages = results[1].ProfileImages;
		var FriendNames = results[1].FriendNames;
		var FriendScreenNames = results[1].FriendScreenNames;

//GetMessages Variables

		var MessageText = results[2].MessageText;
		var DateSent = results[2].DateSent;
		var SentBy = results[2].SentBy;
		var SentByImage = results[2].SentByImage;

  		res.render('index', { ScreenName: ScreenName,
  							  ProfileImage: ProfileImage,
  							  Name: Name,
  							  tweetText: tweetText,
  							  Retweets: Retweets,
  							  TotalLikes: TotalLikes,
  							  DateTweeted: DateTweeted,
  							  ProfileImages: ProfileImages,
  							  FriendNames: FriendNames,
  							  FriendScreenNames: FriendScreenNames,
  							  MessageText: MessageText,
  							  DateSent: DateSent,
  							  SentBy: SentBy,
  							  SentByImage: SentByImage






  										}); //end res.render
}); //end promise all

	}); //end  router.get

} //end PromiseGetRequests


//function to get tweets
function GetTweets(getrequest) {
	return new Promise(function (resolve, reject) {
		client.get(getrequest, {screen_name: 'BrokenWingsDev', count:'5'}, function(error, tweets, response) {
		if (!error) {
			var tweetText = [];
			var Retweets = [];
			var TotalLikes = [];
			var DateTweeted = [];
			//add the appropriate information from recent tweets into arrays
			for(var i = 0; i < tweets.length; i++) {
			tweetText.push(tweets[i].text);
			Retweets.push(tweets[i].retweet_count);
			TotalLikes.push(tweets[i].favorite_count);
			DateTweeted.push(tweets[i].created_at);
		}
		//resolve on tweets info object
		resolve({

				tweetText: tweetText, 
				Retweets: Retweets,
				TotalLikes: TotalLikes,
				DateTweeted: DateTweeted

				}); //end resolve

			} //end if

		}); //end client.get

	});  //end new Promise

} //end GetTweets


//function to get recent friends
function GetFriends(getrequest) {
	return new Promise(function (resolve, reject){
		client.get(getrequest, {screen_name: 'BrokenWingsDev', count:'5'}, function(error, friends, response) {
		if (!error) {	
			var ProfileImages = [];
			var FriendNames = [];
			var FriendScreenNames = [];
			//add the appropriate information from recent friends to arrays 
			for(var i = 0; i < friends.users.length; i++) {
				ProfileImages.push(friends.users[i].profile_image_url);
				FriendNames.push(friends.users[i].name);
				FriendScreenNames.push(friends.users[i].screen_name);
			}
			//resolve on object with key value pairs from the data above
			resolve({

					ProfileImages: ProfileImages,
					FriendNames: FriendNames,
					FriendScreenNames: FriendScreenNames

					}); //end resolve

			} //end if


		}); //end client.get



	}); //end new Promise

} //end GetFriends



//function to get messages
function GetMessages(getrequest) {
	return new Promise(function (resolve, reject) {
		client.get(getrequest, {screen_name: 'BrokenWingsDev', count:'5'}, function(error, messages ,response) {
		if (!error) {	
			var MessageText = [];
			var DateSent = [];
			var SentBy = [];
			var SentByImage = [];
			//grab message information and store it into arrays above
			for (var i = 0; i < messages.length; i++) {
				MessageText.push(messages[i].text);
				DateSent.push(messages[i].created_at);
				SentBy.push(messages[i].sender_screen_name);
				SentByImage.push(messages[i].sender.profile_image_url);
			}
			//resolve on object with key value pairs from the message data
			resolve({

					MessageText: MessageText,
					DateSent: DateSent,
					SentBy: SentBy,
					SentByImage: SentByImage

				}); //end resolve

			} //end if

		}); //end client.get



	}); //end promise


} //end GetMessages



//function to get profile information
function GetProfileInfo(getrequest) {
	return new Promise(function (resolve, reject) {
		client.get(getrequest, {screen_name: 'BrokenWingsDev'}, function(error, profileInfo, response){
		if (!error) {	
			var ProfileImage = profileInfo.profile_image_url;
			var ScreenName = profileInfo.screen_name;
			var Name = profileInfo.name;

			//resolve on profile info object
			resolve({

				ProfileImage: ProfileImage,
				ScreenName: ScreenName,
				Name: Name

				}); //end resolve

			} //end if

		}); //end client.get


	}); //end promise


} //end GetProfileInfo


//push client get functions into the promises array to promise all
promises.push(GetTweets(tweets));
promises.push(GetFriends(friends));
promises.push(GetMessages(messages));
promises.push(GetProfileInfo(BrokenWingsDev));


//promise all and render the index.jade template
PromiseGetRequests(promises);


module.exports = router;

