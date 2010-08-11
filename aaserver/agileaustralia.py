import cgi
from django.utils import simplejson
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from yaml import load
from os.path import getmtime
from time import gmtime, strftime

class JSONHandler(webapp.RequestHandler):
    def get(self):
        filename = "data/" + self.request.path + ".yml"
        self.response.headers['Content-Type'] = 'application/json'
        self.response.out.write(simplejson.dumps(load(open(filename,'r'))))

class TimestampHandler(webapp.RequestHandler):
    def head(self):
        filename = "data/" + self.request.path.replace("Timestamp","") + ".yml"
        gmt_time = gmtime(getmtime(filename))
        self.response.headers['Last-Modified'] = strftime("%a, %d %b %Y %H:%M:%S GMT", gmt_time)

application = webapp.WSGIApplication(
                                     [('/speakers', JSONHandler),
                                      ('/topics', JSONHandler),
                                      ('/speakersTimestamp', TimestampHandler),
                                      ('/topicsTimestamp', TimestampHandler),
                                      ],
                                     debug=True)
def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
