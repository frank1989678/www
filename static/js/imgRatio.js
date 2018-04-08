function AutoResizeImage(maxWidth, maxHeight, objImg) {
	var img = new Image();
	img.src = objImg.src;
	var hRatio;
	var wRatio;
	var Ratio = 1;
	var w = img.width;
	var h = img.height;
	wRatio = maxWidth / w;
	hRatio = maxHeight / h; // 小于1时超过最大值
	if (maxWidth == 0 && maxHeight == 0) {
		Ratio = 1;
	} else if (maxWidth == 0) { 
		if (hRatio < 1) Ratio = hRatio;
	} else if (maxHeight == 0) {
		if (wRatio < 1) Ratio = wRatio;
	} else if (wRatio < 1 || hRatio < 1) {
		Ratio = Math.min(wRatio, hRatio);
		// Ratio = (wRatio <= hRatio ? wRatio: hRatio);
	}

	if (Ratio < 1) {
		w = w * Ratio;
		h = h * Ratio;
	}
	objImg.height = h;
	objImg.width = w;
}

function maximizeImage(maxWidth, maxHeight, objImg) {
	var img = new Image();
	img.src = objImg.src;
	var w = img.width;
	var h = img.height;

	if (w === 0 || h === 0) {
		setTimeout(function() {
			maximizeImage(maxWidth, maxHeight, objImg);
		}, 30);
	}

	var hRatio = maxWidth / w; // 小于1时超出最大值
	var wRatio = maxHeight / h;
	var Ratio = 1;

	if (wRatio > 1) {
		if (hRatio > 1) {
			Ratio = Math.max(wRatio, hRatio);
		} else {
			Ratio = wRatio;
		}
	} else {
		if (hRatio > 1) {
			Ratio = hRatio;
		} else {
			Ratio = Math.max(wRatio, hRatio);
		}
	}
	w = w * Ratio;
	h = h * Ratio;
	// objImg.height = h;
	// objImg.width = w;
	objImg.style.cssText = "position:absolute;left:" + (maxWidth - w)/2 + "px;top:" + (maxHeight - h)/2 + "px;width:" + w + "px" + ";height:" + h + "px";
}