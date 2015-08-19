<?php
  // No direct access
  defined("EMONCMS_EXEC") or die("Restricted access");

  // eWatcher controller
  function ewatcher_controller()
  {
    // Global variables
    global $session,$route,$mysqli;

    // Output for the call
    $result = false;

    // Configuration model
    require_once("Modules/ewatcher/EWatcherConfig_model.php");
    $ewatcherconfig = new EWatcherConfig($mysqli, $session["userid"]);

    // View petition
    if ($route->format == "html")
    {
      // Split into actions
      $active = false;
      for($i = 1; (($i <= $ewatcherconfig->numPanels) && ($active === false)); $i++) {
        $panel = "P" . $i;
        if(($route->action == $panel) && ($ewatcherconfig->panels[$panel])) {
          $active = true;
          $result = view("Modules/ewatcher/panels/" . $panel . ".php", array());
        }
      }
      if(($active === false) || (!$session["write"])) {
        $result = view("Modules/ewatcher/panels/default.php", array());
      }
    }
    // Get/Set settings petition
    else if ($route->format == "json")
    {
      // Cost out
      if (($route->action == "setcout") && ($session["write"])) {
        $result = $ewatcherconfig->setcout(get("cout"));
      }
      // Cost in
      else if (($route->action == "setcin") && ($session["write"])) {
        $result = $ewatcherconfig->setcin(get("cin"));
      }
      // Units
      else if (($route->action == "setunits") && ($session["write"])) {
        $result = $ewatcherconfig->setunits(get("units"));
      }
    }

    // Return content
    return array("content"=>$result, "fullwidth"=>true);
  }
?>