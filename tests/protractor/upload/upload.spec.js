var protractor = require('protractor');
var firebase = require('firebase');
var path = require('path');
require('../../initialize-node.js');

describe('Upload App', function () {
  // Reference to the Firebase which stores the data for this demo
  var firebaseRef;

  // Boolean used to load the page on the first test only
  var isPageLoaded = false;

  // Reference to the messages repeater
  var messages = element.all(by.repeater('message in messages'));

  var flow = protractor.promise.controlFlow();

  function waitOne() {
    return protractor.promise.delayed(500);
  }

  function sleep() {
    flow.execute(waitOne);
  }

  function clearFirebaseRef() {
    var deferred = protractor.promise.defer();

    firebaseRef.remove(function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.fulfill();
      }
    });

    return deferred.promise;
  }

  beforeEach(function (done) {
    if (!isPageLoaded) {
      isPageLoaded = true;

      browser.get('upload/upload.html').then(function () {
        return browser.waitForAngular()
      }).then(done)
    } else {
      done()
    }
  });

  it('loads', function () {
    expect(browser.getTitle()).toEqual('AngularFire Upload e2e Test');
  });

  it('starts with an empty list of messages', function () {
    expect(messages.count()).toBe(0);
  });

  it('uploads a file', function (done) {
    var fileToUpload = './upload/logo.png',
     absolutePath = path.resolve(__dirname, fileToUpload);

   $('input[type="file"]').sendKeys(absolutePath);
   $('#submit').click();

   var el = element(by.id('url'));
   browser.driver.wait(protractor.until.elementIsVisible(el))
    .then(function () {
      return el.getText();
    }).then(function (text) {
      var result = "https://firebasestorage.googleapis.com/v0/b/angularfire-dae2e.appspot.com/o/user%2F1.png";
      expect(text.slice(0, result.length)).toEqual(result);
      done();
    });
  });
});
