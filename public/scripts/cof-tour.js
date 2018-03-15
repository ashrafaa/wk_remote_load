var World = {

  // called to inject related stop data
  loadStopContent: function loadStopContent(stopData) {
    
    //console.log(`from WK: ${JSON.stringify(stopData)}`);
    console.log(`Title stop: ${stopData.title}`);
    // set stop plaque image
    var plaqueImg = new AR.ImageResource("../../images/" + stopData.image);
    var stopPlaque = new AR.ImageDrawable(plaqueImg, 8, {
      zOrder: 1,
    });

    // set indicator to the stop
    var indicatorImg = new AR.ImageResource("../../images/indi.png");
    var indicator = new AR.ImageDrawable(indicatorImg, 0.1, {
      verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });

    // set location of the stop
    const lat = parseFloat(stopData.location.latitude);
    const lon = parseFloat(stopData.location.longitude);
    var geoLocation = new AR.GeoLocation(lat, lon);
    var stopLocation = new AR.RelativeLocation(null, 1, 1);

    // set video related
    const vidName = `../../video/${stopData.id}.mp4`;
    var stopVideo = new AR.VideoDrawable(vidName, 12, {
      enabled: false,
      translate: {
        x: -0.2,
        y: -0.12
      },
      isTransparent: true,
      onError: function(msg) {
        console.log(`Video error : ${msg}`);
      }
    });
    
    // set stop geoobject on its location
    var stopObject = new AR.GeoObject(stopLocation, {
			drawables: {
        cam: [stopPlaque,stopVideo]
      },
      // when in vision, plaque will hide when clicked and video starts play
			onEnterFieldOfVision: function() {	
				stopPlaque.onClick = function() {
					this.enabled = false;
					stopVideo.enabled = true;
					stopVideo.play(-1);
				};
      },
      // when out of vision, video will stop and only plaque in view
			onExitFieldOfVision: function() {	
				stopPlaque.enabled = true;
				stopVideo.enabled = false;
				stopVideo.stop();
      },
      onClick: function() {
        stopPlaque.enabled = false;
        stopVideo.enabled = true;
        stopVideo.play(-1);
      }	
    });
    // // add indicator to help locate stop drawables
    stopObject.drawables.addIndicatorDrawable(indicator);
  },

  init: function initFn() {
    let stopnum = document.title;
    console.log(`${stopnum}`);

    World.loadStopContent(cofStops[stopnum-1]);

  }
}

World.init();