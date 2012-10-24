<html>
	<title>
		Smart Weather Maps
	</title>
	<link rel="stylesheet" href="style.css" />
	<body>
		
		<div id="wrapper">
			<div id="modal"></div>
			<div id="preloader"><h2>Fetching Feeds ... </h2></div>
			<div class="appControlsV1Class" id="appControlsV1">
				<div id="fieldAddr" class="field">
					<?php include 'v1_Control.php';?>
				</div>
				
				<div id="onLoadGeoLocationEl">
					<h2>Smart Weather Mapz <small>is requesting an access to your location ... </small></h2>
				</div>
				
			</div>
			
			<section id="snipingAreaCrosshair" style="display:none;"></section>
			
			<div style="width: 100%; height: 100%; " id="gMap"></div>
			
			<!-- scripts -->
			<script src="http://maps.google.com/maps/api/js?sensor=false" type="text/javascript"></script>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
			<script src="Smart_Weather_Map_Model.js" type="text/javascript"></script>
		</div>
		<script>
			jQuery(document).ready( function($){
			
				var App = windowSWMM;
				
					App.initialized();
					//we got some awesome html5 geolocation depency here
					App.initMap("#gMap", function( lat, lon, map ){
					
							App.defaults.data.lat = lat;
							App.defaults.data.lon = lon;
							App.defaults.data.q = lat + "_" + lon;
							
							App.run();
							
							App.mapRegisterEvents( map );
							App.addMarker();
					
					});
					
			});
		</script>
		
	</body>
</html>
