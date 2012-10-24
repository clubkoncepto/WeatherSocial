jQuery(document).ready( function($){

windowSWMM = {
	
	initialized: function(){},
	
	defaults: {
		cache: true,
		onLoadGeoElNotifyText: "#onLoadGeoLocationEl",
		mapElement: "gMap",
		apiUrl: "http://free.worldweatheronline.com/feed/weather.ashx",
		data: {
			num_of_days: 5,
			key: "8f7c163336164823121910",
			q: "00.00, 00.00", //combination of latitude and longitude
			format: "json",
			socialMashUpData: {
				url: 'http://staging.tambay.ph/json_api',
				data: {
					limit: 20,
					search_for: '',
					source: 'appbg',
					activity_order: 'date',
					sort_oder: 'descending',
					act: 'all',
					type: 'all',
					circumference: 5,
					lat: 14.5995124,
					lon: 120.9842195
				}
			}
		},
		result: ''
	},
	
	run: function(){
		console.log( this.defaults.data.lat );
		console.log( this.defaults.data.lon );		
		var p = this;
		var properties = p.defaults;
		console.log( 'requesting...' );
		var i = 1;
		$.ajax({
			url: properties.apiUrl,
			data: properties.data,
			dataType: 'jsonp',
			type: 'get',
			success: function( response ){
			
				console.log( response );
				var wData = response.data.weather, icon ='';
				$('#weatherForeCastStream').css('opacity', 1);
				$('ul#weatherForeCastStream').empty();
				
				$.each( wData, function( k, iData ){
				//	console.log( iData );
					i ++;
					icon = iData.weatherIconUrl[0].value
						,description = iData.weatherDesc[0].value
						,tempMaxC = iData.tempMaxC
						,tempMaxF = iData.tempMaxF
						,tempMinC = iData.tempMinC
						,tempMinF = iData.tempMinF
						
					var liData = '<li class="weatherForeCastData">'
							+ '<aside class="left"><p class="dayNum">Day ' + i + '</p><p>' + description + '</p>'
							+ '<p class="tempData celciusData"><small>Max: </small>' + tempMaxC + '&deg; <small>Min: </small>'
							+  tempMinC + '&deg;</p></aside>'
							+ '<p class="weatherForeCastIcon"><img src="'
								+ icon 
							+ '" /></p></li>';
							
						$('ul#weatherForeCastStream').append( liData );
						$('#foreCast').fadeIn( 100 );
				});	
				
				var contentTemplate = '<h3>Send message to your love ones about this weather</h3><br />+63 <input value="" type="text" /><br /><br /><hr/><br /><h5>Message</h5><br/><section id="editable" contenteditable="true" style="cursor:text;">' + 'Hi friend! The weather today in your area is <strong>' + description + '</strong></section><br /><input id="textMsgSend" value="Send Message" type="submit"><br /><br /><hr /><img src="http://www1.smart.com.ph/smartrevamp/Assets/images/core/smartlogo.png?v=090612" style="width:10%; margin-right:2%; margin-top: 2%;float:left;"/><p style="margin-top:3%;"><small><strong>SMART</strong>  &#151; the power to lead</small></p>';
				
				var infoWindowAttr = {
					icon: icon,
					content: contentTemplate
				}
				
				p.addMarker( infoWindowAttr );
				
			}
			
		});
		this.socialMashup();
		return this;
	},
	
	addMarker: function( infoWindowAttr, lat, lon, icon ){
		
		
		var prop = this.defaults.data;

		var latitude = ( lat == undefined ) ? prop.lat: lat;

		var longitude = ( lon == undefined ) ? prop.lon: lon;

		var infowindow = new google.maps.InfoWindow();
		
		var weatherIcon = new google.maps.MarkerImage(
		    infoWindowAttr.icon,
			new google.maps.Size(150,150),
			new google.maps.Point(0,0),
			new google.maps.Point(0,35)
		);
		
		var icon_ = ( infoWindowAttr.icon == undefined ) ? icon: infoWindowAttr.icon;

		marker = new google.maps.Marker({
			position: new google.maps.LatLng( 
				latitude, 
				longitude 
				),
			map: map, 
			icon: icon_,
			title: "Hello World!"
		});
		
		google.maps.event.addListener( marker, 'click', function () {
			$('#modal').html( infoWindowAttr.content ).css('display','none').fadeIn( 450 );
		});
		
		marker.setAnimation(google.maps.Animation.DROP);
		
		return this;
	
	},
	
	socialMashup: function(){
		var p = this;
		var thisUrl = p.generateUrl();
		console.log( p.defaults.data.socialMashUpData );	
		console.log( 'initializing request ... ' );
		console.log( 'connecting to tambay api' );
		$('#preloader').fadeIn( 100 );		
		$.ajax({
			url: 'server.php',
			dataType: 'jsonp',
			jsonpCallback: 'marketplace',
			data: {
				url:  thisUrl
			},
			type: 'get',
			success: $.proxy( function( response ){
				$( '#preloader' ).fadeOut( 50 );
				console.log( 'social masher succesfully connected' );
			
				$.each( response, function( data, b ){
					console.log( b );
					if( b.type == 'instagram'){
						var _content = '<img src="'+b.user.profile_picture+'" style="float:left; margin-right:10px;display:inline-block;margin-right:10px"  alt="" width="32" height="32" /><h3 style="color:#999;display:inline-block;">'+ b.user.name +'</h3><p>'+b.time_ago+'</p><a href="'+b.link+'" target="_blank" alt="" ><div style="display: block;"></div><br /><br/><img style="float:left;margin-right:5px;" src="' + b.images.thumbnail + '" /></a><br/><h3 style="color:#fff;">'+b.user.text+'</h3>';
					}else if( b.type == 'twitter' ){
						var _content = '<div style="display:inline-block;"><img src="'+b.user.profile_image+'" style="display:inline-block;margin-right:10px; float:left;"  alt="" width="32" height="32" /><h5 style="color:#fff; float:left">'+ b.user.name +'</h5><p>'+b.text+'</p><p>'+b.time_ago+'</p></div>';
					}
					var infoWindowAttr = {
							icon: '',
							content: _content
						};
					if( typeof( b ) == 'object' ){
						p.addMarker( infoWindowAttr, b.location.latitude, b.location.longitude, '' );
					}
				});

				p.generateUrl();

			}, this )
			,error: function( response, error ){
				$( '#preloader' ).fadeOut( 50 );				
				console.log( 'there has been error connection with tambay api' );
				console.log( error );
				p.generateUrl();				
			}	
		});	

		console.log( 'Running a console statement after $.ajax functions' );
	},
	generateUrl: function(){
		
		this.defaults.data.socialMashUpData.data.lat = this.defaults.data.lat;
		this.defaults.data.socialMashUpData.data.lon = this.defaults.data.lon;
		var apiurl = this.defaults.data.socialMashUpData.url;
		var data = this.defaults.data.socialMashUpData.data;
		var urlData = '';

		$.each( data, function( k, v ){
			urlData += '&' + k + '=' + v; 
		});

		var url = ( apiurl + '?' + urlData );
		
		return url;

	},
	initMap: function( mapID, func_callback ){


		this.setNotification(
		 'http://png-2.findicons.com/files/icons/2652/gentleface/48/target_icon.png', 'Location Detected', 'We are using HTML5 geolocation api. '
		);
		var parent = this, lat = 0.00, lon = 0.00;
		
		if (navigator.geolocation){
			
			navigator.geolocation.getCurrentPosition( function( position ){
				
				lat = position.coords.latitude;
				lon = position.coords.longitude;
				
				$( parent.defaults.onLoadGeoElNotifyText ).css('display','none');
				
				var template = "<table id='latLonStatus'><tr>"
					+"<td>Latitude: </td><td id='latStatus'>"+lat+"</td></tr>"
					+"<tr><td>Longitude: </td><td id='lonStatus'>"+lon+"</td>"
					+"</tr></table>"; 
					$( "#geoStatusCoords" ).html( template );
					//Map
			
				var mapOptions = {
					zoom: 16,
					center: new google.maps.LatLng( lat, lon ),
					mapTypeId: google.maps.MapTypeId.TERRAIN
				};

				window.map = new google.maps.Map(document.getElementById('gMap'),
					mapOptions);

				parent.setCircumference( map, lat, lon );
				
				func_callback( lat, lon, map );
				
			});
			
		
				
		}else{
			console.log( 'user failed to share his/her location' );
			$( mapID ).html("Geolocation is not supported by this browser.");
		}
		
		return this;
		
	},
	
	setCircumference: function( mapObj, lat, lon ){
		
		var circle = {
			strokeColor: '#3399ff',
			strokeOpacity: 0.8,
			strokeWeight: 1,
			fillColor: '#3399ff',
			fillOpacity: 0.2,
			map: map,
			center: new google.maps.LatLng( lat, lon ),
			radius: 1200
		 };
			    
		window.mapCircle = new google.maps.Circle(circle);
	
	},
	
	removeMap: function( mapCircleObj ){
		mapCircleObj.setMap( null );	
	},

	mapRegisterEvents: function( map ){
	
		var p = this;
		
		google.maps.event.addListener( map, 'drag', function(){
			$('#snipingAreaCrosshair').fadeIn( 450 );
			$('#weatherForeCastStream').css('opacity', 0.3);
			p.removeMap( mapCircle );
		});
		
		
		google.maps.event.addListener( map, 'dragend', function(){
			
			$('#snipingAreaCrosshair').fadeOut( 1000 );
			
			var i = 0, newCoords = [];
			
			for( coords in map.center ){
					i++;
					newCoords[i] = map.center[coords];
					if( i == 2 ) break;
				}
			
			$('#latStatus').html( newCoords[1] );
			$('#lonStatus').html( newCoords[2] );
			
			p.setCircumference( map, newCoords[1], newCoords[2] );
			p.defaults.data.lat = newCoords[1];
			p.defaults.data.lon = newCoords[2];
			
			p.defaults.data.q = newCoords[1] + "_" + newCoords[2];	
			console.log( p.defaults.data );
			p.run();
			
		});
		
		 $('#textMsgSend').live('click', function(){
			p.setNotification(
				'http://png-1.findicons.com/files/icons/64/email_me/48/sent_mail.png',
				'Message Sent',
				'Your text message has been successfully sent.'
			);
		  });
		  
		return this;
		
	},
	
	setNotification: function( icon, title, message ){
		if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
		// function defined in step 2
		notification_test = window.webkitNotifications.createNotification(
		 icon, title, message );
		notification_test.ondisplay = function() {  };
		notification_test.onclose = function() {  };
		notification_test.show();
	  } else {
		window.webkitNotifications.requestPermission();
	  }
	  
	 
	}
	
}
});
