sap.ui.define([
"sap/ui/core/mvc/Controller",
"sap/ui/core/Fragment",
"sap/ui/model/Filter",
"sap/ui/model/FilterOperator",
"sap/ui/model/json/JSONModel",
	"sap/m/TablePersoController",
"sap/m/MessageBox",
'sap/ui/model/Sorter'
], function (Controller, Fragment, Filter, FilterOperator, JSONModel,TablePersoController, MessageBox, Sorter) {
"use strict";

return Controller.extend("futuregrp.ZRTV.controller.Main", {

			onInit: function () {
				var oModel = this.getOwnerComponent().getModel("ChangeDataSet");
				this.getView().setModel(oModel);

			},
			getRouter: function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			//START OF ON AFTER RENDERING EVENT // 
			onAfterRendering: function () {
				var criteria = this.getView().byId("drpCriteria");
				var ordertype = this.getView().byId("drpOrder");
				ordertype.setSelectedKey("RPO");
				criteria.setSelectedKey("1");

				this.onChangeCriteria();

			},
			//END OF ON AFTER RENDERING EVENT // 

			//START OF ON CHANGE SELECTION CRITERIA EVENT//
			onChangeCriteria: function () {
				var criteria = this.getView().byId("drpCriteria");
				var txtIndentNumber = this.getView().byId("txtIndentnumber");
				if (criteria.getSelectedKey() === "1") {
					txtIndentNumber.setVisible(false);
					txtIndentNumber.setValue("");
				} else if (criteria.getSelectedKey() === "2") {
					txtIndentNumber.setVisible(true);
				}
			},
			//END OF ON CHANGE SELECTION CRITERIA EVENT//

			//START of EXECUTE BUTTON EVENT //  

		/*	onExecute: function (oEvent) {
				
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var Change = oEvent.getSource().getBindingContext().getObject();
				this.getRouter().navTo("change", {
					IndentNo: Change.IndentNo
				});
			},   */
			
			
				onExecute: function () {

					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					var ordertype = this.getView().byId("drpOrder").getSelectedKey();
					var criteria = this.getView().byId("drpCriteria").getSelectedKey();
					var indentno = this.getView().byId("txtIndentnumber").getValue();
					if (criteria === "1") {
						oRouter.navTo("detail", {
							OrderType: ordertype
						});
					} else if (criteria === "2") {
						 
						oRouter.navTo("change", {
							OrderType: ordertype,
							IndentNo: indentno
						});

					/*	if (indentno.getValue().trim().length === 0 || indentno.getValue() === "") {
							MessageBox.error("Select Indent Number");
							return false;
						} else {
							indentno = this.getView().byId("txtIndentnumber").getValue();
							oRouter.navTo("change", {
								OrderType: ordertype,
								IndentNum: indentno
							});
						}*/
		}

	}, 
	// END of EXECUTE BUTTON EVENT //

// START OF SEARCH HELP (INDENT NO) EVENT // 

handleValueHelpIndentInfo: function (oEvent) {

		var oModelIndentNo = this.getOwnerComponent().getModel("IndentNoData");
		this.getView().setModel(oModelIndentNo);

		var sInputValueIndentNo = oEvent.getSource().getValue();

		this.inputIndentId = oEvent.getSource().getId();
		// create value help dialog
		if (!this._valueHelpDialogIndentNo) {
			this._valueHelpDialogIndentNo = sap.ui.xmlfragment(
				"futuregrp.ZRTV.fragments.IndentInfo", //id.fragments.file.name ---take id from manifest.json
				this
			);
			this.getView().addDependent(this._valueHelpDialogIndentNo);
		}

		// create a filter for the binding

		this._valueHelpDialogIndentNo.getBinding("items").filter([new sap.ui.model.Filter(
			"IndentNo",
			sap.ui.model.FilterOperator.Contains, sInputValueIndentNo
		)]);

		// open value help dialog filtered by the input value
		this._valueHelpDialogIndentNo.open(sInputValueIndentNo);
	},
	_handleValueHelpSearchIndentInfo: function (evt) {
		var sValueIndentNo = evt.getParameter("value");
		var oFilter = new sap.ui.model.Filter(
			"IndentNo",
			sap.ui.model.FilterOperator.Contains, sValueIndentNo
		);
		evt.getSource().getBinding("items").filter([oFilter]);
	},

	_handleValueHelpCloseIndentInfo: function (evt) {
		var oSelectedItem = evt.getParameter("selectedItem");

		if (oSelectedItem) {
			var IndentNoInput = this.getView().byId(this.inputIndentId);
			IndentNoInput.setValue(oSelectedItem.getTitle());
		}
		evt.getSource().getBinding("items").filter([]);
	},

	/*	handleValueHelpIndentInfo: function (oEvent) {
			//this.getView().setModel();
			var ordertype = this.getView().byId("drpOrder").getSelectedKey();

			this.inputIndentInfo = oEvent.getSource().getId();

			// create value help dialog
			if (!this._valueHelpDialogIndentInfo) {
				this._valueHelpDialogIndentInfo = sap.ui.xmlfragment(
					"futuregrp.ZRTV.fragments.IndentInfo",
					this
				);
				this.getView().addDependent(this._valueHelpDialogIndentInfo);
			}
			// create a filter for the binding
			this._valueHelpDialogIndentInfo.getBinding("items").filter([new
				Filter("Indicator1", sap.ui.model.FilterOperator.EQ, ordertype)
			]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogIndentInfo.open();

		},

		_handleValueHelpSearchIndentInfo: function (evt) {

			var sValue = evt.getParameter("value");

			var ordertype = this.getView().byId("drpOrder").getSelectedKey();

			if (sValue === "" || sValue === null) {

				var oFilter = new Filter(
					"Indicator1",
					sap.ui.model.FilterOperator.EQ, ordertype
				);
				evt.getSource().getBinding("items").filter([oFilter]);
			} else {
				var oFilter1 = new Filter(
					"IndentNum",
					sap.ui.model.FilterOperator.EQ, sValue
				);

				evt.getSource().getBinding("items").filter([oFilter1]);
			}
		},

		_handleValueHelpCloseIndentInfo: function (evt) {
			var aContexts = evt.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				var IndentInfoInput = this.getView().byId(this.inputIndentInfo);
				aContexts.map(function (oContext) {
					IndentInfoInput.setValue(oContext.getObject().IndentNum);
				});
			}
		},    */
	// END OF SEARCH HELP (INDENT NO) EVENT // 

	// START OF ON EXIT EVENT // 
	onExit: function () {
		if (this._valueHelpDialog) {
			this._valueHelpDialog.destroy();
		}
	}
	// END OF ON EXIT EVENT // 

});
});