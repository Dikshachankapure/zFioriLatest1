sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ndc/BarcodeScanner',
	'sap/ui/core/Fragment',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel'
], function (Controller, History, MessageToast, MessageBox, BarcodeScanner, Fragment, Filter, JSONModel) {
	"use strict";

	return Controller.extend("futuregrp.ZRTV.controller.Change", {
		// START OF ON INIT EVENT // 
		onInit: function () {

			var btnSave = this.getView().byId("btnSave");
			var btnHold = this.getView().byId("btnHold");
			//var btnScanbarcode = this.getView().byId("btnScanbarcode");
			var btnScannextbox = this.getView().byId("btnScannextbox");

			var oModeltableItems = new JSONModel();
			this.getView().byId("tblItems").setModel(oModeltableItems);

			var oModeltableItemsTemp = new JSONModel();
			this.getView().byId("tblItemsTemp").setModel(oModeltableItemsTemp);

			var oModelBoxItems = new JSONModel();
			this.getView().byId("drpBox").setModel(oModelBoxItems);

			var oModelItemsSave = new JSONModel();
			this.getView().byId("tblItemsSave").setModel(oModelItemsSave);

			btnSave.setVisible(true);
			btnHold.setVisible(true);
			//btnScanbarcode.setVisible(true);
			btnScannextbox.setVisible(true);

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.getRoute("change").attachPatternMatched(this._onChangeMatched, this);

		},
		// END OF ON INIT EVENT //

		// START OF ON CHNAGE DETAIL EVENT //

		_onChangeMatched: function (oEvent) {
			var oParameters = oEvent.getParameters(); // get parameter 
			var oModelData = this.getOwnerComponent().getModel("ChangeDataSet"); //get the data from model 
			this.getView().setModel(oModelData); //set the data to model
			var oModel = this.getView().getModel();

			var indentNo = this.getView().byId("txtIndentNo");
			var supplyingsite = this.getView().byId("txtSupplyingsite");
			var docutype = this.getView().byId("drpDocumenttype");
			var vendor1 = this.getView().byId("txtVendor");
			var delvrydate = this.getView().byId("dpkDeliverydate");
			var box = this.getView().byId("drpBox");
			var prodgrp = this.getView().byId("drpProdGroup");

			var that = this;

			if (oParameters.arguments.IndentNo !== "" || oParameters.arguments.IndentNo !== null) {
				this.IndentNo = oParameters.arguments.IndentNo;
				if (oModel.getData().ChangeData.length > 0) {
					for (var i = 0; i < oModel.getData().ChangeData.length; i++) {
						if (oModel.getData().ChangeData[i].IndentNo.toString() === this.IndentNo) {
							indentNo.setValue(this.IndentNo);
							supplyingsite.setValue(oModel.getData().ChangeData[i].Supplyingsite);
							docutype.setValue(oModel.getData().ChangeData[i].DocumentType);
							vendor1.setValue(oModel.getData().ChangeData[i].vendor);
							delvrydate.setValue(oModel.getData().ChangeData[i].DeliveryDate);
							box.setValue(oModel.getData().ChangeData[i].Box);
							prodgrp.setValue(oModel.getData().ChangeData[i].ProductGroup);

							that._LoadItemData(this.IndentNo);
							return false;
						}
					}
				}

			} else {
				MessageBox.error("Data Not available");
			}
		},

		_LoadItemData: function (IndentNo) {

			var oModelTask = this.getOwnerComponent().getModel("ItemsData"); //get the data from model 
			this.getView().setModel(oModelTask);
			var oModel = this.getView().getModel();
			var oTable = this.getView().byId("tblItems");

			var results = [];
			var item = {};
			var oModelItems = new JSONModel();
			var values = {
				results: []
			};

			/*	var oFilter1 = new sap.ui.model.Filter("RequestNo", sap.ui.model.FilterOperator.EQ, RequestNo);
				var allFilter = new sap.ui.model.Filter([oFilter1], false);*/

			if (oModelTask.getData().Items.length > 0) {
				for (var i = 0; i < oModelTask.getData().Items.length; i++) {
					if (values.results.length > 0) {
						if (oModelTask.getData().Items[i].IndentNo === IndentNo && oModelTask.getData().Items[i].IsAdded ===
							false) {

							item["Artical"] = oModelTask.getData().Items[i].Artical;
							item["EANScann"] = oModelTask.getData().Items[i].EANScann;
							item["ArticalDsc"] = oModelTask.getData().Items[i].ArticalDsc;
							item["Qty"] = oModelTask.getData().Items[i].Qty;
							item["MRP"] = oModelTask.getData().Items[i].MRP;
							item["Agreement"] = oModelTask.getData().Items[i].Agreement;

							oModelTask.getData().Items[i].IsAdded = true;
							values.results.push(item);
						}
					} else {
						if (oModelTask.getData().Items[i].IndentNo === IndentNo) {
							item["Artical"] = oModelTask.getData().Items[i].Artical;
							item["EANScann"] = oModelTask.getData().Items[i].EANScann;
							item["ArticalDsc"] = oModelTask.getData().Items[i].ArticalDsc;

							item["Qty"] = oModelTask.getData().Items[i].Qty;
							item["MRP"] = oModelTask.getData().Items[i].MRP;
							item["Agreement"] = oModelTask.getData().Items[i].Agreement;
							oModelTask.getData().Items[i].IsAdded = true;
							values.results.push(item);
						}
					}
				}

			}
			oModelItems.setData(values);
			oTable.setModel(oModelItems);
		},

		/*	_onChangeMatched: function (oEvent) {
				var oParameters = oEvent.getParameters();

				if (oParameters.arguments.OrderType !== "" || oParameters.arguments.OrderType !== null && oParameters.arguments.IndentNum !== "" ||
					oParameters.arguments.IndentNum !== null) {
					this.OrderType = oParameters.arguments.OrderType;
					this.IndentNo = oParameters.arguments.IndentNum;
					this._getHeaderInfo(this.IndentNo, this.OrderType);

				} else {
					MessageBox.error("Incorrect Data");
				}
			}, */
		// END OF ON CHNAGE DETAIL EVENT //

		// START OF ON NAVIGATION EVENT //
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			var that = this;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
				that.clearAllControls();
			} else {
				this.getRouter().navTo("Main", {}, true);
				that.clearAllControls();
			}
		},
		// END OF ON NAVIGATION EVENT //

		// START OF VENDOR SEARCH HELP EVENT //
		handleValueHelpVendor: function (oEvent) {
			this.getView().setModel();
			var sInputValueVendor = oEvent.getSource().getValue();

			this.inputVendorId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogVendor) {
				this._valueHelpDialogVendor = sap.ui.xmlfragment(
					"futuregrp.ZRTV.fragments.Vendor",
					this
				);
				this.getView().addDependent(this._valueHelpDialogVendor);
			}

			// create a filter for the binding
			this._valueHelpDialogVendor.getBinding("items").filter([new Filter(
				"Lifnr",
				sap.ui.model.FilterOperator.Contains, sInputValueVendor
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogVendor.open(sInputValueVendor);
		},

		_handleValueHelpSearchVendor: function (evt) {
			var sValueVendor = evt.getParameter("value");
			var oFilter = new Filter(
				"Lifnr",
				sap.ui.model.FilterOperator.Contains, sValueVendor
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseVendor: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var vendorInput = this.getView().byId(this.inputVendorId);
				vendorInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		// END OF VENDOR SEARCH HELP EVENT //

		//Start OF INDENTNO VALUE HELP//

		// START OF CLEAR DATA // 
		clearAllControls: function () {
			var txtIndentNo = this.getView().byId("txtIndentNo");
			var txtSupplyingsite = this.getView().byId("txtSupplyingsite");
			var drpDoctypeRPO = this.getView().byId("drpDocumenttype");
			var drpDocumenttypeSTO = this.getView().byId("drpDocumenttypeSTO");
			var drpDocumenttypeRL = this.getView().byId("drpDocumenttypeRL");
			var txtVendor = this.getView().byId("txtVendor");
			var txtRecSite = this.getView().byId("txtRecSite");
			var dpkDeliverydate = this.getView().byId("dpkDeliverydate");
			var txtEanscanned = this.getView().byId("txtEanscanned");
			var txtflagbox = this.getView().byId("txtflagbox");
			var txtOrderType = this.getView().byId("txtOrderType");
			var drpBox = this.getView().byId("drpBox");
			//var drpProdGroup = this.getView().byId("drpProdGroup");

			if (txtOrderType.getValue() === "RPO") {
				txtVendor.setValue(null);
				drpDoctypeRPO.setSelectedKey(0);
			} else if (txtOrderType.getValue() === "STO") {
				txtRecSite.setValue(null);
				drpDocumenttypeSTO.setSelectedKey(0);
			} else if (txtOrderType.getValue() === "RL") {
				txtVendor.setValue(null);
				txtRecSite.setValue(null);
				drpDocumenttypeRL.setSelectedKey(0);
			}
			txtIndentNo.setValue(null);
			txtSupplyingsite.setValue(null);
			dpkDeliverydate.setValue(null);
			txtflagbox.setValue("0");
			txtEanscanned.setValue(null);

			var tblItems = this.getView().byId("tblItems");
			var tblItemstemp = this.getView().byId("tblItemsTemp");
			var tblItemsSave = this.getView().byId("tblItemsSave");

			var oModelItems = tblItems.getModel();
			var oModelTemp = tblItemstemp.getModel();
			var oModelItemsSave = tblItemsSave.getModel();

			oModelItems.setData(null);
			oModelTemp.setData(null);
			oModelItemsSave.setData(null);
			tblItemstemp.setBusy(false);
			tblItems.setVisible(true);
			tblItemstemp.setVisible(false);
			tblItemsSave.setVisible(false);
			drpBox.setSelectedKey(0);
		},
		// END OF CLEAR DATA //

		// START OF GET HEADER DATA //
		_getHeaderInfo: function (IndentNumber, OrderType) {
			var that = this;
			var oModel = this.getView().getModel();
			var filters = [];
			var txtIndentNo = this.getView().byId("txtIndentNo");
			var txtSupplySite = this.getView().byId("txtSupplyingsite");
			var drpDocTypeRPO = this.getView().byId("drpDocumenttype");
			var drpDocTypeSTO = this.getView().byId("drpDocumenttypeSTO");
			var drpDocTypeRL = this.getView().byId("drpDocumenttypeRL");
			var vendor = this.getView().byId("vendor");
			var recsite = this.getView().byId("recsite");
			var txtVendor = this.getView().byId("txtVendor");
			var txtRecSite = this.getView().byId("txtRecSite");
			var txtOrderType = this.getView().byId("txtOrderType");
			var dpkDelvDate = this.getView().byId("dpkDeliverydate");
			var btnSave = this.getView().byId("btnSave");
			var btnHold = this.getView().byId("btnHold");
			//var btnScanbarcode = this.getView().byId("btnScanbarcode");
			var btnScannextbox = this.getView().byId("btnScannextbox");

			if (IndentNumber !== "" || OrderType !== null) {
				txtIndentNo.setValue(IndentNumber);
				txtOrderType.setValue(OrderType);
				if (OrderType === "RPO") {
					drpDocTypeRPO.setVisible(true);
					drpDocTypeSTO.setVisible(false);
					drpDocTypeRL.setVisible(false);

					vendor.setVisible(true);
					recsite.setVisible(false);

					var IndentnumRPOFilter = new sap.ui.model.Filter("IndentNum", "EQ", txtIndentNo.getValue());
					filters.push(IndentnumRPOFilter);
					oModel.read("/ChangeHeaderSet", {
						filters: filters,
						urlParameters: {
							"$expand": "ChangeItemSet,ChangeBoxSet,ChangeReturnSet,ChangeSaveItemSet"
						},
						success: function (oData, oResponse) {
							if (oData.results.length > 0) {
								txtSupplySite.setValue(oData.results[0].Site);
								txtVendor.setValue(oData.results[0].Lifnr);
								drpDocTypeRPO.setSelectedKey(oData.results[0].Bsart);
								if (oData.results[0].ChangeReturnSet.results.length > 0) {
									if (oData.results[0].ChangeReturnSet.results[0].Message !== "" && oData.results[0].ChangeReturnSet.results[0].Id === "RPO") {
										btnSave.setVisible(false);
										btnHold.setVisible(false);
										//btnScanbarcode.setVisible(false);
										btnScannextbox.setVisible(false);
									} else if (oData.results[0].ChangeReturnSet.results[0].Message !== "" && oData.results[0].ChangeReturnSet.results[0].Id ===
										"ZRTV_ER") {
										MessageBox.error(oData.results[0].ChangeReturnSet.results[0].Message, {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: "Error",
											onClose: function (oAction) {
												that.onNavBack();
											}
										});
									}
								} else {
									btnSave.setVisible(true);
									btnHold.setVisible(true);
									//btnScanbarcode.setVisible(true);
									btnScannextbox.setVisible(true);
								}

								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "yyyy-MM-dd"
								});
								var delvDate = oDateFormat.format(new Date(oData.results[0].Aedat));
								dpkDelvDate.setValue(delvDate);
								that._getBoxInfo(oData);

							}
						},
						error: function (oData, oResponse) {
							MessageBox.error("Error in Application", {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								onClose: function (oAction) {
									that.onNavBack();
								}
							});
						}
					});

				} else if (OrderType === "STO") {
					drpDocTypeRPO.setVisible(false);
					drpDocTypeSTO.setVisible(true);
					drpDocTypeRL.setVisible(false);

					vendor.setVisible(false);
					recsite.setVisible(true);

					var IndentnumStoFilter = new sap.ui.model.Filter("IndentNum", "EQ", txtIndentNo.getValue());
					filters.push(IndentnumStoFilter);
					oModel.read("/ChangeHeaderStoSet", {
						filters: filters,
						urlParameters: {
							"$expand": "ChangeItemStoSet,ChangeBoxStoSet,ChangeReturnStoSet,ChangeSaveStoSet"
						},
						success: function (oData, oResponse) {
							if (oData.results.length > 0) {
								txtSupplySite.setValue(oData.results[0].Site);
								txtRecSite.setValue(oData.results[0].recsite);
								drpDocTypeSTO.setSelectedKey(oData.results[0].Bsart);
								if (oData.results[0].ChangeReturnStoSet.results.length > 0) {
									if (oData.results[0].ChangeReturnStoSet.results[0].Message !== "" && oData.results[0].ChangeReturnStoSet.results[0].Id ===
										"STO") {
										btnSave.setVisible(false);
										btnHold.setVisible(false);
										//btnScanbarcode.setVisible(false);
										btnScannextbox.setVisible(false);
									} else if (oData.results[0].ChangeReturnStoSet.results[0].Message !== "" && oData.results[0].ChangeReturnStoSet.results[0]
										.Id ===
										"ZRTV_ER") {
										MessageBox.error(oData.results[0].ChangeReturnStoSet.results[0].Message, {
											icon: sap.m.MessageBox.Icon.ERROR,
											title: "Error",
											onClose: function (oAction) {
												that.onNavBack();
											}
										});
									}
								} else {
									btnSave.setVisible(true);
									btnHold.setVisible(true);
									//btnScanbarcode.setVisible(true);
									btnScannextbox.setVisible(true);
								}

								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "yyyy-MM-dd"
								});
								var delvDate = oDateFormat.format(new Date(oData.results[0].Aedat));
								dpkDelvDate.setValue(delvDate);
								that._getBoxInfo(oData);

							}
						},
						error: function (oData, oResponse) {
							MessageBox.error("Error in Application", {
								icon: sap.m.MessageBox.Icon.ERROR,
								title: "Error",
								onClose: function (oAction) {
									that.onNavBack();
								}
							});
						}
					});
				} else if (OrderType === "RL") {
					drpDocTypeRPO.setVisible(false);
					drpDocTypeSTO.setVisible(false);
					drpDocTypeRL.setVisible(true);

					vendor.setVisible(true);
					recsite.setVisible(true);
				} else {
					MessageBox.error("Please select correct order type!", {
						icon: sap.m.MessageBox.Icon.ERROR,
						title: "Error",
						onClose: function (oAction) {
							that.onNavBack();
						}
					});
				}

			}

		},
		// END OF GET HEADER DATA //

		// START OF GET BOX DATA //
		_getBoxInfo: function (oData) {
			var that = this;
			var drpBox = this.getView().byId("drpBox");
			var oModelBoxItems = new JSONModel();
			var txtOrderType = this.getView().byId("txtOrderType");
			if (txtOrderType.getValue() === "RPO") {
				if (oData.results[0].ChangeBoxSet.results.length > 0) {
					oModelBoxItems.setData(oData.results[0].ChangeBoxSet);
					drpBox.setModel(oModelBoxItems);
				} else {

					oModelBoxItems.setData({
						results: [{
							Boxid: "B001"
						}]
					});
					drpBox.setModel(oModelBoxItems);
					drpBox.setSelectedKey(0);

				}
			} else if (txtOrderType.getValue() === "STO") {
				if (oData.results[0].ChangeBoxStoSet.results.length > 0) {
					oModelBoxItems.setData(oData.results[0].ChangeBoxStoSet);
					drpBox.setModel(oModelBoxItems);
				} else {

					oModelBoxItems.setData({
						results: [{
							Boxid: "B001"
						}]
					});
					drpBox.setModel(oModelBoxItems);
					drpBox.setSelectedKey(0);

				}
			} else if (txtOrderType.getValue() === "RL") {

			}

			var oSorter = new sap.ui.model.Sorter("Boxid", true); // sort descending
			drpBox.getBinding("items").sort(oSorter);

			if (drpBox.getItems().length > 0) {
				that._getItemInfo(oData, drpBox.getFirstItem().getKey());
			}

		},
		// END OF GET BOX DATA //

		// START OF GET ITEM DATA //
		_getItemInfo: function (oData, BoxId) {
			var that = this;
			var oTableItem = this.getView().byId("tblItems");
			var txtOrderType = this.getView().byId("txtOrderType");
			var oModelTableItems = new JSONModel();

			if (txtOrderType.getValue() === "RPO") {
				oModelTableItems.setData(oData.results[0].ChangeItemSet);
			} else if (txtOrderType.getValue() === "STO") {
				oModelTableItems.setData(oData.results[0].ChangeItemStoSet);
			} else if (txtOrderType.getValue() === "RL") {

			}
			oTableItem.setModel(oModelTableItems);
			var oBindingTemp = oTableItem.getBinding("items");
			if (oBindingTemp) {
				var oFiltersItems = [new sap.ui.model.Filter("Boxid", sap.ui.model.FilterOperator.Contains, BoxId)];
				var filterObjItems = new sap.ui.model.Filter(oFiltersItems, false);
				oBindingTemp.filter(filterObjItems);
			} else {
				oBindingTemp.filter([]);
			}
			that._getSelectedProductInfo();
		},
		// END OF GET ITEM DATA //

		// START OF CHANGE BOX EVENT //
		_onChangeBox: function () {
			var that = this;
			var BoxId = this.getView().byId("drpBox").getSelectedKey();
			var tblItems = this.getView().byId("tblItems");
			var tblItemsTemp = this.getView().byId("tblItemsTemp");

			tblItems.setVisible(true);
			tblItemsTemp.setVisible(false);
			var oBindingItems = tblItems.getBinding("items");
			if (oBindingItems) {
				var oFilters = [new sap.ui.model.Filter("Boxid", sap.ui.model.FilterOperator.Contains, BoxId)];
				var filterObj = new sap.ui.model.Filter(oFilters, false);
				oBindingItems.filter(filterObj);
			} else {
				oBindingItems.filter([]);

			}
			that._getSelectedProductInfo();
		},
		// END OF CHANGE BOX EVENT //

		// START OF GET PRODUCT DATA //
		_getSelectedProductInfo: function () {
			var oTableItem = this.getView().byId("tblItems");
			var drpProdGroup = this.getView().byId("drpProdGroup");
			var oModelItems = oTableItem.getModel();
			var aItems = oTableItem.getItems();
			if (aItems.length > 0) {
				for (var i = 0; i < aItems.length; i++) {
					var oProdGrp = oModelItems.getProperty("Pgrp", aItems[i].getBindingContext());
					drpProdGroup.setSelectedKey(oProdGrp);
					drpProdGroup.setEnabled(false);
					break;
				}
			} else {
				drpProdGroup.setSelectedKey("");
				drpProdGroup.setEnabled(true);
			}
		},
		// END OF GET PRODUCT DATA //

		// START OF SCAN NEXT BOX EVENT //
		onScanNextBox: function () {
			var that = this;
			var tblItems = this.getView().byId("tblItems");
			var tblItemsTemp = this.getView().byId("tblItemsTemp");
			var oModelTemp = tblItemsTemp.getModel();
			var aItems = tblItems.getItems();
			var aItemsTemp = tblItemsTemp.getItems();
			if (aItemsTemp.length === 0 && aItems.length === 0) {
				MessageBox.error("Please scan articles first");
			} else {
				oModelTemp.setData("");
				that.oFuncScanNextBox();
			}
		},

		oFuncScanNextBox: function () {
			var oModel = this.getView().getModel();
			var drpBox = this.getView().byId("drpBox");
			var tblItems = this.getView().byId("tblItems");
			var tblItemsTemp = this.getView().byId("tblItemsTemp");
			var txtflagbox = this.getView().byId("txtflagbox");

			var txtEanscanned = this.getView().byId("txtEanscanned");
			var objProdGroup = this.getView().byId("drpProdGroup");

			oModel.read("/BoxIdSet('" + drpBox.getSelectedKey() + "')", {
				success: function (oData, oResponse) {

					if (drpBox.getSelectedKey() === drpBox.getFirstItem().getText()) {
						var newItem = new sap.ui.core.Item({
							key: oResponse.data.Eboxid,
							text: oResponse.data.Eboxid
						});

						drpBox.insertItem(newItem, 0);
						drpBox.setSelectedKey(oResponse.data.Eboxid);
						txtEanscanned.setValue("");
						objProdGroup.setEnabled(true);
						objProdGroup.setSelectedKey("");
						tblItems.setVisible(false);
						tblItemsTemp.setVisible(true);
						txtflagbox.setValue("1");

					} else {
						MessageBox.error("Select Last Scanned box from list");
						return false;
					}

				},
				error: function (oData, oResponse) {
					MessageBox.error("Box Data Error");
				}
			});

		},
		// END OF SCAN NEXT BOX EVENT //

		// START OF BARCODE SCAN EVENT //
		onEANBarcodeScan: function () {
			var oEanscanned = this.getView().byId("txtEanscanned");
			var that = this;
			//var oBtnScan = this.getView().byId("btnScanbarcode");
			sap.ndc.BarcodeScanner.scan(
				function (mResult) {
					oEanscanned.setValue(mResult.text);
					that.onChangeEanScanned(mResult.text);
				},
				function (Error) {
					MessageBox.Show("Scanning failed: " + Error);
				}
			);
		},

		/*_validateDevlierydate: function (Deldate) {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			}
			if (mm < 10) {
				mm = '0' + mm;
			}
			today = yyyy + '-' + mm + '-' + dd;
			if (Deldate < today) {
				MessageBox.error("Delivery Date is less than current date");
				return false;
			}
		},*/

		onChangeEanScanned: function (Eannumber) {
			var that = this;
			var oModel = this.getView().getModel();
			var BoxId = this.getView().byId("drpBox").getSelectedKey();

			if (Eannumber !== "") {

				if (Eannumber !== "" || Eannumber !== 0) {
					var filters = [];

					// Header Level Data 
					var objSupplyingSite = this.getView().byId("txtSupplyingsite").getValue();
					var objVendor = this.getView().byId("txtVendor").getValue();
					var objRecSite = this.getView().byId("txtRecSite").getValue();
					var objDocType = this.getView().byId("drpDocumenttype").getSelectedKey();
					var objDocTypeSTO = this.getView().byId("drpDocumenttypeSTO").getSelectedKey();
					var objProdGroup = this.getView().byId("drpProdGroup");
					var PgrpKey = objProdGroup.getSelectedKey();
					var objDelvDate = this.getView().byId("dpkDeliverydate").getValue();
					var txtflagbox = this.getView().byId("txtflagbox");
					// Item Level Data
					var objBoxId = this.getView().byId("drpBox").getSelectedKey();
					var txtEanscanned = this.getView().byId("txtEanscanned");
					var IndentNo = this.getView().byId("txtIndentNo").getValue();
					var btnSave = this.getView().byId("btnSave");

					var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth() + 1; //January is 0!
					var yyyy = today.getFullYear();
					if (dd < 10) {
						dd = '0' + dd;
					}
					if (mm < 10) {
						mm = '0' + mm;
					}
					today = yyyy + '-' + mm + '-' + dd;
					if (objDelvDate < today) {
						MessageBox.error("Delivery Date is less than current date");
						return false;
					}

					if (objProdGroup.getSelectedKey() === "") {
						txtEanscanned.setValue("");
						MessageBox.error("Select Product Group");
						return false;
					}

					// Filter of Data 
					var SupplyingSite = new sap.ui.model.Filter("Werks", "EQ", objSupplyingSite);
					var StorageLocationFilter = new sap.ui.model.Filter("Sloc", "EQ", "10");
					var DeliveryDateFilter = new sap.ui.model.Filter("Aedat", "EQ", objDelvDate);

					var BoxID = new sap.ui.model.Filter("BoxId", "EQ", objBoxId);
					var EanScan = new sap.ui.model.Filter("Eanscan", "EQ", Eannumber);
					var Pgrp = new sap.ui.model.Filter("Pgrp", "EQ", objProdGroup.getSelectedKey());

					// Declaration of Tables 
					var oTableItem = this.getView().byId("tblItems");
					var oTableItemTemp = this.getView().byId("tblItemsTemp");
					var oTableItemSave = this.getView().byId("tblItemsSave");

					//  Declaration of JSON Models 

					var oModelItems = new JSONModel();
					var oModelItemsTemp = new JSONModel();
					var oModelItemsSave = new JSONModel();
					//var oModelItemsCopy = new JSONModel();

					//  Get table Models 
					var oModelTable = oTableItem.getModel();
					var oModelTableTemp = oTableItemTemp.getModel();
					var oModelTableSave = oTableItemSave.getModel();
					// Get Items of the Table
					var aItems = oTableItem.getItems();
					var aItemsTemp = oTableItemTemp.getItems();
					oTableItemTemp.setBusy(true);

					// Array of items 
					var item = {};
					var objSet = "";
					var DocumentTypeFilter = "";
					var oEanNumber, oQty, oMrp, oBoxId, oPgrp, oEanNumberTemp, oQtyTemp, oMrpTemp, oBoxIdTemp, oPgrpTemp = "";
					if (that.OrderType === "RPO") {
						objSet = "/ItemGetSet";
						DocumentTypeFilter = new sap.ui.model.Filter("Bsart", "EQ", objDocType);
						var VendorFilter = new sap.ui.model.Filter("Lifnr", "EQ", objVendor);
						filters.push(SupplyingSite, VendorFilter, StorageLocationFilter, DocumentTypeFilter, DeliveryDateFilter,
							BoxID,
							EanScan, Pgrp);
					} else if (that.OrderType === "STO") {
						objSet = "/ItemGetStoSet";
						DocumentTypeFilter = new sap.ui.model.Filter("Bsart", "EQ", objDocTypeSTO);
						var RecSiteFilter = new sap.ui.model.Filter("RecSite", "EQ", objRecSite);
						filters.push(SupplyingSite, RecSiteFilter, StorageLocationFilter, DocumentTypeFilter, DeliveryDateFilter,
							BoxID,
							EanScan, Pgrp);
					}

					// Get Data of Items by Eannumber
					oModel.read("" + objSet + "", {
						filters: filters,
						success: function (oData, oResponse) {
							if (oResponse.data.results.length === 0) {
								MessageBox.error("Please Enter Correct EAN Number");
								oTableItemTemp.setBusy(false);
							} else if (oData.results[0].Matnr === "" && oResponse.data.results[0].Message === "ERROR") {
								var arrOutput = [];
								for (var i = 0; i < oData.results.length; i++) {
									arrOutput[i] = " - " + oData.results[i].Message + "\n";
								}
								arrOutput.splice(0, 1);
								var message = arrOutput.toString();
								MessageBox.error(message.replace(/\,/g, ""));
								oTableItemTemp.setBusy(false);
							} else if (oData.results[0].Matnr === "" && oResponse.data.results[0].Message === "") {
								MessageBox.error("EAN Number is not Valid");
								oTableItemTemp.setBusy(false);
							} else if (oData.results[0].Matnr !== "") {

								if (oResponse.data.results[0].Message !== "") {
									arrOutput = [];
									for (i = 0; i < oData.results.length; i++) {
										arrOutput[i] = " - " + oData.results[i].Message + "\n";
									}
									message = arrOutput.toString();
									MessageBox.error(message.replace(/\,/g, ""));
									btnSave.setVisible(false);
								}
								var values = oModelTable.getData();
								if (oModelTable.getData() !== null) {
									if (values.results === undefined) {
										values = {
											results: []
										};
									}

								} else {
									values = {
										results: []
									};
								}
								var valuesTemp = oModelTableTemp.getData();
								if (oModelTableTemp.getData() !== null) {

									if (valuesTemp.results === undefined) {
										valuesTemp = {
											results: []
										};
									}

								} else {
									valuesTemp = {
										results: []
									};
								}
								if (oModelTableSave.getData() !== null) {
									var valuesTempSave = oModelTableSave.getData();
									if (valuesTempSave.results === undefined) {
										valuesTempSave = {
											results: []
										};
									}

								} else {
									valuesTempSave = {
										results: []
									};
								}
								if (txtflagbox.getValue() === "1") {
									if (aItemsTemp.length > 0) {
										for (var iRowindextemp = 0; iRowindextemp < aItemsTemp.length; iRowindextemp++) {
											oQtyTemp = oModelTableTemp.getProperty("Menge", aItemsTemp[iRowindextemp].getBindingContext());
											oMrpTemp = oModelTableTemp.getProperty("Mrp", aItemsTemp[iRowindextemp].getBindingContext());
											oEanNumberTemp = oModelTableTemp.getProperty("Eanscan1", aItemsTemp[iRowindextemp].getBindingContext());
											oBoxIdTemp = oModelTableTemp.getProperty("Boxid", aItemsTemp[iRowindextemp].getBindingContext());
											oPgrpTemp = oModelTableTemp.getProperty("Pgrp", aItemsTemp[iRowindextemp].getBindingContext());
											if (Eannumber === oEanNumberTemp && BoxID.oValue1 === oBoxIdTemp && objProdGroup.getSelectedKey() === oPgrpTemp) {
												item["IndentNum"] = IndentNo;
												item["Eanscan1"] = Eannumber;
												item["Boxid"] = BoxId;
												item["Pgrp"] = PgrpKey;

												var totalTemp = 1;
												var QtyTemp = parseInt(oQtyTemp);
												totalTemp = QtyTemp + totalTemp;
												var MrpTemp = parseFloat(oMrpTemp) + parseFloat(oData.results[0].Mrp);

												valuesTemp.results[iRowindextemp].Menge = totalTemp + ".000";
												valuesTemp.results[iRowindextemp].Mrp = MrpTemp + ".000";
												valuesTempSave.results.push(item);

												oModelItemsTemp.setData(valuesTemp);
												oTableItemTemp.setModel(oModelItemsTemp);

												oModelItemsSave.setData(valuesTempSave);
												oTableItemSave.setModel(oModelItemsSave);

												oTableItemTemp.setVisible(true);
												oTableItem.setVisible(false);

												oTableItemTemp.setBusy(false);
												objProdGroup.setEnabled(false);

												var oBinding = oTableItemTemp.getBinding("items");
												if (oBinding) {
													var oFilters = [new sap.ui.model.Filter("Boxid", sap.ui.model.FilterOperator.Contains, BoxID.oValue1)];
													var filterObj = new sap.ui.model.Filter(oFilters, false);
													oBinding.filter(filterObj);
												} else {
													oBinding.filter([]);
												}
												return false;

											}
										}
										for (iRowindextemp = 0; iRowindextemp < aItemsTemp.length; iRowindextemp++) {
											oEanNumberTemp = oModelTableTemp.getProperty("Eanscan1", aItemsTemp[iRowindextemp].getBindingContext());
											oBoxIdTemp = oModelTableTemp.getProperty("Boxid", aItemsTemp[iRowindextemp].getBindingContext());
											oPgrpTemp = oModelTableTemp.getProperty("Pgrp", aItemsTemp[iRowindextemp].getBindingContext());
											if (Eannumber !== oEanNumberTemp && BoxID.oValue1 === oBoxIdTemp && objProdGroup.getSelectedKey() === oPgrpTemp) {
												item["IndentNum"] = IndentNo;
												item["Matnr"] = oData.results[0].Matnr;
												item["Eanscan1"] = Eannumber;
												item["Maktx"] = oData.results[0].Maktx;
												item["Menge"] = oData.results[0].Menge;
												item["Mrp"] = oData.results[0].Mrp;
												item["Agreement"] = oData.results[0].Agreement;
												item["Boxid"] = BoxId;
												item["Pgrp"] = PgrpKey;

												values.results.push(item);
												valuesTemp.results.push(item);
												valuesTempSave.results.push(item);

												oModelItems.setData(values);
												oTableItem.setModel(oModelItems);

												oModelItemsTemp.setData(valuesTemp);
												oTableItemTemp.setModel(oModelItemsTemp);

												oModelItemsSave.setData(valuesTempSave);
												oTableItemSave.setModel(oModelItemsSave);

												oTableItemTemp.setVisible(true);
												oTableItem.setVisible(false);

												oTableItemTemp.setBusy(false);
												objProdGroup.setEnabled(false);

												return false;

											}

										}

									} else {
										item["IndentNum"] = IndentNo;
										item["Matnr"] = oData.results[0].Matnr;
										item["Eanscan1"] = Eannumber;
										item["Maktx"] = oData.results[0].Maktx;
										item["Menge"] = oData.results[0].Menge;
										item["Mrp"] = oData.results[0].Mrp;
										item["Agreement"] = oData.results[0].Agreement;
										item["Boxid"] = BoxId;
										item["Pgrp"] = PgrpKey;

										values.results.push(item);
										valuesTemp.results.push(item);
										valuesTempSave.results.push(item);

										oModelItems.setData(values);
										oTableItem.setModel(oModelItems);

										oModelItemsTemp.setData(valuesTemp);
										oTableItemTemp.setModel(oModelItemsTemp);

										oModelItemsSave.setData(valuesTempSave);
										oTableItemSave.setModel(oModelItemsSave);

										oTableItemTemp.setVisible(true);
										oTableItem.setVisible(false);

										oTableItemTemp.setBusy(false);
										objProdGroup.setEnabled(false);
										return false;

									}
								}
								if (aItems.length > 0) {
									for (var iBox = 0; iBox < aItems.length; iBox++) {
										oQty = oModelTable.getProperty("Menge", aItems[iBox].getBindingContext());
										oMrp = oModelTable.getProperty("Mrp", aItems[iBox].getBindingContext());
										oEanNumber = oModelTable.getProperty("Eanscan1", aItems[iBox].getBindingContext());
										oBoxId = oModelTable.getProperty("Boxid", aItems[iBox].getBindingContext());
										oPgrp = oModelTable.getProperty("Pgrp", aItems[iBox].getBindingContext());
										if (Eannumber === oEanNumber && BoxID.oValue1 === oBoxId && objProdGroup.getSelectedKey() === oPgrp) {
											for (var j = 0; j < values.results.length; j++) {
												if (Eannumber === values.results[j].Eanscan1 && BoxID.oValue1 === values.results[j].Boxid && objProdGroup.getSelectedKey() ===
													values.results[j].Pgrp) {
													item["IndentNum"] = IndentNo;
													item["Eanscan1"] = Eannumber;
													item["Boxid"] = BoxId;
													item["Pgrp"] = PgrpKey;

													var total = 1;
													var Qty = parseInt(oQty);
													total = Qty + total;
													var Mrp = parseFloat(oMrp) + parseFloat(oData.results[0].Mrp);

													values.results[j].Menge = total + ".000";
													values.results[j].Mrp = Mrp + ".000";
													valuesTempSave.results.push(item);

													oModelItems.setData(values);
													oTableItem.setModel(oModelItems);

													oModelItemsSave.setData(valuesTempSave);
													oTableItemSave.setModel(oModelItemsSave);

													oTableItemTemp.setVisible(false);
													oTableItem.setVisible(true);

													oTableItemTemp.setBusy(false);
													objProdGroup.setEnabled(false);

													oBinding = oTableItem.getBinding("items");
													if (oBinding) {
														oFilters = [new sap.ui.model.Filter("Boxid", sap.ui.model.FilterOperator.Contains, BoxID.oValue1)];
														filterObj = new sap.ui.model.Filter(oFilters, false);
														oBinding.filter(filterObj);
													} else {
														oBinding.filter([]);
													}
													return false;
												}
											}

										}

									}
									for (iBox = 0; iBox < aItems.length; iBox++) {
										oEanNumber = oModelTable.getProperty("Eanscan1", aItems[iBox].getBindingContext());
										oBoxId = oModelTable.getProperty("Boxid", aItems[iBox].getBindingContext());
										oPgrp = oModelTable.getProperty("Pgrp", aItems[iBox].getBindingContext());
										if (Eannumber !== oEanNumber && BoxID.oValue1 === oBoxId && objProdGroup.getSelectedKey() === oPgrp) {
											item["IndentNum"] = IndentNo;
											item["Matnr"] = oData.results[0].Matnr;
											item["Eanscan1"] = Eannumber;
											item["Maktx"] = oData.results[0].Maktx;
											item["Menge"] = oData.results[0].Menge;
											item["Mrp"] = oData.results[0].Mrp;
											item["Agreement"] = oData.results[0].Agreement;
											item["Boxid"] = BoxId;
											item["Pgrp"] = PgrpKey;

											values.results.push(item);
											valuesTempSave.results.push(item);

											oModelItems.setData(values);
											oTableItem.setModel(oModelItems);

											oModelItemsSave.setData(valuesTempSave);
											oTableItemSave.setModel(oModelItemsSave);

											oTableItemTemp.setVisible(false);
											oTableItem.setVisible(true);

											oTableItemTemp.setBusy(false);
											objProdGroup.setEnabled(false);

											oBinding = oTableItem.getBinding("items");
											if (oBinding) {
												oFilters = [new sap.ui.model.Filter("Boxid", sap.ui.model.FilterOperator.Contains, BoxID.oValue1)];
												filterObj = new sap.ui.model.Filter(oFilters, false);
												oBinding.filter(filterObj);
											} else {
												oBinding.filter([]);
											}
											return false;

										}

									}

								} else {
									item["IndentNum"] = IndentNo;
									item["Matnr"] = oData.results[0].Matnr;
									item["Eanscan1"] = Eannumber;
									item["Maktx"] = oData.results[0].Maktx;
									item["Menge"] = oData.results[0].Menge;
									item["Mrp"] = oData.results[0].Mrp;
									item["Agreement"] = oData.results[0].Agreement;
									item["Boxid"] = BoxId;
									item["Pgrp"] = PgrpKey;

									values.results.push(item);
									valuesTempSave.results.push(item);

									oModelItems.setData(values);
									oTableItem.setModel(oModelItems);

									oModelItemsSave.setData(valuesTempSave);
									oTableItemSave.setModel(oModelItemsSave);

									oTableItemTemp.setVisible(false);
									oTableItem.setVisible(true);

									oTableItemTemp.setBusy(false);
									objProdGroup.setEnabled(false);

									oBinding = oTableItem.getBinding("items");
									if (oBinding) {
										oFilters = [new sap.ui.model.Filter("Boxid", sap.ui.model.FilterOperator.Contains, BoxID.oValue1)];
										filterObj = new sap.ui.model.Filter(oFilters, false);
										oBinding.filter(filterObj);
									} else {
										oBinding.filter([]);
									}
									return false;
								}

							} else {

								arrOutput = [];
								for (i = 0; i < oData.results.length; i++) {
									arrOutput[i] = "  " + oData.results[i].Message + "\n";
								}
								message = arrOutput.toString();
								MessageBox.error(message.replace(/\,/g, ""));
								oTableItem.setBusy(false);
							}
						},
						error: function (oData, oResponse) {
							MessageBox.error("Error in items!");
						}
					});
				}
			}
		},
		// END OF BARCODE SCAN EVENT //

		// START OF ON HOLD BUTTON EVENT // 
		onHold: function () {
			var txtOrderType = this.getView().byId("txtOrderType").getValue();
			var oModel = this.getView().getModel();
			var panel2 = this.getView().byId("panel2");

			var txtIndentNo = this.getView().byId("txtIndentNo").getValue();
			var txtSupplySite = this.getView().byId("txtSupplyingsite").getValue();

			var txtVendor = this.getView().byId("txtVendor").getValue();
			var txtRecSite = this.getView().byId("txtRecSite").getValue();
			var dpkDelvDate = this.getView().byId("dpkDeliverydate").getValue();

			//Create all the records added to table via Json model
			var oTableItemsSave = this.getView().byId("tblItemsSave");
			var oModelItemsSave = oTableItemsSave.getModel();

			var aItems = oTableItemsSave.getItems();

			if (txtIndentNo === 0 || txtIndentNo === "") {
				MessageBox.error("Select Supplying Site");
				return false;
			} else if (txtSupplySite === 0 || txtSupplySite === "") {
				MessageBox.error("Select Supplying Site");
				return false;
			} else if (txtOrderType === "RPO" && txtVendor.trim().length === 0) {
				MessageBox.error("Select Vendor");
				return false;
			} else if (txtOrderType === "STO" && txtRecSite.trim().length === 0) {
				MessageBox.error("Select Receiving Site");
				return false;
			} else if (dpkDelvDate === "" || dpkDelvDate === null) {
				MessageBox.error("Select Delivery Date");
				return false;
			} else {
				var that = this;
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1; //January is 0!
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = yyyy + '-' + mm + '-' + dd;
				if (dpkDelvDate < today) {
					MessageBox.error("Delivery Date is less than current date");
					return false;
				}

				var oItems = {};
				oItems.IndentNum = txtIndentNo;
				oItems.Aedat = dpkDelvDate + "T00:00:00";

				var itemData = [];
				var itemReturn = [];

				if (aItems.length > 0) {
					for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
						var Eanscan = oModelItemsSave.getProperty("Eanscan1", aItems[iRowIndex].getBindingContext());
						var BoxId = oModelItemsSave.getProperty("Boxid", aItems[iRowIndex].getBindingContext());
						var Pgrp = oModelItemsSave.getProperty("Pgrp", aItems[iRowIndex].getBindingContext());
						itemData.push({
							Eanscan: Eanscan,
							Box: BoxId,
							Zprgp: Pgrp
						});
						itemReturn.push({});
					}
				} else {
					itemData.push({});
					itemReturn.push({});
				}

				var objSet = "";
				if (txtOrderType === "RPO") {
					oItems.Lifnr = txtVendor;
					objSet = "/ChangeHeaderHoldSet";
					oItems.ChangeItemHoldSet = itemData;
					oItems.ChangReturnHoldSet = itemReturn;
				} else if (txtOrderType === "STO") {
					oItems.Lifnr = "";
					objSet = "/ChangeHeaderHoldStoSet";
					oItems.ChangeItemHoldStoSet = itemData;
					oItems.ChangeReturnHoldStoSet = itemReturn;
				}

				var arrOutput = [];
				var message = "";

				panel2.setBusy(true);
				oModel.setHeaders({
					"X-Requested-With": "X"
				});
				oModel.create("" + objSet + "", oItems, {
					success: function (oData, oResponse) {
						if (txtOrderType === "RPO") {
							if (oResponse.data.ChangReturnHoldSet === null) {
								MessageBox.information("Error in Hold");
								panel2.setBusy(false);
								return false;
							} else {
								for (var i = 0; i < oResponse.data.ChangReturnHoldSet.results.length; i++) {
									if (oResponse.data.ChangReturnHoldSet.results === null) {
										MessageBox.error("No Data available!");
										return false;
									}
									if (oResponse.data.ChangReturnHoldSet.results[i].Type === "I" && oResponse.data.ChangReturnHoldSet.results[i].Id ===
										"ZRTV_MSG") {
										arrOutput = [];
										for (i = 0; i < oResponse.data.ChangReturnHoldSet.results.length; i++) {
											arrOutput[i] = " - " + oResponse.data.ChangReturnHoldSet.results[i].Message + "\n";
										}
										message = arrOutput.toString();
										MessageBox.error(message.replace(/\,/g, ""));
										panel2.setBusy(false);
										return false;
									} else if (oResponse.data.ChangReturnHoldSet.results[i].Type === "S") {
										MessageBox.success(oResponse.data.ChangReturnHoldSet.results[i].Message, {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Success",
											onClose: function (oAction) {
												panel2.setBusy(false);
												that.onNavBack();
											}
										});
										return false;
									}
								}
							}

						} else if (txtOrderType === "STO") {
							if (oResponse.data.ChangeReturnHoldStoSet === null) {
								MessageBox.information("Error in Hold");
								panel2.setBusy(false);
								return false;
							} else {
								for (var i = 0; i < oResponse.data.ChangeReturnHoldStoSet.results.length; i++) {
									if (oResponse.data.ChangeReturnHoldStoSet.results === null) {
										MessageBox.error("No Data available!");
										return false;
									}
									if (oResponse.data.ChangeReturnHoldStoSet.results[i].Type === "I" && oResponse.data.ChangeReturnHoldStoSet.results[i].Id ===
										"ZRTV_MSG") {
										arrOutput = [];
										for (i = 0; i < oResponse.data.ChangeReturnHoldStoSet.results.length; i++) {
											arrOutput[i] = " - " + oResponse.data.ChangeReturnHoldStoSet.results[i].Message + "\n";
										}
										message = arrOutput.toString();
										MessageBox.error(message.replace(/\,/g, ""));
										panel2.setBusy(false);
										return false;
									} else if (oResponse.data.ChangeReturnHoldStoSet.results[i].Type === "S") {
										MessageBox.success(oResponse.data.ChangeReturnHoldStoSet.results[i].Message, {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Success",
											onClose: function (oAction) {
												panel2.setBusy(false);
												that.onNavBack();
											}
										});
										return false;
									}
								}
							}
						}
					},
					error: function (oError) {
						MessageBox.show("Hold Failed ");
						panel2.setBusy(false);
					}
				});

			}
		},
		// END OF ON HOLD BUTTON EVENT //
		
			 Gotopage1: function () {

 			this.getRouter().navTo("main", {}, true);
 
 			var that = this;
 			that._onHold();
 		},


		_onSave: function () {

			var msg = "Data Save Successfully";
			MessageToast.show(msg);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main");

		},
		
			_onHold : function(){
			
		 		var msg = "Data Hold Successfully";
			MessageToast.show(msg);
			
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("main");

	
		 },

		// START OF ON SAVE BUTTON EVENT // 
		onSave: function () {
			var oModel = this.getView().getModel();
			var panel2 = this.getView().byId("panel2");

			var txtOrderType = this.getView().byId("txtOrderType").getValue();
			var txtIndentNo = this.getView().byId("txtIndentNo").getValue();
			var txtSupplySite = this.getView().byId("txtSupplyingsite").getValue();
			var txtVendor = this.getView().byId("txtVendor").getValue();
			var dpkDelvDate = this.getView().byId("dpkDeliverydate").getValue();

			//Create all the records added to table via Json model
			var oTableItemsSave = this.getView().byId("tblItemsSave");
			var oModelItemsSave = oTableItemsSave.getModel();
			var aItems = oTableItemsSave.getItems();

			if (txtIndentNo === 0 || txtIndentNo === "") {
				MessageBox.error("Select Supplying Site");
				return false;
			} else if (txtSupplySite === 0 || txtSupplySite === "") {
				MessageBox.error("Select Supplying Site");
				return false;
			} else if (txtOrderType === "RPO" && txtVendor.trim().length === 0) {
				MessageBox.error("Select Vendor");
				return false;
			} else if (dpkDelvDate === "" || dpkDelvDate === null) {
				MessageBox.error("Select Delivery Date");
				return false;
			} else {

				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1; //January is 0!
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = yyyy + '-' + mm + '-' + dd;
				if (dpkDelvDate < today) {
					MessageBox.error("Delivery Date is less than current date");
					return false;
				}
				var oItems = {};
				oItems.IndentNum = txtIndentNo;
				oItems.Aedat = dpkDelvDate + "T00:00:00";

				var itemData = [];
				var itemReturn = [];
				var that = this;
				if (aItems.length > 0) {
					for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
						var Eanscan = oModelItemsSave.getProperty("Eanscan1", aItems[iRowIndex].getBindingContext());
						var BoxId = oModelItemsSave.getProperty("Boxid", aItems[iRowIndex].getBindingContext());
						var Pgrp = oModelItemsSave.getProperty("Pgrp", aItems[iRowIndex].getBindingContext());
						itemData.push({
							Eanscan: Eanscan,
							Box: BoxId,
							Zprgp: Pgrp
						});
						itemReturn.push({});
					}
				}

				var objSet = "";
				if (txtOrderType === "RPO") {
					oItems.Lifnr = txtVendor;
					objSet = "/ChangeHeaderSaveSet";
					oItems.ChangeItemSaveSet = itemData;
					oItems.ChangeReturnSaveSet = itemReturn;
				} else if (txtOrderType === "STO") {
					oItems.Lifnr = "";
					objSet = "/ChangeHeaderSaveStoSet";
					oItems.ChangeItemSaveStoSet = itemData;
					oItems.ChangeReturnSaveStoSet = itemReturn;
				}

				oModel.setHeaders({
					"X-Requested-With": "X"
				});
				panel2.setBusy(true);
				var arrOutput = [];
				var message = "";

				oModel.create("" + objSet + "", oItems, {
					success: function (oData, oResponse) {
						if (txtOrderType === "RPO") {
							if (oResponse.data.ChangeReturnSaveSet === null) {
								MessageBox.information("No Data available");
								panel2.setBusy(false);
								return false;
							} else {
								for (var i = 0; i < oResponse.data.ChangeReturnSaveSet.results.length; i++) {
									if (oResponse.data.ChangeReturnSaveSet.results[i].Type === "I" && oResponse.data.ChangeReturnSaveSet.results[i].Id ===
										"ZRTV_ER") {
										arrOutput = [];
										for (i = 0; i < oResponse.data.ChangeReturnSaveSet.results.length; i++) {
											arrOutput[i] = " - " + oResponse.data.ChangeReturnSaveSet.results[i].Message + "\n";
										}
										message = arrOutput.toString();
										MessageBox.error(message.replace(/\,/g, ""));
										panel2.setBusy(false);
										return false;
									} else if (oResponse.data.ChangeReturnSaveSet.results[i].Type === "S") {
										MessageBox.success(oResponse.data.ChangeReturnSaveSet.results[i].Message, {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Success",
											onClose: function (oAction) {
												panel2.setBusy(false);
												that.onNavBack();
											}
										});
										return false;
									}
								}
							}
						} else if (txtOrderType === "STO") {
							if (oResponse.data.ChangeReturnSaveStoSet === null) {
								MessageBox.information("No Data available");
								panel2.setBusy(false);
								return false;
							} else {
								for (var i = 0; i < oResponse.data.ChangeReturnSaveStoSet.results.length; i++) {
									if (oResponse.data.ChangeReturnSaveStoSet.results[i].Type === "I" && oResponse.data.ChangeReturnSaveStoSet.results[i].Id ===
										"ZRTV_ER") {
										arrOutput = [];
										for (i = 0; i < oResponse.data.ChangeReturnSaveStoSet.results.length; i++) {
											arrOutput[i] = " - " + oResponse.data.ChangeReturnSaveStoSet.results[i].Message + "\n";
										}
										message = arrOutput.toString();
										MessageBox.error(message.replace(/\,/g, ""));
										panel2.setBusy(false);
										return false;
									} else if (oResponse.data.ChangeReturnSaveStoSet.results[i].Type === "S") {
										MessageBox.success(oResponse.data.ChangeReturnSaveStoSet.results[i].Message, {
											icon: sap.m.MessageBox.Icon.SUCCESS,
											title: "Success",
											onClose: function (oAction) {
												panel2.setBusy(false);
												that.onNavBack();
											}
										});
										return false;
									}
								}
							}
						}

					},
					error: function (oError) {
						MessageBox.show("Save Record Failed ");
						panel2.setBusy(false);
					}

				});

			}
		},
		// END OF ON SAVE BUTTON EVENT //

		// START OF ON DELETE BUTTON EVENT //

		onDelete: function (oEvent) {

			var tblItems = this.getView().byId("tblItems");
			var tblItemsTemp = this.getView().byId("tblItemsTemp");
			var tblItemsSave = this.getView().byId("tblItemsSave");

			var oModelItems = tblItems.getModel();
			var oModelItemsTemp = tblItemsTemp.getModel();
			var oModelItemsSave = tblItemsSave.getModel();

			var aItems = tblItems.getItems();
			var aItemsTemp = tblItemsTemp.getItems();
			var aItemsSave = tblItemsSave.getItems();

			var values = oModelItems.getData();
			var valuesTemp = oModelItemsTemp.getData();
			var valuesTempSave = oModelItemsSave.getData();

			var deleteRecord = oEvent.getSource().getBindingContext().getObject();
			if (aItems.length > 0) {
				for (var i = 0; i < values.results.length; i++) {
					if (values.results[i].Eanscan1 === deleteRecord.Eanscan1 && values.results[i].Boxid === deleteRecord.Boxid) {
						values.results.splice(i, 1);
						oModelItems.refresh();
						break;
					}
				}
				oModelItems.setData(values);
				tblItems.setModel(oModelItems);
			}
			if (aItemsTemp.length > 0) {
				for (var j = 0; j < valuesTemp.results.length; j++) {
					if (valuesTemp.results[j].Eanscan1 === deleteRecord.Eanscan1 && valuesTemp.results[j].Boxid === deleteRecord.Boxid) {
						valuesTemp.results.splice(j, 1);
						oModelItemsTemp.refresh();
						break;
					}
				}

				oModelItemsTemp.setData(valuesTemp);
				tblItemsTemp.setModel(oModelItemsTemp);
			}
			if (aItemsSave.length > 0) {
				for (var temp = 0; temp < aItemsSave.length; temp++) {
					for (var k = 0; k < valuesTempSave.results.length; k++) {
						if (valuesTempSave.results[k].Eanscan1 === deleteRecord.Eanscan1 && valuesTempSave.results[k].Boxid === deleteRecord.Boxid) {
							valuesTempSave.results.splice(k, 1);
							oModelItemsSave.refresh();
						}
					}
				}

				oModelItemsSave.setData(valuesTempSave);
				tblItemsSave.setModel(oModelItemsSave);
			}
		},
		onEanScanLiveChange: function (oEvent) {
				var txtEanscanned = this.getView().byId("txtEanscanned");
				var eanValue = oEvent.getSource().getValue();
				var that = this;
				that.onChangeEanScanned(eanValue);
				txtEanscanned.setValue("");
				txtEanscanned.focus();
			}
			// END OF ON DELETE BUTTON EVENT //
	});
});