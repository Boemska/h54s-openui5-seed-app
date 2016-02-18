sap.ui.define([
  'sap/ui/base/Object',
  'myApp/view/LoginDialog'
], function(Object, LoginDialog) {

  return Object.extend("myApp.sasAdapter", {
    _adapter: new h54s({
      isRemoteConfig: true,
    }),

    call: function(sasProgram, tables, callback) {
      var self = this;

      sap.m.MessageToast.show('Loading ' + sasProgram);

      try {
        this._adapter.call(sasProgram, tables, function(err, res) {
          if(err && (err.type === 'notLoggedinError' || err.type === 'loginError')) {
            LoginDialog.open();
          } else {
            if(err) {
              sap.m.MessageToast.show('Error loading ' + sasProgram);
            } else {
              sap.m.MessageToast.show('Loaded ' + sasProgram);
            }
            if (res && res.usermessage && res.usermessage !== 'blank') {
              sap.m.MessageToast.show(res.usermessage);
            }
            callback(err, res);
          }
        });
      } catch(e) {
        sap.m.MessageToast.show('Error loading ' + sasProgram);
        callback(e);
      }
    },

    createTable: function(table, macro) {
      return new h54s.Tables(table, macro);
    },

    login: function(user, pass, callback) {
      try {
        this._adapter.login(user, pass, function(status) {
          if(status === -1) {
            callback('Wrong username or password');
          } else {
            callback();
          }
        });
      } catch (e) {
        callback(e);
      }
    },

    setDebugMode: function() {
      this._adapter.setDebugMode();
    },

    unsetDebugMode: function() {
      this._adapter.unsetDebugMode();
    },

    isDebugSet: function() {
      return this._adapter.debug;
    },

    getSasErrors: function() {
      return this._adapter.getSasErrors();
    },

    getDebugData: function() {
      return this._adapter.getDebugData();
    },

    getApplicationLogs: function() {
      return this._adapter.getApplicationLogs();
    },

    getFailedRequests: function() {
      return this._adapter.getFailedRequests();
    },

    clearApplicationLogs: function() {
      this._adapter.clearApplicationLogs();
    },

    clearDebugData: function() {
      this._adapter.clearDebugData();
    },

    clearSasErrors: function() {
      this._adapter.clearSasErrors();
    },

    clearFailedRequests: function() {
      this._adapter.clearFailedRequests();
    },

    onRemoteConfigUpdate: function(callback) {
      this._adapter.onRemoteConfigUpdate(callback);
    }

	});
});
