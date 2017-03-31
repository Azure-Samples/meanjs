﻿(function () {
  'use strict';

  describe('Chat Route Tests', function () {
    // Initialize global variables
    var $scope,
      Authentication,
      $httpBackend;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Authentication_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Authentication = _Authentication_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('chat');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/chat');
        });

        it('Should not be abstract', function () {
          expect(mainstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(mainstate.templateUrl).toBe('/modules/chat/client/views/chat.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, _$httpBackend_, _Authentication_) {
          Authentication.user = {
            name: 'user',
            roles: ['user']
          };

          $httpBackend = _$httpBackend_;

          // Ignore parent template get on state transition
          $httpBackend.whenGET('/modules/chat/client/views/chat.client.view.html').respond(200);
          $httpBackend.whenGET('/modules/core/client/views/home.client.view.html').respond(200, '');

          $state.go('chat');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope, $templateCache) {
          $templateCache.put('/modules/chat/client/views/chat.client.view.html', '');

          $location.path('chat/');
          $rootScope.$digest();

          expect($location.path()).toBe('/chat');
          expect($state.current.templateUrl).toBe('/modules/chat/client/views/chat.client.view.html');
        }));
      });

    });
  });
}());
