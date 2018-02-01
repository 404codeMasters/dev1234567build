
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';
import TweetsViewerTemplate from 'plugins/embedded_tweets_viewer/tweets_viewer_template.html';
import TweetsViewerOptions from 'plugins/embedded_tweets_viewer/tweets_viewer_options_template.html';
import 'plugins/embedded_tweets_viewer/tweets_viewer_style.css';
import 'plugins/embedded_tweets_viewer/tweets_viewer_controller';

function TweetsViewerProvider(Private) {

	var TemplateVisType = Private(TemplateVisTypeProvider);
	
	return new TemplateVisType({
		name: 'tweets_viewer', 
		title: 'embedded tweets viewer',
		description: 'embedded tweets viewer',
		icon: 'tweets_viewer_icon', 
		template: TweetsViewerTemplate,
		params: {
			editor: TweetsViewerOptions
		},
    options: {
      showTimePicker: false,
    },
    requestHandler: 'none',
    responseHandler: 'none',
		implementsRenderComplete: true
	});
}

VisTypesRegistryProvider.register(TweetsViewerProvider);


