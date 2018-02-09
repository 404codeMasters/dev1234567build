
Embedded tweets visualization is a kibana plugin which provides a simple way to visualize an elasticsearch index containing tweet data type.

prerequisite:

-you need both Elasticsearch and Kibana version 5.6.4

-upload tweet data type into your Es node

installation:

-clone or unzip the project into : kibana_path_folder/plugins/  

   >cd kibana_path_folder/plugins
   
   >git clone "https://github.com/404codeMasters/dev1234567build.git"
   

Configuration:

-you can change your index name in config.js file

-if you are using Es in localhost add the following code into Es_path_folder/elasticsearch.yml to solve CORS issue :

  http.cors.enabled : true
  
  http.cors.allow-origin: "*"
  
  http.cors.allow-methods : OPTIONS, HEAD, GET, POST, PUT, DELETE
  
  http.cors.allow-headers : "X-Requested-With,X-Auth-Token,Content-Type,content-Length, Authorization, kbn-version"
  
 -else fix correct url in the config.js file












