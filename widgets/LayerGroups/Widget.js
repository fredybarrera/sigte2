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
	'dojo/query',
	'dojo/dom',
	'dojo/dom-class',
	'jimu/BaseWidget', 
	'jimu/PoolControllerMixin',
	'jimu/dijit/Message',
	'jimu/PanelManager'
],function (
	declare, 
	query,
	dom,
	domClass,
	BaseWidget, 
	PoolControllerMixin,
	Message,
	PanelManager) {

		//To create a widget, you need to derive from BaseWidget.
		return declare([BaseWidget, PoolControllerMixin], {
			// DemoWidget code goes here

			//please note that this property is be set by the framework when widget is loaded.
			//templateString: template,
			name: "Agrupación de capas de CODELCO",
			baseClass: 'jimu-widget-report',
			
			postCreate: function () {
				this.inherited(arguments);
				console.log('postCreate');
			},


			_getNextPosition: function(){
				var pos = {
					top: 10,
					left: 10,
					width: 320,
					height: 450,
					relativeTo: 'map'
				};
				return pos;
			},


			_onBtnCapa1: function () {
				let widgets = this.appConfig.widgetPool.widgets
				let iconConfig = this.appConfig.widgetPool.widgets[2]
				var pos = this._getNextPosition();
				iconConfig.panel.position = pos;
				// this.openedIds.push(iconConfig.id);
				// this.panelManager.showPanel(iconConfig).then(lang.hitch(this, function (panel) {
				// 	aspect.after(panel, 'onClose', lang.hitch(this, function () {
				// 		this._switchNodeToClose(iconConfig.id);
				// 	}));
				// }));

				this.panelManager.showPanel(iconConfig);
			},

			_onBtnCapa2: function () {
				let widgets = this.appConfig.widgetPool.widgets
				let iconConfig = this.appConfig.widgetPool.widgets[2]
				var pos = this._getNextPosition();
				iconConfig.panel.position = pos;
				this.panelManager.showPanel(iconConfig);
			},

			startup: function () {
				this.inherited(arguments);
				console.log('startup');
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

			onOpen: function () {
				console.log('onOpen');
			},

			onClose: function () {
				console.log('onClose');
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