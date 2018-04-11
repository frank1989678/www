require.config({
    paths: {
        'jquery': 'lib/jquery191',
        'text': 'lib/text',
        'page1': 'page1.html',
        'page2': 'page2.html',
        'page3': 'page3.html',
        'page4': 'page4.html',
        'page5': 'page5.html'
    },
    shim:{
        zepto: {
            exports: '$'
        },
        backbone: {
            deps: ['underscore', 'zepto'],
            exports: 'Backbone'
        },
        'zepto.animate': ['zepto']
    }
});
