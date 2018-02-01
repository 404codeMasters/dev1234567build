import { uiModules } from 'ui/modules';
import 'ngtweet';
import 'plugins/embedded_tweets_viewer/tweets_viewer_options_template.html';
import 'plugins/embedded_tweets_viewer/tweets_viewer_template.html';
import '../config.js';

define(function(require){
	var module = uiModules.get('embedded_tweets_viewer', ['kibana','elasticsearch','ngtweet']);
	
	module.service('client', function(esFactory){
		return esFactory({
				   	host: 'http://'+window.host+':'+window.port ,
				    log: 'trace'
		});
	});
     	
	module.controller('TweetsVisController', function ($scope, client , esFactory){
		$scope.showTweet=false;
		$scope.records = [];	//all the tweets I want to visualize
		$scope.showMessage=false;
		
		function goBack(){
			$scope.showTweet= true;
			return ;
		}
		
		//check if cluster is started
	  client.cluster.state({
     })
      .then(function (resp) {
      	console.log('status:200 , ok!');
        console.log(resp.cluster_name);
      })
      .catch(function (err) {
				console.log('ERROR : cluster is down!');
    });
  
  	// watch for the input parmameters change
		$scope.$watchGroup(['vis.params.tweets', 'vis.params.length'] , function (newVal , oldVal) {
		
			//reset visualization
			$scope.records = [];	
			$scope.showTweet=false ; 
			
			//insert current tweet id
			if(!newVal[0]){	
				return ;
			}
			$scope.records.push(newVal[0]);
			
			//how many tweets in the timeline
			var len = 10;  				//by default
			if(newVal[1] > 0){
				len = newVal[1];
			}
					
			var inReplyToScreanName ;
			var inReplyToStatusId ;
			var inReplyToUserId ;
			var retweetedScreanName ;
			var retweetedStatusId ;
			var retweetedUserId ;
						
			var counter =0;
			
			// search the tweet target in elasticsearch 		
			client.search({
					 	index: 'raw_data_italia',
					 	body: {
							"query": {
									"match": {  
										"status.id": $scope.records[0]
									}
								},
								"size" : 1
							}
						 } , function(error , response){
						 
						 			if(error || response.hits.hits.length == 0){
						 				console.log('tweet senza risposta');
						 				$scope.showMessage=true;
						 				return ;
						 			}
									
									inReplyToScreanName = response.hits.hits[0]._source.status.in_reply_to_screan_name;
									inReplyToStatusId = response.hits.hits[0]._source.status.in_reply_to_status_id ;
									inReplyToUserId = response.hits.hits[0]._source.status.in_reply_to_user_id ;
									retweetedScreanName = response.hits.hits[0]._source.status.retweeted_screen_name ;
									retweetedStatusId = response.hits.hits[0]._source.status.retweeted_status_id ;
									retweetedUserId = response.hits.hits[0]._source.status.retweeted_user_id ;
						});


						if(inReplyToStatusId){
							client.search({
							 	index: 'raw_data_italia',
							 	body: {
									"query": {
										"term": {
											"status.id": inReplyToStatusId
											}
										},
										"size": len
									}
								 } , function(error , response){
								 
								 			if(response.hits.hits.length)
													response.hits.hits.forEach(function (hit) {
													$scope.records.push(hit._source.id);
													counter++ ;
												});	
									});
						}

						len = len - counter ;
						if(len <= 0) goBack() ;
						
						if(inReplyToScreanName){
							client.search({
							 	index: 'raw_data_italia',
							 	body: {
									"query": {
										"term": {
											"user.screan_name": inReplyToScreanName
											}
										},
										"size": len
									}
								 } , function(error , response){
								 
								 			if(response.hits.hits.length)
													response.hits.hits.forEach(function (hit) {
													$scope.records.push(hit._source.id);
													counter++;
												});	
									});
						}

						len = len - counter ;
						if(len <= 0) goBack() ;
						
						if(inReplyToUserId){
							client.search({
							 	index: 'raw_data_italia',
							 	body: {
									"query": {
										"term": {
											"status.user_id": inReplyToUserId
											}
										},
										"size": len
									}
								 } , function(error , response){
								 
								 			if(response.hits.hits.length)
													response.hits.hits.forEach(function (hit) {
													$scope.records.push(hit._source.id);
													counter++;
												});	
									});
						}

						len = len - counter ;
						if(len <= 0) goBack() ;
						
						if(retweetedStatusId){
							client.search({
							 	index: 'raw_data_italia',
							 	body: {
									"query": {
										"term": {
											"status.id": retweetedStatusId
											}
										},
										"size": len
									}
								 } , function(error , response){
								 
								 			if(response.hits.hits.length)
													response.hits.hits.forEach(function (hit) {
													$scope.records.push(hit._source.id);
													counter++;
												});	
									});
						}
										
						len = len - counter ;
						if(len <= 0) goBack() ;
						
						if(retweetedScreanName){
							client.search({
							 	index: 'raw_data_italia',
							 	body: {
									"query": {
										"term": {
											"user.screen_name": retweetedScreanName
											}
										},
										"size": len
									}
								 } , function(error , response){
								 
								 			if(response.hits.hits.length)
													response.hits.hits.forEach(function (hit) {
													$scope.records.push(hit._source.id);
													counter++;
												});	
									});
						}
				
						len = len - counter;
						if(len <= 0) goBack() ;
						
						if(retweetedUserId){
							client.search({
							 	index: 'raw_data_italia',
							 	body: {
									"query": {
										"term": {
											"status.user_id": retweetedUserId
											}
										},
										"size": len
									}
								 } , function(error , response){
								 
								 			if(response.hits.hits.length)
													response.hits.hits.forEach(function (hit) {
													$scope.records.push(hit._source.id);
													counter++;
												});	
									});
						}
						
			$scope.showTweet=true;
		});	
      
	});
	
});
