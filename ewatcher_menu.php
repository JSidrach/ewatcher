<?php
  // Global variables
  global $session,$mysqli;

  // Configuration model
  require_once("Modules/ewatcher/EWatcherConfig_model.php");
  $ewatcherconfig = new EWatcherConfig($mysqli, $session["userid"]);

  // Translations
  require_once("Modules/ewatcher/ewatcher_translations.php");

  // Panels available
  $dropdown = array();
  $anyoneActive = false;
  for($i = 1; $i <= $ewatcherconfig->numPanels; $i++) {
    $panel = "P" . $i;
    if($ewatcherconfig->panels[$panel]) {
      $dropdown[] = array(ewatcher_translate($ewatcherconfig->panelsNames[$panel]), "ewatcher/" . $panel);
      $anyoneActive = true;
    }
  }
  // If no panel is active, hide menu
  if($anyoneActive === true) {
    $menu_left[] = array(
        "name"=>"EWatcher",
        "path"=>"",
        "session"=>"write",
        "order" => 5,
        "dropdown"=> $dropdown
    );
  }
?>