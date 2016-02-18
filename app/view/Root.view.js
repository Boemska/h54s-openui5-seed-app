sap.ui.define([
  'myApp/view/DebugDialog',
  'myApp/SasAdapter'
], function(DebugDialog, SasAdapter) {
  return sap.ui.jsview('myApp.view.Root', {
    init: function() {
      //don't worry, it's using the same h54s adapter
      var adapter = new SasAdapter();

      // adapter.call('programPath', null, function(err, res) {
      //   if(err) {
      //     alert(err.message);
      //   } else {
      //     console.log(res);
      //   }
      // });
    },

    createContent: function() {
      var debugBtn = new sap.m.ToggleButton({
        text: 'Debug',
        pressed: new SasAdapter().isDebugSet(),
        press: function() {
          adapter.toggleDebugMode();
        }
      });

      var adapter = new SasAdapter();
      adapter.onRemoteConfigUpdate(function() {
        debugBtn.setPressed(adapter.isDebugSet());
      });

      return new sap.m.Page({
        title: 'My First OpenUI h54s app',
        headerContent: [
          debugBtn,
          new sap.m.Button({
            text: 'Show Log',
            press: function() {
              DebugDialog.open();
            }
          })
        ]
      });
    }
  });
});
