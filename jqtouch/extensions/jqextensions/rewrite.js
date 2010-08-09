/**
 *
 *
 *
 *
 *
 *    @param Object args -
 *        {
 *            jQTouch: instance of jQTouch
 *            jQuery: optional - the jQuery object
 *            rules: an Array that consists of one or more Objects -
 *                    [{
 *                        condition: Function - optional - if this rule only applies when some other criteria is met define a function for identifying that criteria
 *                        expression: RegExp - the RegExp that is used to translate the hash
 *                        translation: String | Function - a valid second argument for String.prototype.replace with this.expression as the first argument
 *                    }]
 *        }
 */
function jQTouchRewrite(args)
{
    if (!args.jQTouch)
    {
        throw new SyntaxError("You must supply the instance of jQTouch being used in your application.");
    }

    var i = 0,
            $ = args.jQuery || jQuery,
            r = args.rules,
            l = r.length,
            h = (location.hash || "#").substr(1),
            b = args.base || location.pathname,
            rule;

    if (h)
    {
        for (; i < l; ++i)
        {
            rule = r[i];

            if (!!rule.condition && $.isFunction(rule.condition))
            {
                if (!rule.condition(args))
                {
                    continue;
                }
            }

            if (rule.expression.test(h))
            {
                load(b + h.replace(rule.expression, rule.translation));
                break;
            }
        }
    }

    return null;

    function load(url)
    {
        $.get(url, function (data, status)
        {
            if (status == "success" && $.trim(data))
            {
                $(function()
                {
                    var targetPage,
                            $body = $(document.body),
                            newElement = $(data).each(function() {
                                var $node = $(this);
                                if (!$node.attr('id')) {
                                    $node.attr('id', 'page-' + $body.children().length);
                                }

                                $body.trigger('pageInserted', {page: $node.appendTo($body)});

                                if ($node.hasClass('current') || !targetPage) {
                                    targetPage = $node;
                                }
                            });
                    args.jQTouch.goTo(targetPage, 'pop');
                });
            }
        });
    }
}

David,

        I
fully
understand
your
apprehension
about
such
a
change
to
the
core.
        Here
is
an
example
of
how
a
developer
could
implement
a
page
loader.

//capture the hash, initialize jQTouch
var h = location.hash + "", jQT = new $.jQTouch({});

//check that the hash is not the current pseudo-page or a pseudo-page that was loaded initially
//this should be a check that is created by the developer to check that the requested page isn't already available
if (h && h.match(/^#(my-criteria|some-other-criteria)$/i))
{
    //the devloper needs to implement a function translate_hash_to_url that would convert the hash to a loadable URI
    $.get(translate_hash_to_url(h), function (data, status)
    {
        if (status == "success")
        {
            //use the ready function in case the DOM isnt ready for modification yet
            $(function()
            {
                var targetPage,
                        $body = $(document.body),
                        newElement = $(data).each(function() {
                            var $node = $(this);
                            if (!$node.attr('id')) {
                                $node.attr('id', 'page-' + $body.children().length);
                            }

                            $body.trigger('pageInserted', {page: $node.appendTo($body)});

                            if ($node.hasClass('current') || !targetPage) {
                                targetPage = $node;
                            }
                        });
                jQT.goTo(targetPage, 'pop');
            });
        }
    });
}
//check to see if the hash is a pseudo-page that is loaded initially
else if (h && h.match(/#(pseudo-id|pseudo-id2)$/))
{
    //use the ready function here in order to allow the DOM to load
    //otherwise your element might not be available to jQTouch
    $(function()
    {
        jQT.goTo($(document.body).children((/#(pseudo-id|pseudo-id2)$/).exec(h)[0]), 'pop');
    });
}

function translate_hash_to_url(h)
{
    //give your hashes this format param1_28-param2_39-param3_45
    //then translate that to ?param1=28&param2=39&param3=45
    return "/base/path/to/pages?" + (h || "#").substr(1)
            .replace(/-|_/g, function($0)
    {
        return $0 == "-" ? "&" : "="
    });
    //or you could use your rewriter server side to translate it if necessary
    //return "/path/to/page/" + h.substr(1).replace(/\?|#/g, "") + ".html"

    //or come up with some other hash to url scheme, but remember that the hash represents
    //the id of an element, so be warned that jQuery only matches ids that fit the criteria /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/
    //which is word characters a-z, A-Z, _, 0-9, -, unicode characters outside the normal 7-bit range, and \.
}

This
would
allow
an
app
to
jump
to
the
requested
page
on
initial
load,enabling
the
user
to
bookmark
your
page,
        or
use
the
back
button
from
an
outside
resource in order
to
return to
the
last
page
they
visited
on
a
site.

        Got
any
suggestions
how
this
might
be
improved ?

Thanks,
        Sam

