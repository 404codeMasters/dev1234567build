module.exports = function(kibana) {

  return new kibana.Plugin({
  	require: ['elasticsearch'],
  	
    uiExports: {
      visTypes: [ 'plugins/embedded_tweets_viewer/tweets_viewer' ]
      }
      
  });
  
};
