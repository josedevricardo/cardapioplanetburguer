(function (global) {
  'use strict';

  var socket = null;
  var hostList = ['localhost', '127.0.0.1'];
  var ports = { secure: 8182, insecure: 8181 };
  var usingSecure = true;
  var certPromise = function (resolve) { resolve(); };
  var sigPromise = function () { return function (resolve) { resolve(); }; };

  var qz = {
    security: {
      setCertificatePromise: function (fn) {
        certPromise = fn;
      },
      setSignaturePromise: function (fn) {
        sigPromise = fn;
      }
    },
    websocket: {
      isActive: function () {
        return socket && socket.readyState === WebSocket.OPEN;
      },
      connect: function (options) {
        return new Promise(function (resolve, reject) {
          if (qz.websocket.isActive()) {
            resolve();
            return;
          }

          options = options || {};
          var hosts = options.host || hostList;
          if (typeof hosts === 'string') { hosts = [hosts]; }
          var p = options.port || ports;
          var secure = options.usingSecure !== undefined ? options.usingSecure : usingSecure;

          var port = secure ? p.secure : p.insecure;
          var protocol = secure ? 'wss://' : 'ws://';
          var url = protocol + hosts[0] + ':' + port;
          
          socket = new WebSocket(url);

          socket.onopen = function () {
            resolve();
          };

          socket.onerror = function (err) {
            console.warn('QZ Tray WebSocket error:', err);
            reject(err);
          };

          socket.onclose = function () {
            socket = null;
          };
        });
      },
      disconnect: function () {
        return new Promise(function (resolve) {
          if (socket) {
            socket.close();
            socket = null;
          }
          resolve();
        });
      }
    },
    configs: {
      create: function (printerName, properties) {
        return {
          printer: printerName || 'default',
          properties: properties || {}
        };
      }
    },
    printers: {
      find: function (query) {
        return new Promise(function (resolve, reject) {
          if (!qz.websocket.isActive()) {
            reject(new Error("WebSocket não conectado."));
            return;
          }
          var requestId = 'printers_' + Date.now();
          var msg = { uid: requestId, call: 'printers' };
          
          var messageHandler = function(event) {
            try {
              var data = JSON.parse(event.data);
              if (data.uid === requestId) {
                socket.removeEventListener('message', messageHandler);
                if (data.error) {
                  reject(data.error);
                } else {
                  var printers = data.result || [];
                  if (query) {
                    var found = printers.find(function(p) { return p.toLowerCase().includes(query.toLowerCase()); });
                    resolve(found || null);
                  } else {
                    resolve(printers);
                  }
                }
              }
            } catch(e) {}
          };
          
          socket.addEventListener('message', messageHandler);
          socket.send(JSON.stringify(msg));
        });
      }
    },
    print: function (config, data) {
      return new Promise(function (resolve, reject) {
        if (!qz.websocket.isActive()) {
          reject(new Error("WebSocket não conectado."));
          return;
        }

        var executePrint = function () {
          var requestId = 'print_' + Date.now();
          var printMsg = {
            uid: requestId,
            call: 'print',
            document: {
              printer: config.printer,
              data: data
            }
          };

          var messageHandler = function (event) {
            try {
              var resp = JSON.parse(event.data);
              if (resp.uid === requestId) {
                socket.removeEventListener('message', messageHandler);
                if (resp.error) {
                  reject(resp.error);
                } else {
                  resolve(resp.result);
                }
              }
            } catch (e) {}
          };

          socket.addEventListener('message', messageHandler);
          socket.send(JSON.stringify(printMsg));
        };

        new Promise(certPromise).then(function (cert) {
          var sigFn = sigPromise();
          return new Promise(function (res) {
            if (typeof sigFn === 'function') {
              sigFn(res);
            } else {
              res();
            }
          }).then(function (sig) {
            executePrint();
          });
        }).catch(function (err) {
          executePrint();
        });
      });
    }
  };

  global.qz = qz;

})(window);