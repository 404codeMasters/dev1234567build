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
		
		$scope.selectedField=["_source","status.id"];
		$scope.searchData;
		//how many tweets in the timeline
		var len = 10;  				//by default
		
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
    
    	//display tweets when app starts
			var displayAll=function(){
			
				client.search({
					index: window.index,
						body: {
							"query": {
								"match_all":{}
							},"size":len
						}
					}, function(error , response){
									 
							if(response.hits.hits.length && !error){
							
									response.hits.hits.forEach(function (hit) {
											$scope.records.push(hit._source.id);
										});	
									$scope.showTweet= true;
							}else {
								$scope.showMessage=true;
							}
						});
					}
			
			displayAll();
  
  	// watch for the input parmameters change
		$scope.$watchGroup(['vis.params.tweets', 'vis.params.length'] , function (newVal , oldVal) {
		
			//reset visualization	
			$scope.showTweet=false ; 
			$scope.showMessage=false;
			$scope.records = [];
			
			
			if(newVal[1]){
				len = newVal[1];
			}
			
			if(newVal[0]==2){
				$scope.searchField();
			}else{

				if($scope.searchData) $scope.esSearch();
				else displayAll();
			}

	});
	
		$scope.esSearch = function(){
			//reset visualization
			$scope.records = [];	

			$scope.showMessage=false;
			
      // search the tweet target in elasticsearch 		
			client.search({
				index: window.index,
				q: $scope.searchData,
				size : len
				} , function(error , response){
							 
						 if(response.hits.hits.length && !error){
							
							response.hits.hits.forEach(function (hit) {
										$scope.records.push(hit._source.id);
								});	
							$scope.showTweet= true;
						}else {
								$scope.showMessage=true;
						}
					});
			};	
			
			$scope.searchField = function(){
				//reset visualization
				$scope.records = [];	

				$scope.showMessage=false;
			
		    // search the tweet target in elasticsearch 		
				client.search({
					index: window.index,
					body: {
							"query": { 
								"match" : { 
									"status.id" : $scope.searchData  
									}
								},
							"size" : len
						}
					} , function(error , response){
								 
							 if(response.hits.hits.length && !error){
							
								response.hits.hits.forEach(function (hit) {
											$scope.records.push(hit._source.id);
									});	
								$scope.showTweet= true;
							}else {
									$scope.showMessage=true;
							}
						});
					};
			
	});
});
