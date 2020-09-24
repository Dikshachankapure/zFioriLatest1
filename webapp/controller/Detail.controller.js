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

			return Controller.extend("futuregrp.ZRTV.controller.Detail", {

					// START OF INIT EVENT //
					onInit: function () {
						this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						this._oRouter.getRoute("detail").attachPatternMatched(this._onDetailMatched, this);

						var oModeltableItems = new JSONModel();
						this.getView().byId("tblItems").setModel(oModeltableItems);

						var oModelItemsTemp = new JSONModel();
						this.getView().byId("tblItemsTemp").setModel(oModelItemsTemp);

						var oModelItemsSave = new JSONModel();
						this.getView().byId("tblItemsSave").setModel(oModelItemsSave);
						//this.getView().byId("tblItemsSave").setVisible(true);

						var oModelBoxItem = new sap.ui.model.json.JSONModel();
						oModelBoxItem.loadData("jsondata/box.json");
						this.getView().byId("drpBox").setModel(oModelBoxItem);

						var oModelItemroupg = new sap.ui.model.json.JSONModel();
						oModelItemroupg.loadData("jsondata/productgrp.json");
						this.getView().byId("drpProdGroup").setModel(oModelItemroupg);

						var oModelItemsData = new sap.ui.model.json.JSONModel();
						oModelItemsData.loadData("jsondata/Items.json");
						this.getView().byId("tblItems").setModel(oModelItemsData);

						// this.getView().setModel(oModelBoxItem);

					},

					getRouter: function () {
						return sap.ui.core.UIComponent.getRouterFor(this);
					},

					onChangeProdGroup: function () {
						var oproductgrp = this.getView().byId("drpProdGroup");
						var otable = this.getView().byId("tblItems");
						var value = oproductgrp.getSelectedKey();

						if (value == "1") {
							otable.setVisible(true);
						} else {
							otable.setVisible(false);
						}
						//	var ProductGroup = oEvent.getSource().getBindingContext().getObject();

					},

					// END OF INIT EVENT //

					// START OF DETAIL MATCHED EVENT //
					_onDetailMatched: function (oEvent) {
						var that = this;
						var drpDocTypeRPO = this.getView().byId("drpDocumenttype");
						var drpDocTypeSTO = this.getView().byId("drpDocumenttypeSTO");
						var drpDocTypeRL = this.getView().byId("drpDocumenttypeRL");
						var Vendor = this.getView().byId("vendor");
						var RecSite = this.getView().byId("recsite");
						var txtOrderType = this.getView().byId("txtOrderType");
						var oParameters = oEvent.getParameters();
						if (oParameters.arguments.OrderType !== "" || oParameters.arguments.OrderType !== null) {
							this.OrderType = oParameters.arguments.OrderType;
							txtOrderType.setValue(this.OrderType);
							if (this.OrderType === "RPO") {
								drpDocTypeRPO.setVisible(true);
								drpDocTypeSTO.setVisible(false);
								drpDocTypeRL.setVisible(false);

								Vendor.setVisible(true);
								RecSite.setVisible(false);

							} else if (this.OrderType === "STO") {
								drpDocTypeRPO.setVisible(false);
								drpDocTypeSTO.setVisible(true);
								drpDocTypeRL.setVisible(false);

								Vendor.setVisible(false);
								RecSite.setVisible(true);
							} else if (this.OrderType === "RL") {
								drpDocTypeRPO.setVisible(false);
								drpDocTypeSTO.setVisible(false);
								drpDocTypeRL.setVisible(true);

								Vendor.setVisible(true);
								RecSite.setVisible(true);
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
					// END OF DETAIL MATCHED EVENT //

					// START OF HEADER CHECK EVENT //
					onHeaderCheck: function () {

						var that = this;
						var panel1 = this.getView().byId("panel1");
						var panel2 = this.getView().byId("panel2");
						//var btnScanbarcode = this.getView().byId("btnScanbarcode");
						var btnSave = this.getView().byId("btnSave");
						var btnHold = this.getView().byId("btnHold");
						var btnHeaderCheck = this.getView().byId("btnHeaderCheck");
						var txtSupplySite = this.getView().byId("txtSupplyingsite");
						var drpDocType = this.getView().byId("drpDocumenttype");
						var drpDocumentTypeSTO = this.getView().byId("drpDocumenttypeSTO");
						var txtVendor = this.getView().byId("txtVendor");
						var txtRecevingSite = this.getView().byId("txtRecSite");
						var dpkDelvDate = this.getView().byId("dpkDeliverydate");

						//var drpProdGroup = this.getView().byId("drpProdGroup");
						var drpBox = this.getView().byId("drpBox");

						if (txtSupplySite.getValue().trim().length === 0) {
							MessageBox.error("Select Supplying Site");
							return false;
						} else if (dpkDelvDate.getValue() === "" || dpkDelvDate.getValue() === null) {
							MessageBox.error("Select Delivery Date");
							return false;
						} else if (that.OrderType !== null || that.OrderType !== undefined) {
							panel2.setVisible(true);
							btnSave.setVisible(true);
							btnHold.setVisible(true);
							btnHeaderCheck.setVisible(false);
							/*if (that.OrderType === "RPO" && txtVendor.getValue().trim().length === 0) {
								MessageBox.error("Select Vendor");
								return false;
							} else if (that.OrderType === "STO" && txtRecevingSite.getValue().trim().length === 0) {
								MessageBox.error("Select Receiving Site");
								return false;
							} else {
								var oViewModel, oModelBox;
								var oModel = this.getView().getModel();
								var oView = this.getView();
								oViewModel = new sap.ui.model.json.JSONModel();
								oModelBox = new JSONModel();
								oModelBox = null;
								oView.setModel(oViewModel, "oViewModel");
								var objSupplyingSite = this.getView().byId("txtSupplyingsite").getValue();
								var objVendor = this.getView().byId("txtVendor").getValue();
								var objRecSite = txtRecevingSite.getValue();

								//var objProdGroup = drpProdGroup.getSelectedKey();
								var objDelvDate = dpkDelvDate.getValue();

								var filters = [];
								var SupplyingSite = new sap.ui.model.Filter("Werks", "EQ", objSupplyingSite);
								filters.push(SupplyingSite);

								var StorageLocationFilter = new sap.ui.model.Filter("Sloc", "EQ", "10");
								filters.push(StorageLocationFilter);

								var DeliveryDateFilter = new sap.ui.model.Filter("Aedat", "EQ", objDelvDate);
								filters.push(DeliveryDateFilter);

								var DocumentTypeFilter = "";

								if (that.OrderType !== null || that.OrderType !== undefined) {
									if (that.OrderType === "RPO") {
										var objDocType = drpDocType.getSelectedKey();
										if (objDocType === "0") {
											objDocType = "";
										} else {
											objDocType = objDocType;
										}
										DocumentTypeFilter = new sap.ui.model.Filter("Bsart", "EQ", objDocType);
										filters.push(DocumentTypeFilter);

										var VendorFilter = new sap.ui.model.Filter("Lifnr", "EQ", objVendor);
										filters.push(VendorFilter);
									} else if (that.OrderType === "STO") {
										var objDocTypeSto = drpDocumentTypeSTO.getSelectedKey();
										if (objDocTypeSto === "0") {
											objDocTypeSto = "";
										} else {
											objDocTypeSto = objDocTypeSto;
										}
										DocumentTypeFilter = new sap.ui.model.Filter("Bsart", "EQ", objDocTypeSto);
										filters.push(DocumentTypeFilter);

										var recSiteFilter = new sap.ui.model.Filter("RecSite", "EQ", objRecSite);
										filters.push(recSiteFilter);
									}
								}

								panel1.setBusy(true);
								if (that.OrderType === "RPO") {
									oModel.read("/HeaderCheckSet", {
										filters: filters,
										success: function (oData, oResponse) {
											var values = {
												results: []
											};

											$.each(oData.results, function (key, value) {

												for (var i = 0; i <= values.results.length; i++) {
													if (value.Type === "I") {
													//	btnScanbarcode.setVisible(false);
														btnSave.setVisible(false);
														btnHold.setVisible(false);
														panel2.setVisible(false);
														panel1.setExpanded(true);
														MessageBox.error(oResponse.data.results[i].Message);
														panel1.setBusy(false);
														return false;
													} else if (value.Type === "S" && value.Id === "ZRTV") {
														if (value.Id === "ZRTV" && value.Number === "005") {
															drpDocType.setSelectedKey(value.Message);
														}
														setTimeout(function () {
															panel1.setBusy(false);
															panel2.setVisible(true);
															panel1.setExpanded(false);
														//	btnScanbarcode.setVisible(true);
															btnSave.setVisible(true);
															btnHold.setVisible(true);

															btnHeaderCheck.setVisible(false);
															txtSupplySite.setEnabled(false);
															txtVendor.setEnabled(false);
															drpDocType.setEnabled(false);
															//drpProdGroup.setEnabled(false);
															dpkDelvDate.setEnabled(false);
															drpBox.setModel(oModelBox, "modelPath");
															that.oFuncScanNextBox("0");
														}, 2000);

													}
												}

											});
										},
										error: function (oData, oResponse) {
											MessageBox.error("Header Check Error !");
											panel1.setBusy(false);
										}
									});
								} else if (that.OrderType === "STO") {
									oModel.read("/HeaderCheckStoSet", {
										filters: filters,
										success: function (oData, oResponse) {
											var values = {
												results: []
											};

											$.each(oData.results, function (key, value) {

												for (var i = 0; i <= values.results.length; i++) {
													if (value.Type === "I") {
													//	btnScanbarcode.setVisible(false);
														btnSave.setVisible(false);
														btnHold.setVisible(false);
														panel2.setVisible(false);
														panel1.setExpanded(true);
														MessageBox.error(oResponse.data.results[i].Message);
														panel1.setBusy(false);
														return false;
													} else if (value.Type === "S" && value.Id === "ZRTV") {
														if (value.Id === "ZRTV" && value.Number === "005") {
															drpDocumentTypeSTO.setSelectedKey(value.Message);
														}
														setTimeout(function () {
															panel1.setBusy(false);
															panel2.setVisible(true);
															panel1.setExpanded(false);
														//	btnScanbarcode.setVisible(true);
															btnSave.setVisible(true);
															btnHold.setVisible(true);

															btnHeaderCheck.setVisible(false);
															txtSupplySite.setEnabled(false);
															txtRecevingSite.setEnabled(false);
															drpDocumentTypeSTO.setEnabled(false);

															dpkDelvDate.setEnabled(false);
															drpBox.setModel(oModelBox, "modelPath");
															that.oFuncScanNextBox("0");
														}, 2000);

													}
												}

											});
										},
										error: function (oData, oResponse) {
											MessageBox.error("Header Check Error !");
											panel1.setBusy(false);
										}
									});
								}

							}*/
						}

					},
					// END OF HEADER CHECK EVENT //

					// START OF ON CHANGE BOX EVENT //
					onChangeBox: function () {
						var BoxId = this.getView().byId("drpBox").getSelectedKey();
						var drpProdGroup = this.getView().byId("drpProdGroup");
						var oTableItems = this.getView().byId("tblItems");
						var oTableItemsTemp = this.getView().byId("tblItemsTemp");
						// oTableItemsTemp.setVisible(true);
						oTableItems.setVisible(false);

						var oModelTableTemp = oTableItemsTemp.getModel();

						var oBindingTemp = oTableItemsTemp.getBinding("items");
						if (oBindingTemp) {
							var oFiltersTemp = [new sap.ui.model.Filter("BoxId", sap.ui.model.FilterOperator.Contains, BoxId)];
							var filterObjTemp = new sap.ui.model.Filter(oFiltersTemp, false);
							oBindingTemp.filter(filterObjTemp);
						} else {
							oBindingTemp.filter([]);
						}

						var ProdGrpItems = oTableItemsTemp.getItems();
						if (ProdGrpItems.length > 0) {
							var ProdGrp = "";
							var oBoxId = "";
							for (var i = 0; i < ProdGrpItems.length; i++) {
								oBoxId = oModelTableTemp.getProperty("BoxId", ProdGrpItems[i].getBindingContext());
								ProdGrp = oModelTableTemp.getProperty("Pgrp", ProdGrpItems[i].getBindingContext());
								if (BoxId === oBoxId) {
									drpProdGroup.setSelectedKey(ProdGrp);
									return false;
								}

							}

						}
					},
					// END OF ON CHANGE BOX EVENT //

					// START OF SCAN NEXT BOX EVENT //
					onScanNextBox: function () {
						var that = this;
						var tblItems = this.getView().byId("tblItems");
						var aItems = tblItems.getItems();
						if (aItems.length === 0) {
							MessageBox.error("Please scan articles first");
						} else {
							that.oFuncScanNextBox("1");

						}
					},

					oFuncScanNextBox: function (oValue) {
						var oModel = this.getView().getModel();
						var oModelBox = new sap.ui.model.json.JSONModel();
						var drpBox = this.getView().byId("drpBox");
						var tblItems = this.getView().byId("tblItems");
						var tblItemsTemp = this.getView().byId("tblItemsTemp");
						tblItems.setVisible(true);
						tblItemsTemp.setVisible(false);
						var txtEanscanned = this.getView().byId("txtEanscanned");
						var objProdGroup = this.getView().byId("drpProdGroup");
						var oModel1 = tblItems.getModel();
						if (oValue === "0") {
							oModelBox.setData({
								boxarray: [{
									Eboxid: "B001"
								}]
							});
							this.getView().setModel(oModelBox, "modelPath");
							drpBox.setSelectedKey(oValue);
						} else {
							var oModelItems = drpBox.getItems();
							var item = {};
							oModel.read("/BoxIdSet('" + drpBox.getSelectedKey() + "')", {
								success: function (oData, oResponse) {
									if (drpBox.getSelectedKey() === drpBox.getFirstItem().getText()) {
										if (oModelItems !== null) {
											var values = oModelItems;
											if (values.results === undefined) {
												values = {
													results: []
												};
											}
										} else {
											var values = {
												results: []
											};
										}

										oModelBox.setData({
											boxarray: [{
												Eboxid: oResponse.data.Eboxid
											}]
										});
										values.results.push(oResponse.data.Eboxid);
										//drpBox.setModel(oModelBox, "modelPath");
										var newItem = new sap.ui.core.Item({
											key: oResponse.data.Eboxid,
											text: oResponse.data.Eboxid
										});
										drpBox.insertItem(newItem, 0);
										drpBox.setSelectedKey(oResponse.data.Eboxid);
										txtEanscanned.setValue("");
										objProdGroup.setEnabled(true);
										objProdGroup.setSelectedKey("");
										oModel1.setData(null);
									} else {
										MessageBox.error("Select Last Scanned box from list");
									}

								},
								error: function (oData, oResponse) {
									MessageBox.error("Box Data Error");
								}
							});
						}

					},
					// END OF SCAN NEXT BOX EVENT //

					// START of BARCODE SCAN FUNCTIONALITY // 
					onEANBarcodeScan: function () {
						//var keycode = event.keyCode;
						//if (keycode === jQuery.sap.KeyCodes.ENTER || event.type === "click" || event.which === 1) {
						var oEanscanned = this.getView().byId("txtEanscanned");
						//	var oBtnScan = this.getView().byId("btnScanbarcode");
						var that = this;
						sap.ndc.BarcodeScanner.scan(
							function (mResult) {
								oEanscanned.setValue(mResult.text);
								that.onChangeEanScanned(mResult.text);
								/*sap.ndc.BarcodeScanner.closeScanDialog();
								if (mResult.cancelled === false) {
									oBtnScan.firePress();
								}*/
							},
							function (Error) {
								MessageBox.Show("Scanning failed: " + Error);
							}
						);
						//}
					},

					onChangeEanScanned: function (Eannumber) {
						var oModel = this.getView().getModel();
						var BoxId = this.getView().byId("drpBox").getSelectedKey();

						if (Eannumber !== "") {

							if (Eannumber !== "" || Eannumber !== 0) {
								var filters = [];

								var objSupplyingSite = this.getView().byId("txtSupplyingsite").getValue();
								var objVendor = this.getView().byId("txtVendor").getValue();
								var objRecSite = this.getView().byId("txtRecSite").getValue();
								var objDocType = this.getView().byId("drpDocumenttype").getSelectedKey();
								var objDocTypeSTO = this.getView().byId("drpDocumenttypeSTO").getSelectedKey();
								var objProdGroup = this.getView().byId("drpProdGroup");
								var objDelvDate = this.getView().byId("dpkDeliverydate").getValue();
								var objBoxId = this.getView().byId("drpBox").getSelectedKey();
								var txtEanscanned = this.getView().byId("txtEanscanned");
								var btnSave = this.getView().byId("btnSave");

								if (objProdGroup.getSelectedKey() === "") {
									txtEanscanned.setValue("");
									MessageBox.error("Select Product Group");
									return false;
								}
								var SupplyingSite = new sap.ui.model.Filter("Werks", "EQ", objSupplyingSite);
								var StorageLocationFilter = new sap.ui.model.Filter("Sloc", "EQ", "10");

								var DeliveryDateFilter = new sap.ui.model.Filter("Aedat", "EQ", objDelvDate);
								var BoxID = new sap.ui.model.Filter("BoxId", "EQ", objBoxId);
								var EanScan = new sap.ui.model.Filter("Eanscan", "EQ", Eannumber);
								var Pgrp = new sap.ui.model.Filter("Pgrp", "EQ", objProdGroup.getSelectedKey());
								var ProdGroup = this.getView().byId("drpProdGroup").getSelectedKey();

								var oTableItem = this.getView().byId("tblItems");
								var oTableItemTemp = this.getView().byId("tblItemsTemp");
								var oTableItemSave = this.getView().byId("tblItemsSave");

								var oModelTable = oTableItem.getModel();
								var oModelTableTemp = oTableItemTemp.getModel();
								var oModelTableSave = oTableItemSave.getModel();
								// Get Items of the Table
								var aItems = oTableItem.getItems();
								var aItemsTemp = oTableItemTemp.getItems();

								oTableItem.setBusy(true);
								var oModelItems = new JSONModel();
								var oModelItemsTemp = new JSONModel();
								var oModelItemsSave = new JSONModel();
								var oModelItemsCopy = new JSONModel();
								var item = {};
								var that = this;
								var objSet = "";
								var DocumentTypeFilter = "";
								var txtEanscanned = this.getView().byId("txtEanscanned");

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
								oModel.read("" + objSet + "", {
									filters: filters,
									success: function (oData, oResponse) {
										if (oResponse.data.results.length === 0) {
											MessageBox.error("Please Enter Correct EAN Number");
											txtEanscanned.setValue("");
											txtEanscanned.focus();
											oTableItem.setBusy(false);
										} else if (oData.results[0].Matnr === "" && oResponse.data.results[0].Message === "ERROR") {
											var arrOutput = [];
											for (var i = 0; i < oData.results.length; i++) {
												arrOutput[i] = " - " + oData.results[i].Message + "\n";
											}
											arrOutput.splice(0, 1);
											var message = arrOutput.toString();
											MessageBox.error(message.replace(/\,/g, ""));
											oTableItem.setBusy(false);
											txtEanscanned.setValue("");
											txtEanscanned.focus();
										} else if (oData.results[0].Matnr === "" && oResponse.data.results[0].Message === "") {
											MessageBox.error("EAN Number is not Valid");
											oTableItem.setBusy(false);
											txtEanscanned.setValue("");
											txtEanscanned.focus();

										} else if (oData.results[0].Matnr !== "") {

											if (oResponse.data.results[0].Message !== "") {
												arrOutput = [];
												for (i = 0; i < oData.results.length; i++) {
													arrOutput[i] = " - " + oData.results[i].Message + "\n";
												}
												message = arrOutput.toString();
												MessageBox.information(message.replace(/\,/g, ""));
												btnSave.setVisible(false);
												txtEanscanned.setValue("");
												txtEanscanned.focus();
											}

											if (oModelTable.getData() !== null) {
												var values = oModelTable.getData();

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
											if (oModelTableTemp.getData() !== null) {
												var valuesTemp = oModelTableTemp.getData();
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

											var oEanNumber, oQty, oMrp, oBoxId, oEanNumberTemp, oQtyTemp, oMrpTemp, oBoxIdTemp = "";

											var flag = 0;
											var flagtemp = 0;
											if (aItems.length > 0) {

												for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {

													oQty = oModelTable.getProperty("Menge", aItems[iRowIndex].getBindingContext());
													oMrp = oModelTable.getProperty("Mrp", aItems[iRowIndex].getBindingContext());
													oEanNumber = oModelTable.getProperty("EanScan1", aItems[iRowIndex].getBindingContext());
													oBoxId = oModelTable.getProperty("BoxId", aItems[iRowIndex].getBindingContext());
													if (Eannumber === oEanNumber || BoxID.oValue1 !== oBoxId) {
														if (BoxID.oValue1 === oBoxId) {
															item["EanScan1"] = Eannumber;
															item["BoxId"] = BoxId;
															item["Pgrp"] = ProdGroup;

															var total = 1;
															var Qty = parseInt(oQty);
															total = Qty + total;
															var Mrp = parseFloat(oMrp) + parseFloat(oData.results[0].Mrp);
															values.results[iRowIndex].Menge = total + ".000";
															values.results[iRowIndex].Mrp = Mrp + ".000";
															valuesTempSave.results.push(item);
															oModelItems.setData(values);
															oTableItem.setModel(oModelItems);
															oModelItemsCopy.setData(values);
															sap.ui.getCore().setModel(oModelItemsCopy, "oModelItemsCopy");
															oModelItemsTemp.setData(valuesTemp);
															oTableItemTemp.setModel(oModelItemsTemp);

															oModelItemsSave.setData(valuesTempSave);
															oTableItemSave.setModel(oModelItemsSave);
															oTableItemTemp.setVisible(false);
															oTableItem.setVisible(true);
															oTableItem.setBusy(false);
															objProdGroup.setEnabled(false);
															flag = 0;
															var oBinding = oTableItemTemp.getBinding("items");
															if (oBinding) {
																var oFilters = [new sap.ui.model.Filter("BoxId", sap.ui.model.FilterOperator.Contains, BoxID)];
																var filterObj = new sap.ui.model.Filter(oFilters, false);
																oBinding.filter(filterObj);
															} else {
																oBinding.filter([]);
															}
															return false;

														} else {

															for (var iBox = 0; iBox < aItemsTemp.length; iBox++) {
																oQtyTemp = oModelTableTemp.getProperty("Menge", aItemsTemp[iBox].getBindingContext());
																oMrpTemp = oModelTableTemp.getProperty("Mrp", aItemsTemp[iBox].getBindingContext());
																oEanNumberTemp = oModelTableTemp.getProperty("EanScan1", aItemsTemp[iBox].getBindingContext());
																oBoxIdTemp = oModelTableTemp.getProperty("BoxId", aItemsTemp[iBox].getBindingContext());
																if (Eannumber === oEanNumberTemp && BoxID.oValue1 === oBoxIdTemp) {
																	for (var j = 0; j < valuesTemp.results.length; j++) {
																		if (Eannumber === valuesTemp.results[j].EanScan1 && BoxID.oValue1 === valuesTemp.results[j].BoxId) {
																			item["EanScan1"] = Eannumber;
																			item["BoxId"] = BoxId;
																			item["Pgrp"] = ProdGroup;

																			var totalTemp = 1;
																			var QtyTemp = parseInt(oQtyTemp);
																			totalTemp = QtyTemp + totalTemp;
																			var MrpTemp = parseFloat(oMrpTemp) + parseFloat(oData.results[0].Mrp);

																			valuesTemp.results[j].Menge = totalTemp + ".000";
																			valuesTemp.results[j].Mrp = MrpTemp + ".000";
																			valuesTempSave.results.push(item);

																			oModelItemsTemp.setData(valuesTemp);
																			oTableItemTemp.setModel(oModelItemsTemp);

																			oModelItemsSave.setData(valuesTempSave);
																			oTableItemSave.setModel(oModelItemsSave);

																			oTableItemTemp.setVisible(true);
																			oTableItem.setVisible(false);
																			oTableItem.setBusy(false);
																			objProdGroup.setEnabled(false);
																			flagtemp = 0;
																			oBinding = oTableItemTemp.getBinding("items");
																			if (oBinding) {
																				oFilters = [new sap.ui.model.Filter("BoxId", sap.ui.model.FilterOperator.Contains, BoxID.oValue1)];
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
															flagtemp = 1;
															if (flagtemp === 1) {
																item["Matnr"] = oData.results[0].Matnr;
																item["EanScan1"] = Eannumber;
																item["Maktx"] = oData.results[0].Maktx;
																item["Menge"] = oData.results[0].Menge;
																item["Mrp"] = oData.results[0].Mrp;
																item["Agreement"] = oData.results[0].Agreement;
																item["BoxId"] = BoxId;
																item["Pgrp"] = ProdGroup;

																valuesTemp.results.push(item);
																valuesTempSave.results.push(item);
																oModelItemsTemp.setData(valuesTemp);
																oTableItemTemp.setModel(oModelItemsTemp);
																oModelItemsSave.setData(valuesTempSave);
																oTableItemSave.setModel(oModelItemsSave);
																oTableItemTemp.setVisible(true);
																oTableItem.setVisible(false);
																oTableItem.setBusy(false);
																objProdGroup.setEnabled(false);
																oBinding = oTableItemTemp.getBinding("items");
																if (oBinding) {
																	oFilters = [new sap.ui.model.Filter("BoxId", sap.ui.model.FilterOperator.Contains, BoxID.oValue1)];
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
												flag = 1;
												if (flag === 1) {
													item["Matnr"] = oData.results[0].Matnr;
													item["EanScan1"] = Eannumber;
													item["Maktx"] = oData.results[0].Maktx;
													item["Menge"] = oData.results[0].Menge;
													item["Mrp"] = oData.results[0].Mrp;
													item["Agreement"] = oData.results[0].Agreement;
													item["BoxId"] = BoxId;
													item["Pgrp"] = ProdGroup;

													values.results.push(item);
													valuesTemp.results.push(item);
													valuesTempSave.results.push(item);

													oModelItems.setData(values);
													oTableItem.setModel(oModelItems);

													oModelItemsCopy.setData(values);
													sap.ui.getCore().setModel(oModelItemsCopy, "oModelItemsCopy");

													oModelItemsTemp.setData(valuesTemp);
													oTableItemTemp.setModel(oModelItemsTemp);

													oModelItemsSave.setData(valuesTempSave);
													oTableItemSave.setModel(oModelItemsSave);

													oTableItemTemp.setVisible(false);
													oTableItem.setVisible(true);

													oTableItem.setBusy(false);
													objProdGroup.setEnabled(false);

													return false;
												}
											} else {
												item["Matnr"] = oData.results[0].Matnr;
												item["EanScan1"] = Eannumber;
												item["Maktx"] = oData.results[0].Maktx;
												item["Menge"] = oData.results[0].Menge;
												item["Mrp"] = oData.results[0].Mrp;
												item["Agreement"] = oData.results[0].Agreement;
												item["BoxId"] = BoxId;
												item["Pgrp"] = ProdGroup;

												values.results.push(item);
												valuesTemp.results.push(item);
												valuesTempSave.results.push(item);
												oModelItems.setData(values);
												oTableItem.setModel(oModelItems);
												oModelItemsCopy.setData(values);
												sap.ui.getCore().setModel(oModelItemsCopy, "oModelItemsCopy");
												oModelItemsTemp.setData(valuesTemp);
												oTableItemTemp.setModel(oModelItemsTemp);
												oModelItemsSave.setData(valuesTempSave);
												oTableItemSave.setModel(oModelItemsSave);
												oTableItemTemp.setVisible(false);
												oTableItem.setVisible(true);
												oTableItem.setBusy(false);
												objProdGroup.setEnabled(false);
												return false;
											}

										} else {

											var arrOutput = [];
											for (var i = 0; i < oData.results.length; i++) {
												arrOutput[i] = "  " + oData.results[i].Message + "\n";
											}
											var message = arrOutput.toString();
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
					// END of BARCODE SCAN FUNCTIONALITY // 

					// START OF NAVAIGATION FUNCTIONALITY //
					/*	getRouter: function () {
							return sap.ui.core.UIComponent.getRouterFor(this);
						},*/

					onNavBack: function (oEvent) {
						var oHistory, sPreviousHash;
						var that = this;
						oHistory = History.getInstance();
						sPreviousHash = oHistory.getPreviousHash();

						if (sPreviousHash !== undefined) {
							window.history.go(-1);
							that.clearAllControls();
						} else {
							this.getRouter().navTo("Main", {}, true /*no history*/ );
							that.clearAllControls();
						}
					},
					// END OF NAVAIGATION FUNCTIONALITY //

					handleValueHelpSupplyingSite: function (oEvent) {

						var oModelsupplyingsite = this.getOwnerComponent().getModel("SupplyingsiteData");
						this.getView().setModel(oModelsupplyingsite);

						var sInputValueSupplyingsite = oEvent.getSource().getValue();

						this.inputSupplyingId = oEvent.getSource().getId();
						// create value help dialog
						if (!this._valueHelpDialogSupplyingsite) {
							this._valueHelpDialogSupplyingsite = sap.ui.xmlfragment(
								"futuregrp.ZRTV.fragments.SupplyingSite", //id.fragments.file.name ---take id from manifest.json
								this
							);
							this.getView().addDependent(this._valueHelpDialogSupplyingsite);
						}

						// create a filter for the binding

						this._valueHelpDialogSupplyingsite.getBinding("items").filter([new sap.ui.model.Filter(
							"Supplyingsite",
							sap.ui.model.FilterOperator.Contains, sInputValueSupplyingsite
						)]);

						// open value help dialog filtered by the input value
						this._valueHelpDialogSupplyingsite.open(sInputValueSupplyingsite);
					},
					_handleValueHelpSearchSupplyingSite: function (evt) {
						var sValueSupplyingsite = evt.getParameter("value");
						var oFilter = new sap.ui.model.Filter(
							"Supplyingsite",
							sap.ui.model.FilterOperator.Contains, sValueSupplyingsite
						);
						evt.getSource().getBinding("items").filter([oFilter]);
					},

					_handleValueHelpCloseSupplyingSite: function (evt) {
						var oSelectedItem = evt.getParameter("selectedItem");

						if (oSelectedItem) {
							var SupplyingsiteInput = this.getView().byId(this.inputSupplyingId);
							SupplyingsiteInput.setValue(oSelectedItem.getTitle());
						}
						evt.getSource().getBinding("items").filter([]);
					},

					// START OF SUPPLYING SITE SEARCH HELP FUNCTIONALITY //
					/*	 handleValueHelpSupplyingSite: function (oEvent) {
							this.getView().setModel();
							var sInputValueSupplyingSite = oEvent.getSource().getValue();

						 	this.inputSupplyingSiteId = oEvent.getSource().getId();
						 	// create value help dialog
							if (!this._valueHelpDialogSupplyingSite) {
						 		this._valueHelpDialogSupplyingSite = sap.ui.xmlfragment(
									"futuregrp.ZRTV.fragments.SupplyingSite",
									this
								);
						 		this.getView().addDependent(this._valueHelpDialogSupplyingSite);
					 	}

							// create a filter for the binding
						 	this._valueHelpDialogSupplyingSite.getBinding("items").filter([new Filter(
						 		"Supplyingsite",
						 		sap.ui.model.FilterOperator.Contains, sInputValueSupplyingSite
						 	)]);

						 	// open value help dialog filtered by the input value
						 	this._valueHelpDialogSupplyingSite.open(sInputValueSupplyingSite);
						 },

						 _handleValueHelpSearchSupplyingSite: function (evt) {
						 	var sValueProject = evt.getParameter("value");
						 	var oFilter = new Filter(
					 		"Supplyingsite",
								sap.ui.model.FilterOperator.Contains, sValueProject
						 	);
						 	evt.getSource().getBinding("items").filter([oFilter]);
						 },

						 _handleValueHelpCloseSupplyingSite: function (evt) {
						 	var oSelectedItem = evt.getParameter("selectedItem");
					 	if (oSelectedItem) {
						 		var SupplyingSiteInput = this.getView().byId(this.inputSupplyingSiteId);
						 		SupplyingSiteInput.setValue(oSelectedItem.getDescription());
						 	}
						 	evt.getSource().getBinding("items").filter([]);
						 },
						 
						 */
					//	 END OF SUPPLYING SITE SEARCH HELP FUNCTIONALITY //

					handleValueHelpVendor: function (oEvent) {

						var oModelVendor = this.getOwnerComponent().getModel("Vendordata");
						this.getView().setModel(oModelVendor);

						var sInputValueVendor = oEvent.getSource().getValue();

						this.inputVendorId = oEvent.getSource().getId();
						// create value help dialog
						if (!this._valueHelpDialogVendor) {
							this._valueHelpDialogVendor = sap.ui.xmlfragment(
								"futuregrp.ZRTV.fragments.Vendor", //id.fragments.file.name ---take id from manifest.json
								this
							);
							this.getView().addDependent(this._valueHelpDialogVendor);
						}

						// create a filter for the binding

						this._valueHelpDialogVendor.getBinding("items").filter([new sap.ui.model.Filter(
							"vendor",
							sap.ui.model.FilterOperator.Contains, sInputValueVendor
						)]);

						// open value help dialog filtered by the input value
						this._valueHelpDialogVendor.open(sInputValueVendor);
					},
					_handleValueHelpSearchVendor: function (evt) {
						var sValueVendor = evt.getParameter("value");
						var oFilter = new sap.ui.model.Filter(
							"vendor",
							sap.ui.model.FilterOperator.Contains, sValueVendor
						);
						evt.getSource().getBinding("items").filter([oFilter]);
					},

					_handleValueHelpCloseVendor: function (evt) {
						var oSelectedItem = evt.getParameter("selectedItem");

						if (oSelectedItem) {
							var VendorInput = this.getView().byId(this.inputVendorId);
							VendorInput.setValue(oSelectedItem.getTitle());
						}
						evt.getSource().getBinding("items").filter([]);
					},

					// START OF VENDOR SEARCH HELP FUNCTIONALITY //

					/*	handleValueHelpVendor: function (oEvent) {
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
				"vendor",
				sap.ui.model.FilterOperator.Contains, sInputValueVendor
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogVendor.open(sInputValueVendor);
		},

		_handleValueHelpSearchVendor: function (evt) {
			var sValueVendor = evt.getParameter("value");
			var oFilter = new Filter(
				"vendor",
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
		
		
		// END OF VENDOR SEARCH HELP FUNCTIONALITY //

		// START OF VENDOR SEARCH HELP FUNCTIONALITY //
		handleValueHelpReceivingSite: function (oEvent) {
			this.getView().setModel();
			var sInputValueReceivingSite = oEvent.getSource().getValue();

			this.inputReceivingSiteId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogReceivingSite) {
				this._valueHelpDialogReceivingSite = sap.ui.xmlfragment(
					"futuregrp.ZRTV.fragments.ReceivingSite",
					this
				);
				this.getView().addDependent(this._valueHelpDialogReceivingSite);
			}

			// create a filter for the binding
			this._valueHelpDialogReceivingSite.getBinding("items").filter([new Filter(
				"Werks",
				sap.ui.model.FilterOperator.Contains, sInputValueReceivingSite
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogReceivingSite.open(sInputValueReceivingSite);
		},

		_handleValueHelpSearchReceivingSite: function (evt) {
			var sValueReceivingSite = evt.getParameter("value");
			var oFilter = new Filter(
				"Werks",
				sap.ui.model.FilterOperator.Contains, sValueReceivingSite
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpCloseReceivingSite: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var ReceivingSiteInput = this.getView().byId(this.inputReceivingSiteId);
				ReceivingSiteInput.setValue(oSelectedItem.getDescription());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		
		
		// END OF VENDOR SEARCH HELP FUNCTIONALITY //
        */

					//Start of search help Value for IndentNo//

					// START of CLEAR DATA //  
					clearAllControls: function () {
						var txtSupplyingsite = this.getView().byId("txtSupplyingsite");
						var txtVendor = this.getView().byId("txtVendor");
						var txtRecSite = this.getView().byId("txtRecSite");
						var drpDocumenttype = this.getView().byId("drpDocumenttype");
						var drpDocumenttypeSto = this.getView().byId("drpDocumenttypeSTO");
						var drpProdGroup = this.getView().byId("drpProdGroup");
						var dpkDeliverydate = this.getView().byId("dpkDeliverydate");
						var txtEanscanned = this.getView().byId("txtEanscanned");
						var drpBox = this.getView().byId("drpBox");
						var txtOrderType = this.getView().byId("txtOrderType");

						var panel1 = this.getView().byId("panel1");
						var panel2 = this.getView().byId("panel2");
						var btnHold = this.getView().byId("btnHold");
						var btnSave = this.getView().byId("btnSave");
						//	var btnScanbarcode = this.getView().byId("btnScanbarcode");
						var btnHeaderCheck = this.getView().byId("btnHeaderCheck");

						var tblItems = this.getView().byId("tblItems");
						var tblItemstemp = this.getView().byId("tblItemsTemp");
						var tblItemsSave = this.getView().byId("tblItemsSave");

						var oModelItems = tblItems.getModel();
						var oModelTemp = tblItemstemp.getModel();
						var oModelItemsSave = tblItemsSave.getModel();

						txtOrderType.setValue(null);
						txtSupplyingsite.setValue(null);
						txtVendor.setValue(null);
						txtRecSite.setValue(null);
						drpDocumenttype.setSelectedKey(0);
						drpDocumenttypeSto.setSelectedKey(0);
						drpProdGroup.setSelectedKey("");
						dpkDeliverydate.setValue(null);
						txtEanscanned.setValue(null);
						drpBox.setSelectedKey(0);

						panel1.setExpanded(true);
						panel2.setVisible(false);
						btnHold.setVisible(false);
						btnSave.setVisible(false);
						//	btnScanbarcode.setVisible(false);

						btnHeaderCheck.setVisible(true);
						txtSupplyingsite.setEnabled(true);
						txtVendor.setEnabled(true);
						txtRecSite.setEnabled(true);
						drpDocumenttype.setEnabled(true);
						drpDocumenttypeSto.setEnabled(true);
						drpProdGroup.setEnabled(true);
						dpkDeliverydate.setEnabled(true);

						oModelItems.setData(null);
						oModelTemp.setData(null);
						oModelItemsSave.setData(null);
						tblItems.setBusy(false);
					},
					// END of CLEAR DATA // 

					// START OF ON HOLD BUTTON EVENT // 
					_onSave: function () {
						var ProductGroup = this.getView().byId("drpProdGroup");

						if (ProductGroup.getValue() === "") {
							MessageToast.show("Plz Select Product Group");
						} else {
							// Get the Model in the view 

							var msg = "Data SaveSuccessfully";
							MessageToast.show(msg);

							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("main");
						}
					},

					_onHold: function () {
						var ProductGroup = this.getView().byId("drpProdGroup");

						if (ProductGroup.getValue() === "") {
							MessageToast.show("Plz Select Product Group");
						} else {
							var msg = "Data Hold Successfully";
							MessageToast.show(msg);

							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("main");
							}
						},

						Gotopage1: function () {

								this.getRouter().navTo("main", {}, true);

								var that = this;
								that._onHold();
							},

							onHold: function () {
								var txtOrderType = this.getView().byId("txtOrderType").getValue();
								var oModel = this.getView().getModel();
								var panel2 = this.getView().byId("panel2");
								var txtSupplySite = this.getView().byId("txtSupplyingsite").getValue();

								var drpDocType = this.getView().byId("drpDocumenttype").getSelectedKey();
								var drpDocTypeSto = this.getView().byId("drpDocumenttypeSTO").getSelectedKey();
								var txtVendor = this.getView().byId("txtVendor").getValue();
								var txtRecSite = this.getView().byId("txtRecSite").getValue();
								var dpkDelvDate = this.getView().byId("dpkDeliverydate").getValue();
								var drpBox = this.getView().byId("drpBox");

								//Create all the records added to table via Json model
								var oTableItemsSave = this.getView().byId("tblItemsSave");
								var oModelItemsSave = oTableItemsSave.getModel();

								var aItems = oTableItemsSave.getItems();
								if (txtSupplySite === 0 || txtSupplySite === "") {
									MessageBox.error("Select Supplying Site");
									return false;
								} else if (txtOrderType === "RPO" && txtVendor.trim().length === 0) {
									MessageBox.error("Select Vendor");
									return false;
								} else if (txtOrderType === "STO" && txtRecSite.trim().length === 0) {
									MessageBox.error("Select Receiving Site");
									return false;
								} else if (aItems.length === 0) {
									MessageBox.error("No Items in the list");
									return false;
								} else {
									var oItems = {};
									oItems.Werks = txtSupplySite;
									oItems.Sloc = "10";
									oItems.Aedat = dpkDelvDate + "T00:00:00";

									var itemData = [];
									var itemReturn = [];
									var that = this;
									for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
										var Eanscan = oModelItemsSave.getProperty("EanScan1", aItems[iRowIndex].getBindingContext());
										var BoxId = oModelItemsSave.getProperty("BoxId", aItems[iRowIndex].getBindingContext());
										var Pgrp = oModelItemsSave.getProperty("Pgrp", aItems[iRowIndex].getBindingContext());
										itemData.push({
											Eanscan: Eanscan,
											Box: BoxId,
											Zprgp: Pgrp
										});
										itemReturn.push({});
									}
									var objSet = "";
									if (txtOrderType === "RPO") {
										oItems.Lifnr = txtVendor;
										if (drpDocType === "0") {
											oItems.Bsart = "";
										} else {
											oItems.Bsart = drpDocType;
										}
										oItems.Bsart = drpDocType;
										objSet = "/HoldHeaderSet";
										oItems.HoldItemSet = itemData;
										oItems.HoldReturnSet = itemReturn;
									} else if (txtOrderType === "STO") {
										oItems.RecSite = txtRecSite;
										if (drpDocTypeSto === "0") {
											oItems.Bsart = "";
										} else {
											oItems.Bsart = drpDocTypeSto;
										}
										oItems.Bsart = drpDocTypeSto;
										objSet = "/HoldHeaderStoSet";
										oItems.HoldItemStoSet = itemData;
										oItems.HoldReturnStoSet = itemReturn;
									}

									panel2.setBusy(true);
									oModel.setHeaders({
										"X-Requested-With": "X"
									});
									oModel.create("" + objSet + "", oItems, {
										success: function (oData, oResponse) {
											if (txtOrderType === "RPO") {
												for (var i = 0; i < oResponse.data.HoldReturnSet.results.length; i++) {
													if (oResponse.data.HoldReturnSet.results === null) {
														MessageBox.error("No Data available!");
														return false;
													}
													if (oResponse.data.HoldReturnSet.results[i].Type === "I" && oResponse.data.HoldReturnSet.results[i].Id === "ZRTV_MSG") {
														MessageBox.error(oResponse.data.HoldReturnSet.results[i].Message, {
															icon: sap.m.MessageBox.Icon.ERROR,
															title: "Error",
															onClose: function (oAction) {
																drpBox.setModel(null);
																panel2.setBusy(false);
																that.onNavBack();
															}
														});
														return false;
													} else if (oResponse.data.HoldReturnSet.results[i].Type === "S") {
														MessageBox.success(oResponse.data.HoldReturnSet.results[i].Message, {
															icon: sap.m.MessageBox.Icon.SUCCESS,
															title: "Success",
															onClose: function (oAction) {

																drpBox.setModel(null);
																panel2.setBusy(false);
																that.onNavBack();
															}
														});
														return false;
													}
												}
											} else if (txtOrderType === "STO") {
												if (oResponse.data.HoldReturnStoSet !== null) {
													for (i = 0; i < oResponse.data.HoldReturnStoSet.results.length; i++) {
														if (oResponse.data.HoldReturnStoSet.results === null) {
															MessageBox.error("No Data available!");
															return false;
														}
														if (oResponse.data.HoldReturnStoSet.results[i].Type === "I" && oResponse.data.HoldReturnStoSet.results[i].Id ===
															"ZRTV_MSG") {
															MessageBox.error(oResponse.data.HoldReturnStoSet.results[i].Message, {
																icon: sap.m.MessageBox.Icon.ERROR,
																title: "Error",
																onClose: function (oAction) {
																	drpBox.setModel(null);
																	panel2.setBusy(false);
																	that.onNavBack();
																}
															});
															return false;
														} else if (oResponse.data.HoldReturnStoSet.results[i].Type === "S") {
															MessageBox.success(oResponse.data.HoldReturnStoSet.results[i].Message, {
																icon: sap.m.MessageBox.Icon.SUCCESS,
																title: "Success",
																onClose: function (oAction) {

																	drpBox.setModel(null);
																	panel2.setBusy(false);
																	that.onNavBack();
																}
															});
															return false;
														}
													}
												} else {
													MessageBox.show("No Data Found");
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

							// START OF ON SAVE BUTTON EVENT // 
							onSave: function () {
								var oModel = this.getView().getModel();
								var panel2 = this.getView().byId("panel2");

								var txtOrderType = this.getView().byId("txtOrderType").getValue();
								var txtSupplySite = this.getView().byId("txtSupplyingsite").getValue();
								var drpDocType = this.getView().byId("drpDocumenttype").getSelectedKey();
								var drpDocTypeSto = this.getView().byId("drpDocumenttypeSTO").getSelectedKey();
								var txtVendor = this.getView().byId("txtVendor").getValue();
								var txtRecSite = this.getView().byId("txtRecSite").getValue();
								var dpkDelvDate = this.getView().byId("dpkDeliverydate").getValue();
								var drpBox = this.getView().byId("drpBox");

								//Create all the records added to table via Json model

								var oTableItemsSave = this.getView().byId("tblItemsSave");
								var oModelItemsSave = oTableItemsSave.getModel();
								// Get Items of the Table
								var aItems = oTableItemsSave.getItems();

								if (txtSupplySite === 0 || txtSupplySite === "") {
									MessageBox.error("Select Supplying Site");
									return false;
								} else if (txtOrderType === "RPO" && txtVendor.trim().length === 0) {
									MessageBox.error("Select Vendor");
									return false;
								} else if (txtOrderType === "STO" && txtRecSite.trim().length === 0) {
									MessageBox.error("Select Receiving Site");
									return false;
								} else if (aItems.length === 0) {
									MessageBox.error("No Items in the list");
									return false;
								} else {
									var oItems = {};
									oItems.Werks = txtSupplySite;
									oItems.Sloc = "10";
									oItems.Aedat = dpkDelvDate + "T00:00:00";

									var itemData = [];
									var itemReturn = [];
									var that = this;
									for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
										var Eanscan = oModelItemsSave.getProperty("EanScan1", aItems[iRowIndex].getBindingContext());
										var BoxId = oModelItemsSave.getProperty("BoxId", aItems[iRowIndex].getBindingContext());
										var Pgrp = oModelItemsSave.getProperty("Pgrp", aItems[iRowIndex].getBindingContext());
										itemData.push({
											Eanscan: Eanscan,
											Box: BoxId,
											Zprgp: Pgrp
										});

										itemReturn.push({});
									}

									var objSet = "";
									if (txtOrderType === "RPO") {
										oItems.Lifnr = txtVendor;
										if (drpDocType === "0") {
											oItems.Bsart = "";
										} else {
											oItems.Bsart = drpDocType;
										}
										oItems.Bsart = drpDocType;
										objSet = "/SaveHeaderSet";
										oItems.SaveItemSet = itemData;
										oItems.SaveReturnSet = itemReturn;
									} else if (txtOrderType === "STO") {
										oItems.RecSite = txtRecSite;
										if (drpDocTypeSto === "0") {
											oItems.Bsart = "";
										} else {
											oItems.Bsart = drpDocTypeSto;
										}
										oItems.Bsart = drpDocTypeSto;
										objSet = "/SaveHeaderStoSet";
										oItems.SaveItemStoSet = itemData;
										oItems.SaveReturnStoSet = itemReturn;
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
												if (oResponse.data.SaveReturnSet === null) {
													MessageBox.information("No Data available");
													panel2.setBusy(false);
													return false;
												} else {
													for (var i = 0; i < oResponse.data.SaveReturnSet.results.length; i++) {
														if (oResponse.data.SaveReturnSet.results[i].Type === "I" && oResponse.data.SaveReturnSet.results[i].Id ===
															"ZRTV_ER") {
															arrOutput = [];
															for (i = 0; i < oResponse.data.SaveReturnSet.results.length; i++) {
																arrOutput[i] = " - " + oResponse.data.SaveReturnSet.results[i].Message + "\n";
															}
															message = arrOutput.toString();
															MessageBox.error(message.replace(/\,/g, ""));
															panel2.setBusy(false);
															return false;
														} else if (oResponse.data.SaveReturnSet.results[i].Type === "S") {
															MessageBox.success(oResponse.data.SaveReturnSet.results[i].Message, {
																icon: sap.m.MessageBox.Icon.SUCCESS,
																title: "Success",
																onClose: function (oAction) {
																	drpBox.setModel(null);
																	panel2.setBusy(false);
																	that.onNavBack();
																}
															});
															return false;
														}
													}
												}

											} else if (txtOrderType === "STO") {
												if (oResponse.data.SaveReturnStoSet === null) {
													MessageBox.information("No Data available");
													panel2.setBusy(false);
													return false;
												} else {
													for (i = 0; i < oResponse.data.SaveReturnStoSet.results.length; i++) {
														if (oResponse.data.SaveReturnStoSet.results[i].Type === "I" && oResponse.data.SaveReturnStoSet.results[i].Id ===
															"ZRTV_ER") {
															arrOutput = [];
															for (i = 0; i < oResponse.data.SaveReturnStoSet.results.length; i++) {
																arrOutput[i] = " - " + oResponse.data.SaveReturnStoSet.results[i].Message + "\n";
															}
															message = arrOutput.toString();
															MessageBox.error(message.replace(/\,/g, ""));
															panel2.setBusy(false);
															return false;
														} else if (oResponse.data.SaveReturnStoSet.results[i].Type === "S") {
															MessageBox.success(oResponse.data.SaveReturnStoSet.results[i].Message, {
																icon: sap.m.MessageBox.Icon.SUCCESS,
																title: "Success",
																onClose: function (oAction) {
																	drpBox.setModel(null);
																	panel2.setBusy(false);
																	that.onNavBack();
																}
															});
															return false;
														}
													}
												}
											} else {
												MessageBox.show("No Data Found");
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

								var oList = this.byId("tblItems");

								var aItems = oList.getItems();
								var oModelItems = oList.getModel();
								var values = oModelItems.getData();

								var oDelete = oEvent.getSource().getBindingContext().getObject();
								if (aItems.length > 0) {
									for (var i = 0; i < values.Items.length; i++) {
										if (values.Items[i].Artical === oDelete.Artical) {
											//	pop this._data.Products[i] 
											values.Items.splice(i, 1);
											oModelItems.refresh();
											break;
										}
									}

									oModelItems.setData(values);
									oList.setModel(oModelItems);
								}

								//	var custID = oEvent.getSource().getContent()[0].getItems()[0].getText();

								//var custID = 'ALFKI';
								//	this.getView().byId("SimpleFormChange354").bindElement("EmployeeSet(" + custID + ")");
							},

							/*	onDelete: function (oEvent) {

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
											if (values.results[i].EanScan1 === deleteRecord.EanScan1 && values.results[i].BoxId === deleteRecord.BoxId) {
												//	pop this._data.Products[i] 
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
											if (valuesTemp.results[j].EanScan1 === deleteRecord.EanScan1 && valuesTemp.results[j].BoxId === deleteRecord.BoxId) {
												valuesTemp.results.splice(j, 1);
												oModelItemsTemp.refresh();
												break;
											}
										}
										oModelItemsTemp.setData(valuesTemp);
										tblItemsTemp.setModel(oModelItemsTemp);
									}
									if (aItemsSave.length > 0) {
										for (var temp = 0; temp < aItems.length; temp++) {
											for (var k = 0; k < valuesTempSave.results.length; k++) {
												if (valuesTempSave.results[k].EanScan1 === deleteRecord.EanScan1 && valuesTempSave.results[k].BoxId === deleteRecord.BoxId) {
													valuesTempSave.results.splice(k, 1);
													oModelItemsSave.refresh();
												}
											}
										}

										oModelItemsSave.setData(valuesTempSave);
										tblItemsSave.setModel(oModelItemsSave);
									}
								},      */

							/*	onChangeProdGroup: function (oEvent) {
									var txtEanscanned = this.getView().byId("txtEanscanned");
									txtEanscanned.focus();
								},*/

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