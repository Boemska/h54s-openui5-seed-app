sap.ui.define([
  'myApp/SasAdapter'
], function(SasAdapter) {
  var model = new sap.ui.model.json.JSONModel();
  var dialog;

  var adapter = new SasAdapter();

  var tabBar = new sap.m.IconTabBar({
    items: [
      new sap.m.IconTabFilter({
        text: 'Application Logs',
        key: 'appLogs',
        content: []
      }),
      new sap.m.IconTabFilter({
        text: 'Debug Data',
        key: 'debugData',
        content: []
      }),
      new sap.m.IconTabFilter({
        text: 'SAS Errors',
        key: 'sasErrors',
        content: []
      }),
      new sap.m.IconTabFilter({
        text: 'Failed Requests',
        key: 'failedReqs',
        content: []
      })
    ],
    select: function(item, key) {
      var tab = item.getParameter('item');
      tab.destroyContent();

      switch(item.getParameter('key')) {
        case 'appLogs':
          adapter.getApplicationLogs().forEach(function(log) {
            tab.addContent(new sap.m.Panel({
              showHeader: false,
              content: [
                new sap.m.Text({text: log.time.toString(), width: '100%'}),
                new sap.m.Text({text: log.message, width: '100%'})
              ]
            }));
          });
          break;
        case 'debugData':
          adapter.getDebugData().forEach(function(log) {
            tab.addContent(new sap.m.Panel({
              showHeader: false,
              content: [
                new sap.m.Text({text: log.time.toString(), width: '100%'}),
                new sap.m.Panel({
                  expandable: true,
                  showHeader: true,
                  //No title - UI5 bug?
                  title: log.sasProgram,
                  content: [
                    new sap.m.Text({text: log.debugText, width: '100%'})
                  ]
                })
              ]
            }));
          });
          break;
        case 'sasErrors':
          adapter.getSasErrors().forEach(function(log) {
            tab.addContent(new sap.m.Panel({
              showHeader: false,
              content: [
                new sap.m.Text({text: log.time.toString(), width: '100%'}),
                new sap.m.Text({text: log.sasProgram, width: '100%'}),
                new sap.m.Text({text: log.message, width: '100%'}),
              ]
            }));
          });
          break;
        case 'failedReqs':
          adapter.getFailedRequests().forEach(function(log) {
            tab.addContent(new sap.m.Panel({
              showHeader: false,
              content: [
                new sap.m.Text({text: log.time.toString(), width: '100%'}),
                new sap.m.Panel({
                  expandable: true,
                  showHeader: true,
                  //No title - UI5 bug?
                  title: log.sasProgram,
                  content: [
                    //NOTE: UI5 throwing "Uncaught #<Object>" - why?
                    new sap.m.Text({text: log.responseText, width: '100%'})
                  ]
                })
              ]
            }));
          });
          break;
      }
    }
  });

  if(!dialog) {
    dialog = new sap.m.Dialog({
      title: 'SAS Logon Manager',
      stretch: true,
      content: [
        tabBar
      ],
      beforeOpen: function(e) {
        var tabBarItems = tabBar.getItems();
        tabBarItems[0].destroyContent();
        tabBar.setSelectedItem(tabBarItems[0]);

        adapter.getApplicationLogs().forEach(function(log) {
          tabBarItems[0].addContent(new sap.m.Panel({
            showHeader: false,
            content: [
              new sap.m.Text({text: log.time.toString(), width: '100%'}),
              new sap.m.Text({text: log.message, width: '100%'})
            ]
          }));
        });
      },
      beginButton: new sap.m.Button({
        text: 'Clear',
        press: function () {
          switch(tabBar.getSelectedKey()) {
            case 'appLogs':
              adapter.clearApplicationLogs();
              break;
            case 'debugData':
              adapter.clearDebugData();
              break;
            case 'sasErrors':
              adapter.clearSasErrors();
              break;
            case 'failedReqs':
              adapter.clearFailedRequests();
              break;
          }
          tabBar.getItems().forEach(function(item) {
            if(item.getKey() === tabBar.getSelectedKey()) {
              item.destroyContent();
            }
          });
        }
      }),
      endButton: new sap.m.Button({
        text: 'Close',
        press: function () {
          dialog.close();
        }
      })
    });
  }

  return dialog;
});
