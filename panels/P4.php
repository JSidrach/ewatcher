<?php
  // P4 Class
  // PV - Queries
  class EWatcherP4 extends EWatcherPanel {
    // Constructor
    function __construct($userid, $mysqli, $path, $config) {
      parent::__construct($userid, $mysqli, $path, $config);
    }

    // Panel 4 View
    public function view() {
      parent::view();

      // (Optional Configuration) set: cIn, cOut, units
      // Form: two dates (default to one week)
        // Value: tLoad, tPv, tPvToLoad, tPvToNet, tLoadFromNet (cumulative feeds), 100*tPvToLoad/tPv, 100*tPvToLoad/tLoad (dependent feeds)
        // Value: cNet, cPvToNet, cLoadNoPv, cLoadPv, savings (dependent feeds)
        // Table: eDLoad, eDPv, eDLoadFromPv, eDPvToNet, eDNet (daily table)
      ?>
      <div id="ewatcher-config" class="ewatcher-config">
        <div class="default-hidden-config" style="display:none">
          <div class="multiple-values-container">
            <div class="multiple-values multiple-3">
              <span class="single-value">
                <label><?php echo ewatcher_translate("Import cost (per kWh)"); ?></label>
                <input id="cIn" type="number" value="<?php echo $this->config->getcin(); ?>" step="any">
              </span>
              <span class="single-value">
                <label><?php echo ewatcher_translate("Units"); ?></label>
                <input id="units" type="text" value="<?php echo $this->config->getunits(); ?>">
              </span>
                <span class="single-value">
                <label><?php echo ewatcher_translate("Export cost (per kWh)"); ?></label>
                <input id="cOut" type="number" value="<?php echo $this->config->getcout(); ?>" step="any">
              </span>
            </div>
          </div>
          <i class="icon-arrow-up icon-white click-close"></i>
        </div>
        <div class="default-shown-config">
          <i class="icon-wrench icon-white click-open"></i>
        </div>
        <hr>
      </div>
      <div class="multiple-values-container">
        <div class="formDates">
          <div class="dateInput">
            <label><?php echo ewatcher_translate("Start date"); ?></label>
            <div id="startDate" class="input-append date control-group">
              <input data-format="dd/MM/yyyy" value="<?php echo date("d/m/Y", strtotime('-7 days')); ?>" type="text" />
              <span class="add-on"> <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i></span>
            </div>
          </div>
          <div class="dateInput">
            <label><?php echo ewatcher_translate("End date"); ?></label>
            <div id="endDate" class="input-append date control-group">
              <input data-format="dd/MM/yyyy" value="<?php echo date("d/m/Y"); ?>" type="text" />
              <span class="add-on"> <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i></span>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="multiple-values-container">
        <div class="multiple-values multiple-3">
          <span class="single-value">
            <label><?php echo ewatcher_translate("Total consumption"); ?></label>
            <span id="tLoad" data-feedid="<?php echo $this->feeds['tLoad']['id']; ?>">
            </span>
            <span>kWh</span>
          </span>
          <span class="single-value">
            <label><?php echo ewatcher_translate("PV energy produced"); ?></label>
            <span id="tPv" class="ewatcher-yellow" data-feedid="<?php echo $this->feeds['tPv']['id']; ?>">
            </span>
            <span class="ewatcher-yellow">kWh</span>
          </span>
          <span class="single-value">
            <label><?php echo ewatcher_translate("PV self-consumed energy"); ?></label>
            <span id="tPvToLoad"  class="ewatcher-green" data-feedid="<?php echo $this->feeds['tPvToLoad']['id']; ?>">
            </span>
            <span class="ewatcher-green">kWh</span>
          </span>
        </div>
      </div>
      <div class="multiple-values-container">
        <div class="multiple-values multiple-2">
          <span class="single-value">
            <label><?php echo ewatcher_translate("Energy imported from the grid"); ?></label>
            <span id="tLoadFromNet"  class="ewatcher-red" data-feedid="<?php echo $this->feeds['tLoadFromNet']['id']; ?>">
            </span>
            <span class="ewatcher-red">kWh</span>
          </span>
          <span class="single-value">
            <label><?php echo ewatcher_translate("PV energy exported to the grid"); ?></label>
            <span id="tPvToNet"  class="ewatcher-yellow" data-feedid="<?php echo $this->feeds['tPvToNet']['id']; ?>">
            </span>
            <span class="ewatcher-yellow">kWh</span>
          </span>
        </div>
      </div>
      <div class="multiple-values-container">
        <div class="multiple-values multiple-2">
          <span class="single-value">
            <label><?php echo ewatcher_translate("Self-consumption"); ?></label>
            <span id="selfConsumption" class="ewatcher-green" data-feedid="<?php echo 100*$this->feeds['tPvToLoad/tPv']['id']/$this->feeds['tPv']['id']; ?>">
            </span>
            <span class="ewatcher-green">%</span>
          </span>
          <span class="single-value">
            <label><?php echo ewatcher_translate("PV produced consumption"); ?></label>
            <span id="pvConsumption" class="ewatcher-yellow" data-feedid="<?php echo 100*$this->feeds['tPvToLoad/tPv']['id']/$this->feeds['tLoad']['id']; ?>">
            </span>
            <span class="ewatcher-yellow">%</span>
          </span>
        </div>
      </div>
      <hr>
      <div class="multiple-values-container">
        <div class="multiple-values multiple-2">
          <span class="single-value">
            <label><?php echo ewatcher_translate("Cost of the imported energy"); ?></label>
            <span id="cNet" class="ewatcher-red"></span>
            <span class="cost-units ewatcher-red"><?php echo $this->config->getUnits(); ?></span>
          </span>
          <span class="single-value">
            <label><?php echo ewatcher_translate("Cost of the exported PV energy"); ?></label>
            <span id="cPvToNet" class="ewatcher-yellow"></span>
            <span class="cost-units ewatcher-yellow"><?php echo $this->config->getUnits(); ?></span>
          </span>
        </div>
      </div>
      <div class="multiple-values-container">
        <div class="multiple-values multiple-2">
          <span class="single-value">
            <label><?php echo ewatcher_translate("Cost without PV production"); ?></label>
            <span id="cLoadNoPv" class="ewatcher-red"></span>
            <span class="cost-units ewatcher-red"><?php echo $this->config->getUnits(); ?></span>
          </span>
          <span class="single-value">
            <label><?php echo ewatcher_translate("Cost with PV production"); ?></label>
            <span id="cLoadPv" class="ewatcher-yellow"></span>
            <span class="cost-units ewatcher-yellow"><?php echo $this->config->getUnits(); ?></span>
          </span>
        </div>
        <div class="multiple-values-container">
          <div class="multiple-values multiple-1">
            <span class="single-value">
              <label><?php echo ewatcher_translate("Savings"); ?></label>
              <span id="savings" class="ewatcher-green"></span>
              <span class="cost-units ewatcher-green"><?php echo $this->config->getUnits(); ?></span>
            </span>
          </div>
        </div>
      </div>
      <hr>
      <div class="daily-values several-values" id="table"></div>
      <script>
        $(window).ready(function() {
          // Configuration panel
          var config = new EWatcherConfigPanel("#ewatcher-config", "#cIn", "#cOut", "#units");
          // Date form
          $('#startDate').datetimepicker({ pickTime: false });
          $('#endDate').datetimepicker({ pickTime: false });
          // Units
          var costUnits = new DependentValue(".cost-units", "#units", function(values) {
            return values["#units"];
          });
          // Cumulative feeds
          var tLoad = new CumulativeFeed("#tLoad", "#startDate", "#endDate");
          var tPv = new CumulativeFeed("#tPv", "#startDate", "#endDate");
          var tPvToLoad = new CumulativeFeed("#tPvToLoad", "#startDate", "#endDate");
          var tPvToNet = new CumulativeFeed("#tPvToNet", "#startDate", "#endDate");
          var tLoadFromNet = new CumulativeFeed("#tLoadFromNet", "#startDate", "#endDate");
          // Dependent values
          var selfConsumption = new DependentValue("#selfConsumption", "#tPvToLoad,#tPv", function(values) {
            var tPvToLoad = parseFloat(values["#tPvToLoad"]);
            var tPv = parseFloat(values["#tPv"]);
            if(tPv == 0) {
              return 0;
            }
            return (Math.round(100 * 100 * tPvToLoad / tPv) / 100);
          });
          var pvConsumption = new DependentValue("#pvConsumption", "#tPvToLoad,#tLoad", function(values) {
            var tPvToLoad = parseFloat(values["#tPvToLoad"]);
            var tLoad = parseFloat(values["#tLoad"]);
            if(tLoad == 0) {
              return 0;
            }
            return (Math.round(100 * 100 * tPvToLoad / tLoad) / 100);
          });
          // Costs
          var cNet = new DependentValue("#cNet", "#cIn,#tLoadFromNet", function(values) {
            var cIn = parseFloat(values["#cIn"]);
            var tLoadFromNet = parseFloat(values["#tLoadFromNet"]);
            return Math.round(cIn * tLoadFromNet * 100) / 100;
          });
          var cPvToNet = new DependentValue("#cPvToNet", "#cOut,#tPvToNet", function(values) {
            var cOut = parseFloat(values["#cOut"]);
            var tPvToNet = parseFloat(values["#tPvToNet"]);
            return Math.round(cOut * tPvToNet * 100) / 100;
          });
          var cLoadNoPv = new DependentValue("#cLoadNoPv", "#cIn,#tLoad", function(values) {
            var cIn = parseFloat(values["#cIn"]);
            var tLoad = parseFloat(values["#tLoad"]);
            return Math.round(cIn * tLoad * 100) / 100;
          });
          var cLoadPv = new DependentValue("#cLoadPv", "#cNet,#cPvToNet", function(values) {
            var cNet = parseFloat(values["#cNet"]);
            var cPvToNet = parseFloat(values["#cPvToNet"]);
            return Math.round((cNet - cPvToNet) * 100) / 100;
          });
          var savings = new DependentValue("#savings", "#cLoadPv,#cLoadNoPv", function(values) {
            var cLoadPv = parseFloat(values["#cLoadPv"]);
            var cLoadNoPv = parseFloat(values["#cLoadNoPv"]);
            return Math.round((cLoadNoPv - cLoadPv) * 100) / 100;
          });

          // Table
          var dailyTable = new FeedDailyTable("#table", "#startDate", "#endDate", [
            {
              id: <?php echo $this->feeds['eDLoad']['id']; ?>,
              name: 'Consumption (kWh/d)'
            },
            {
              id: <?php echo $this->feeds['eDPv']['id']; ?>,
              name: 'PV energy (kWh/d)'
            },
            {
              id: <?php echo $this->feeds['eDLoadFromPv']['id']; ?>,
              name: 'PV self-consumed energy (kWh/d)'
            },
            {
              id: <?php echo $this->feeds['eDPvToNet']['id']; ?>,
              name: 'PV energy exported to the grid (kWh/d)'
            },
            {
              id: <?php echo $this->feeds['eDNet']['id']; ?>,
              name: 'PV energy imported from the grid (kWh/d)'
            }
          ]);
        });
      </script>
      <?php
    }
  }
?>
