///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
	'dojo/_base/declare', 
	'jimu/BaseWidget', 
	'esri/SpatialReference', 
	'esri/geometry/Point', 
	'esri/graphic', 
	'esri/symbols/SimpleMarkerSymbol',
	'esri/Color', 
	'esri/InfoTemplate', 
	'esri/geometry/projection', 
	'esri/geometry/coordinateFormatter', 
	'jimu/dijit/Message',
	'esri/layers/GraphicsLayer'
	],function (
		declare, 
		BaseWidget, 
		SpatialReference, 
		Point, 
		Graphic, 
		SimpleMarkerSymbol, 
		Color, 
		InfoTemplate, 
		projection, 
		coordinateFormatter,
		Message,
		GraphicsLayer) {

		//To create a widget, you need to derive from BaseWidget.
		return declare([BaseWidget], {
			// DemoWidget code goes here

			//please note that this property is be set by the framework when widget is loaded.
			//templateString: template,
			name: "Conversor de coordenadas mina",
			baseClass: 'jimu-widget-report',
			
			postCreate: function () {
				this.inherited(arguments);
				console.log('postCreate');
			},
			
			startup: function () {
				this.inherited(arguments);
				console.log('startup');
				var gLayer = new GraphicsLayer({'id': 'gLayerCoordenadasMina'});
				this.map.addLayer(gLayer);
			},

			showMessage: function (msg, type) {
				var class_icon = "message-info-icon";
				switch (type) {
					case "error":
						class_icon = "message-error-icon";
						break;
					case "warning":
						class_icon = "message-warning-icon";
						break;
				}

				var content = '<i class="' + class_icon + '">&nbsp;</i>' + msg;

				new Message({
					message: content
				});
			},

			_onBtnCleanClicked: function (){
				// Limpio la capa
				var gLayer = this.map.getLayer("gLayerCoordenadasMina");
				gLayer.clear();
				// Limpio la tabla
				var tbody = document.getElementById("tbody-container-coordinates");
				if (tbody.hasChildNodes()) {
					while (tbody.firstChild) {
						tbody.firstChild.remove();
					}
				}
			},

			_onBtnConvertClicked: function (){

				if (!projection.isSupported()) {
					console.error("projection is not supported");
					return;
				}

				var lon_mina = document.getElementById("mina_lon").value;
				var lat_mina = document.getElementById("mina_lat").value;

				if (!lon_mina || !lat_mina)
				{
					this.showMessage('Debe ingresar las coordenadas mina', 'error');
					return false;
				}

				//Creo la coordenada mina con el wkt definido
				var spatialReference = new SpatialReference({
					"wkt": 'PROJCS["SCM_TTE_VS_0", GEOGCS["GCS_WGS_1984", DATUM["D_WGS_1984", SPHEROID["WGS_1984", 6378137.0, 298.257223563]], PRIMEM["Greenwich", 0.0], UNIT["Degree", 0.0174532925199433]], PROJECTION["Local"], PARAMETER["False_Easting", -1329.23072749395], PARAMETER["False_Northing", 1764.93653933271], PARAMETER["Scale_Factor", 1.0003426831], PARAMETER["Azimuth", 14.12722222222222], PARAMETER["Longitude_Of_Center", -70.3683535472], PARAMETER["Latitude_Of_Center", -34.0668658542], UNIT["Meter", 1.0]], VERTCS["EGM84_Geoid_3", VDATUM["EGM84_Geoid"], PARAMETER["Vertical_Shift", 0.0], PARAMETER["Direction", 1.0], UNIT["Meter", 1.0]]'
				});
				var point = new Point(parseFloat(lon_mina), parseFloat(lat_mina), spatialReference);
				
				var gLayer = this.map.getLayer("gLayerCoordenadasMina");
				
				var outSpatialReferenceGeo = new SpatialReference({
					wkid: 4326
				});
				
				var outSpatialReferencePsad56 = new SpatialReference({
					wkid: 24879
				});

				// Transformo las coordenadas mina a los otros sistemas
				projection.load().then(function () {

					// Transformo a WGS84
					var projGeo = projection.project(point, outSpatialReferenceGeo);
					console.log('projGeo: ', projGeo);
					var x_wgs84 = projGeo.x.toFixed(6)
					var y_wgs84 = projGeo.y.toFixed(6)
					
					// Transformo a PSAD_56
					var projPsad = projection.project(point, outSpatialReferencePsad56);
					console.log('projPsad: ', projPsad);
					var x_psad56 = projPsad.x.toFixed(6);
					var y_psad56 = projPsad.y.toFixed(6);
					
					// Transformo a UTM
					var utm = coordinateFormatter.toUtm(projGeo, 'north-south-indicators', true);
					var arr = utm.split(' ');
					console.log('utm: ', utm);
					var coords_utm = arr[0] + ' ' + arr[1] + ' ' + arr[2];
					
					var sms = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CIRCLE).setColor(new Color([255, 0, 0, 0.5]));
					var attr = { "lon_mina": lon_mina, "lat_mina": lat_mina, "x_wgs84": x_wgs84, "y_wgs84": y_wgs84, "x_psad56": x_psad56, "y_psad56": y_psad56, "coords_utm": coords_utm};
					var infoTemplate = new InfoTemplate("Coordenadas", "<b>X:</b> ${lon_mina} <br/><b>Y:</b> ${lat_mina} <br/><b>X_WGS84:</b> ${x_wgs84} <br/><b>Y_WGS84:</b> ${y_wgs84}<br/> <b>X_PSAD56:</b> ${x_psad56} <br/><b>Y_PSAD56:</b> ${y_psad56} <br/><b>UTM:</b> ${coords_utm}");
					var graphic = new Graphic(projGeo, sms, attr, infoTemplate);
					gLayer.add(graphic);

					var tr = document.createElement('tr');
					tr.innerHTML += '<td>' + x_wgs84 + '</td>'
					tr.innerHTML += '<td>' + y_wgs84 + '</td>'
					tr.innerHTML += '<td>' + x_psad56 + '</td>'
					tr.innerHTML += '<td>' + y_psad56 + '</td>'
					tr.innerHTML += '<td>' + coords_utm + '</td>'
					var tbody = document.getElementById("tbody-container-coordinates");
					tbody.appendChild(tr);
				});
			},

			onOpen: function () {
				console.log('onOpen');
			},

			onClose: function () {
				console.log('onClose');
				// Limpio la capa
				var gLayer = this.map.getLayer("gLayerCoordenadasMina");
				gLayer.clear();
				// Limpio la tabla
				var tbody = document.getElementById("tbody-container-coordinates");
				if (tbody.hasChildNodes()) {
					while (tbody.firstChild) {
						tbody.firstChild.remove();
					}
				}
			},

			onMinimize: function () {
				console.log('onMinimize');
			},

			onMaximize: function () {
				console.log('onMaximize');
			},

			onSignIn: function (credential) {
				/* jshint unused:false*/
				console.log('onSignIn');
			},

			onSignOut: function () {
				console.log('onSignOut');
			}
		});
	});