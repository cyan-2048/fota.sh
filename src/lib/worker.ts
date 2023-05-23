import curefs from "./curefs";

addEventListener("message", ({ data }) => {
	if (typeof data != "string") return;
	console.log("received message");
	for (const [device, _curefs] of curefs.entries()) {
		if (_curefs.includes(data)) {
			return postMessage(device);
		}
	}
	postMessage(null);
});
