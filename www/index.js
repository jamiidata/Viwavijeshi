$(function() {
    var startupView = "mwanzo";

    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    if(DevExpress.devices.real().platform === "win") {
        $("body").css("background-color", "#000");
    }

    var isDeviceReady = false,
        isViewShown = false;

    function hideSplashScreen() {
        if(isDeviceReady && isViewShown) {
            navigator.splashscreen.hide();
        }
    }

	if(document.addEventListener) {
		document.addEventListener("deviceready", function () {
			isDeviceReady = true;
			hideSplashScreen();
			document.addEventListener("backbutton", function () {
				DevExpress.processHardwareBackButton();
			}, false);
		}, false);
	}

    function onViewShown() {
        isViewShown = true;
        hideSplashScreen();
        FallArmyworm.app.off("viewShown", onViewShown);
    }

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !FallArmyworm.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                MSApp.terminateApp('');
                break;
        }
    }

    var layoutSet = DevExpress.framework.html.layoutSets[FallArmyworm.config.layoutSet],
        navigation = FallArmyworm.config.navigation;


    FallArmyworm.app = new DevExpress.framework.html.HtmlApplication({
        namespace: FallArmyworm,
        layoutSet: layoutSet,
        animationSet: DevExpress.framework.html.animationSets[FallArmyworm.config.animationSet],
        navigation: navigation,
        commandMapping: FallArmyworm.config.commandMapping,
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });

    $(window).on("unload", function() {
        FallArmyworm.app.saveState();
    });

    FallArmyworm.app.router.register(":view/:id", { view: startupView, id: undefined });
    FallArmyworm.app.on("viewShown", onViewShown);
    FallArmyworm.app.on("navigatingBack", onNavigatingBack);
    FallArmyworm.app.navigate();
});