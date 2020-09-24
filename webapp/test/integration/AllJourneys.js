/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"futuregrp/ZRTV/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"futuregrp/ZRTV/test/integration/pages/Main",
	"futuregrp/ZRTV/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "futuregrp.ZRTV.view.",
		autoWait: true
	});
});