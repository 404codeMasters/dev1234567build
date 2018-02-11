
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import TweetsViewerTemplate from 'plugins/embedded_tweets_viewer/tweets_viewer_template.html';
import TweetsViewerOptions from 'plugins/embedded_tweets_viewer/tweets_viewer_options_template.html';
import 'plugins/embedded_tweets_viewer/tweets_viewer_style.css';
import 'plugins/embedded_tweets_viewer/tweets_viewer_controller';
import { VisSchemasProvider } from 'ui/vis/schemas' ;

function TweetsViewerProvider(Private) {

	var TemplateVisType = Private(TemplateVisTypeProvider);
	var Schemas = Private(VisSchemasProvider);
	
	return new TemplateVisType({
		name: 'tweets_viewer', 
		title: 'embedded tweets viewer',
		description: 'embedded tweets viewer',
		icon: 'img/tweets_viewer_icon.png', 
		template: TweetsViewerTemplate,
		params: {
			editor: TweetsViewerOptions
		},
		requiresSearch:false
	});
}

VisTypesRegistryProvider.register(TweetsViewerProvider);

