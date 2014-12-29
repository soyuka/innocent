jQuery(function($) {

	/* ==========================================================================
	   Fitvids by Chris Coyier
	   ========================================================================== */

	$('#wrapper').fitVids();

	/* ==========================================================================
	   Ajax Loading based on Ghostwriter by Rory Gibson - https://github.com/roryg/ghostwriter
	   ========================================================================== */

    var History = window.History;
    var loading = false;
    var showIndex = true;
    var $ajaxContainer = $('#ajax-container');
    var $postIndex = $('#post-index');
    var $blogLink = $('.js-show-index');

    // Initially hide the index and show the latest post
    $postIndex.show();

    // Show the index if the url has "page" in it (a simple
    // way of checking if we're on a paginated page.)
    if (window.location.pathname.indexOf('page') === 1) {
        $postIndex.show();
    }

    // Check if history is enabled for the browser
    if ( ! History.enabled) {
        return false;
    }

    History.Adapter.bind(window, 'statechange', function() {
        var State = History.getState();

        // Get the requested url and replace the current content
        // with the loaded content
        $.get(State.url, function(result) {
            var $html = $(result);
            var $newContent = $('#ajax-container', $html).contents();

            $('html, body').animate({'scrollTop': 0});

            $ajaxContainer.fadeOut(500, function() {
                $postIndex = $newContent.filter('#post-index');

                if (showIndex === true) {
                } else {
                }

                $ajaxContainer.html($newContent);
                $ajaxContainer.fadeIn(500);
				
                NProgress.done();
				$('#site-footer').fadeIn(100);
                $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
                //hljs.initHighlightingOnLoad();                
                $('#wrapper').fitVids();

                loading = false;
                showIndex = false;
            });
        });
    });

    $('body').on('click', '.js-ajax-link, .pagination a', function(e) {
        e.preventDefault(); 

        if (loading === false) {
            var currentState = History.getState();
            var url = $(this).attr('href');
            var title = $(this).attr('title') || null;

            // If the requested url is not the current states url push
            // the new state and make the ajax call.
            if (url !== currentState.url.replace(/\/$/, "")) {
                loading = true;

                // Check if we need to show the post index after we've
                // loaded the new content
                if ($(this).hasClass('js-show-index') || $(this).parent('.pagination').length > 0) {
                    showIndex = true;
                }
                
                if ($(this).hasClass('post-link')) {
					$blogLink.addClass('single');

				} else if($(this).hasClass('js-show-index')) {
					if($(this).hasClass('single')) {}
					$blogLink.removeClass('single');

				}
                NProgress.start();

                History.pushState({}, title, url);
            } else {
            
                // Swap in the latest post or post index as needed
                if (!$(this).hasClass('js-show-index')) {
                    $('html, body').animate({'scrollTop': 0});

                    NProgress.start();

                    $postIndex.fadeOut(300, function() {
                        NProgress.done();
                    });
                }
            }
        }
    });

});
