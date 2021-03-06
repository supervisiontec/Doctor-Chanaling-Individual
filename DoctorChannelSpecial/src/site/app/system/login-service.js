'use strict';

angular.module("appModule")
        .config(function ($httpProvider) {
            $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            $httpProvider.defaults.withCredentials = true;
        });

angular.module('appModule')
        .factory('AuthenticationService', function (systemConfig, $http, $cookieStore, $rootScope) {
            var service = {};

            $rootScope.model = {
                name: null,
                password: null,
                type: null
            };

            service.Login = function (username, password, callback) {

                /* Use this for real authentication
                 ----------------------------------------------*/
                $rootScope.model.name = username;
                $rootScope.model.password = password;

//                var auth = username + '--' + password + ":" + password;
                var auth = username + ":" + password;
                auth = "Basic " + btoa(auth);

                var headers = {
                    "Authorization": auth,
                    "X-Requested-With": "XMLHttpRequest"
//                    "Access-Control-Allow-Origin": "*"
                };

                var url = systemConfig.apiUrl + "/api/v1/doctor-channel/mobile/security/login/" + $rootScope.model.name;

                $http.get(url, {
                    'headers': headers
                })
                        .success(function (response) {
                            console.log(response);
                            callback(response);
                        })
                        .error(function (data) {
                            $rootScope.error = 'username or password is incorrect';
                        });
                ;
            };

            service.SetCredentials = function (userName, password, indexNo) {
                var authdata = btoa(userName + ":" + password); //$base64.encode(username + ':' + password);

                $rootScope.globals = {
                    currentUser: {
                        indexNo :indexNo,
                        userName: userName,
                        authdata: authdata
                    }
                };

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                $cookieStore.put('globals', $rootScope.globals);
            };

            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
                $http.defaults.headers.common.Authorization = 'Basic ';
            };

            return service;
        });
