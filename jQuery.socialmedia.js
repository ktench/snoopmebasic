var APPID = "1635811846698729";
var APPSecret = "616aa52b56c52d6fef545dfc45041156";
// The semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
; (function ($, window, document, undefined) {

    // window and document are passed through as local 
    // variables rather than as globals, because this make the resolution
    // resolution process quick and can be more efficiently minified 
    // (especially when both are regularly referenced in your plugin).

    // Create the plugin defaults once
    var pluginName = 'socialMedia',
        defaults = {
            facebook: {
                enabled: true,
                maxElements: 15
            },
            instagram: {
                enabled: true,
                maxElements: 15
            }
        };

    // Supported methods
    var methods = {
        fetch: function () { this.fetch(); },
    };

    // The plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // jQuery has an extend method that merges the 
        // contents of two or more objects, storing the 
        // result in the first object. The first object 
        // is generally empty because we don't want to alter 
        // the default options (ref. http://api.jquery.com/jquery.extend/)
        this.options = $.extend(true, {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {

        // Initialization logic of the plugin
        // Here we can access to the DOM element and the options
        // via the instance, using this.element and this.options

        var _$this = $(this.element);
        var _opts = this.options;

        // No social media is requested
        if ( !_opts.instagram.enabled && !_opts.facebook.enabled) return;

        // Plugin DOM reference
        var $table = $('<table class="table table-bordered"></table>'),
            $tableHeader = $('<thead />'),
            $headRow = $('<tr />'),
            $tableBody = $('<tbody />'),
            $connRow = $('<tr />'),
            $socCell,
            $instagramEl,
            $facebookEl;


       
        // If instagram is enabled initalize hello js for it
        if (_opts.instagram.enabled) {
            hello.init({
                instagram: _opts.instagram.key
            },
			{
			    redirect_uri: 'redirect.html',
			});

            // Instagram connection handler
            setTimeout(function () { connectToInstagram($instagramEl); }, 2000);
        }

        // If instagram is enabled initalize hello js for it
        if (_opts.facebook.enabled) {
            hello.init({
                facebook: _opts.facebook.key
            },
			{
			    redirect_uri: 'redirect.html',
			});

            // Instagram connection handler
            setTimeout(function () { connectToFacebook($facebookEl); }, 2000);
        }

    }

    Plugin.prototype.fetch = function () {
        
        var _$this = $(this.element);
        var _opts = this.options;
    
        /**
        * Randomize array element order in-place.
        * Using Fisher-Yates shuffle algorithm.
        */
        function shuffleArray(array) {
             
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        var fecthedData = [];

        // Deferred objects
        
        var d2 = $.Deferred();
        var d3 = $.Deferred();

        // Waiting for the deferred completion
        $.when(d2, d3).done(function (v2, v3) {
           
            // Build one concatenated array with the result of each data fecth result
          
            fecthedData = fecthedData.concat(v2);
            fecthedData = fecthedData.concat(v3);
//            // Schuffle the array result
//            fecthedData = shuffleArray(fecthedData);
            // Render the mixed fetched data
            renderFetchedData(_$this, fecthedData);
        });

        
        fetchInstagramData(_opts.instagram, d2);
        fetchFacebookData(_opts.facebook, d3);

    }
    function renderFetchedData($el, data) {
        
        
        var $masonryDiv = $('<div class="grid" />'),
            $masonryEl,
            $masonryCell;

        $.each(data, function (i, e) {
            
            $masonryEl = $('<div class="grid-item" />');
            
            switch (e.social)  {
                
                case 'instagram':
                    
                    $masonryCell = $('<div class="instagram" />').html('<figure><img src="' + e.img + '" /><figcaption>' + ((e.text) ? e.text : '') + '</figcaption></figure>');
                    break;
                case 'facebook':
                    
                    $masonryCell = $('<div class="facebook" />').html('<figure><img src="' + e.picture + '" /><figcaption>' + ((e.text) ? e.text : e.message ? e.message :'') + '<br> '+ e.name+'</figcaption></figure>');
                    break;
            }

            $masonryCell.appendTo($masonryEl);
            $masonryEl.appendTo($masonryDiv);
        });

        $masonryDiv.appendTo($el);

        // Attach masonry plugin
        $masonryDiv.masonry({
            itemSelector: '.grid-item',
            gutter: 10
        });

    }



    function connectToInstagram($instagramEl) {

        // If an error is raised show it in the connection status cell
        var onInstagramError = function (e) {
            $instagramEl.text(e.error.message);
        };

        // Instagram instance
        var instagram = hello('instagram');

        // Login
        instagram.login().then(function (r) {
            // Get Profile
            instagram.api('me').then(function (p) {
//                $instagramEl.html('<span><img src="' + p.thumbnail + '" width=50 class="roundedAvatar" /><span style="margin-left: 15px;">Connected to Instagram as ' + p.name + '</span></span>');
            }, onInstagramError);
        }, onInstagramError);

    }

    function fetchInstagramData(o, d) {
        $("button").hide();
        if (!o.enabled) {
            d.resolve([]);
            return;
        }

        // Instagram instance
        var instagram = hello('instagram');        

        instagram.api('me/photos', { limit: o.maxElements })
                 .then(function (r) {
            
                     var photos = [];
                     for (var i = 0; i < r.data.length; i++) {
                         var pic = r.data[i];
                         photos.push({ social: 'instagram', img: pic.thumbnail, text: pic.name });
                     }
                     d.resolve(photos);
                 });
    }

    function connectToFacebook($facebookEl) {

        // If an error is raised show it in the connection status cell
        var onFacebookError = function (e) {
            $facebookEl.text(e.error.message);
        };

        // Facebook instance
        var facebook = hello('facebook');

        // Login
        facebook.login(({ scope: 'user_posts,user_photos' })).then(function (r) {
            // Get Profile
            
            facebook.api('me',{fields:'picture.height(2048),name,cover,birthday'}).then(function (p) {
                var birthdate = new Date(p.birthday);
var cur = new Date();
var diff = cur-birthdate;
var age = Math.floor(diff/31536000000);
                $("#name").text(p.name);
                $("#age").text(age);
                
                $("#profile-photo").attr("src",p.picture);
                $("header").css('background','url('+p.cover.source+')');
                console.log(p);
//                $facebookEl.html('<span><img src="' + p.thumbnail + '" width=50 class="roundedAvatar" /><span style="margin-left: 15px;">Connected to Facebook as ' + p.name + '</span></span>');
            }, onFacebookError);
        }, onFacebookError);
        
        
    }

    function fetchFacebookData(o, d) {

        if (!o.enabled) {
            d.resolve([]);
            return;
        }

        // Facebook instance
        var facebook = hello('facebook');        
//        facebook.api('facebook:/me/photos',function(r){
//           var postsPhotos = [];
//            console.log(r);
//            for(var i=0;i<r.data.length;i++){
//                console.log(r.data[i]);
//            }
//        });
        facebook.api('facebook:/me/posts', { limit: o.maxElements,fields:'picture,story,message,caption,description,from,link,name' }, function (r) {
            var posts = [];
            for (var i = 0; i < r.data.length; i++) {           
                var o = r.data[i];
//                console.log(o);
//                console.log(o.img);
                posts.push({ social: 'facebook', text: o.story, message: o.message, picture:o.picture,description:o.description,link:o.link,name:o.name,caption:o.caption });

                
                
                       
            };

            d.resolve(posts);
        });

    }

    // Plugin wrapper around the constructor, 
    // preventing against multiple instantiations on the same element
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            // Check that the element is a div
            if (!$(this).is('div')) return

            var inst = $.data(this, 'plugin_' + pluginName);

            if (options === 'destroy' && inst instanceof Plugin) {
                inst.destroy();
            } else if (typeof options === 'object' || !options) {
                // Plugin already instaciated for the element
                if (!inst) $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            } else if (methods[options]) {
                return methods[options].apply(inst, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('Method ' + options + ' does not exist on jQuery.socialMedia');
            }
        });
    }

})(jQuery, window, document);