// EWatcherConfigPanel class
// Variables needed: window.apikey_write, window.emoncms_path
// Libraries needed: jQuery
//
// Parameters:
//   divId: id of the configuration container
//   cIn: id of the import cost input
//   cOut: id of the export cost input
//   units: id of the units input
function EWatcherConfigPanel(divId, cIn, cOut, units) {
  "use strict";

  // Parameter properties
  // Configuration container id
  this.divId = divId;
  // Import cost input id
  this.cInId = cIn;
  // Export cost input id
  this.cOutId = cOut;
  // Units input id
  this.unitsId = units;

  // Object properties
  // Container object
  this.div = $(divId);
  // cIn object
  this.cIn = $(this.cInId);
  // cOut object
  this.cOut = $(this.cOutId);
  // units object
  this.units = $(this.unitsId);

  // Last values
  this.lastcIn = this.cIn.val();
  this.lastcOut = this.cOut.val();
  this.lastUnits = this.units.val();

  // Events
  // Save context
  var self = this;
  // Show/Hide configuration
  this.div.find(".click-close, .click-open").click(function() {
    $(self.div).find(".default-shown-config").toggle("slow");
    $(self.div).find(".default-hidden-config").toggle("slow");
  });
  // Update configuration
  this.cIn.on("change", function() {
    if(self.lastcIn == $(this).val()) {
      return;
    }
    self.lastcIn = $(this).val();
    self.saveParameter("cin", $(this).val(), self.cInId, true);
  });
  this.cOut.on("change", function() {
    if(self.lastcOut == $(this).val()) {
      return;
    }
    self.lastcOut = $(this).val();
    self.saveParameter("cout", $(this).val(), self.cOutId, true);
  });
  this.units.on("change", function() {
    if(self.lastUnits == $(this).val()) {
      return;
    }
    self.lastUnits = $(this).val();
    self.saveParameter("units", $(this).val(), self.unitsId, false);
  });

  // Saves a parameter to the database
  this.saveParameter = function(name, value, id, numeric) {
    // Save context
    var self = this;
    $.ajax({
      url: window.emoncms_path + "/ewatcher/set" + name + ".json?apikey=" + window.apikey_write,
      data: name + "=" + value,
      dataType: "json",
      success: function(data) {
        if(data === false) {
          if(numeric) {
            $(id).val(parseFloat(data)).trigger("change");
          } else {
            $(id).val("").trigger("change");
          }
        } else {
          if(numeric) {
            $(id).val(parseFloat(data)).trigger("change");
          } else {
            $(id).val(data.substring(1, data.length - 1)).trigger("change");
          }
        }
        $(id).val(value);
      },
      error: function() {
        if(numeric) {
          $(id).val(data).trigger("change");
        } else {
          $(id).val("").trigger("change");
        }
      }
    });
  }
};
