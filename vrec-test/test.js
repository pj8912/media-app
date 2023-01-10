

var constraints = {audio:{noiseSuppression:false},video:{width:{min:640,ideal:1280,max:1280 },height:{ min:480,ideal:720,max:720},framerate:60}};

var recBtn = document.querySelector("button#rec");
var pauseResBtn = document.querySelector("button#pauseRes");
var stopBtn = document.querySelector("button#stop");

var liveVideoElement = document.querySelector("#live");
var downloadLink = document.querySelector("a#downloadLink");

liveVideoElement.controls = false;


var mediaRecorder;
var chunks = [];
var count = 0;
var localStream = null;
var soundMeter = null;
var containerType = "video/webm";

if(!navigator.mediaDevices.getUserMedia){

	alert('no browser support');
}
else{

	if(window.mediaRecorder == undefined){

		alert('media recorder not supported');
	}
	else{

		navigator.mediaDevices.getUserMedia(constrains)
		.then(function(stream){
			localStream  = stream;
			localStream.getTracks().forEach(function(track){
				if(track.kind == "audio"){
					track.onended = function(event){
						console.log("");
					}
				}
				if(track.kind == "video"){
					track.onended = function(event){
						console.log('video');
					}

				}
			});

			liveVideoElement.srcObject = localStream;
			liveVideoElement.play();

			try{
				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				window.audioContext = new AudioContext();
			}
			catch(e){
				console.log('Web Audio API not supported');
			}
			soundMeter = window.soundMeter= new SoundMeter(window.audioContext);
			soundMeter.connectToSource(localStream, function(e){
				if(e){
					console.log(e);
					return;
				}
				else{
					console.log(',...');
				}
			});
		}).catch(err => console.log(err))

	} 
} //big else
//

function onBtnRecordClicked(){

	if(localStream == null){

		alert('Could not get local stream');
	}
	else{
		recBtn.disabled = true;
		pauseResBtn.disabled = false;
		stopBtn.disabled = false;
		chunks = [];

		if(typeof MediaRecoder.isTypeSupported == 'function'){
			if(MediaRecorder.isTypeSupported('video/webm;codecs=h264')){
				var options = {mimeType: 'video/webm;codecs=h264'};
			} else if(MediaRecorder.isTypeSupported('video/webm')){
				var options = {mimeType : 'video/webm'};
			} else if(MediaRecorder.isTypeSupported('video/mp4')){
				containerType = "video/mp4";
				var options = {mimeType: 'video/mp4', videoBitsPerSecond : 2500000};
			}

			mediaRecorder = new MediaRecorder(localStream, options);
		
			if(options.mimeType != 'video/mp4'){
				mediaRecorder = new MediaRecorder(localStream, options);
			}
			else{
				mediaRecorder = new MediaRecorder(localStream);
			}
		}
		else{
			mediaRecorder = new MediaRecorder(localStream);
		}

		mediaRecorder.ondataavailable = function(e){
			if(e.data && e.data.size > 0){
				chunks.push(e.data);
			}
		};

		mediaRecorder.onerror = function(e){
			console.log('err:' + e);
		}

		mediaRecorder.onstart = function(e){
			console.log('state: ' + mediaRecorder.state);
		
			localStream.getTracks().forEach(function(track){
				if(track.kind == 'audio'){
					console.log('audio!');

				}
				if(track.kind == "video"){
					console.log('video!');
				}
			});
		};

		mediaRecorder.onstop = function(){

			var recording = new Blob(chunks, {type:  mediaRecorder.mimeType});
			downloadLink.href = URL.createObjectURL(recording);

			var rand = Math.floor((Math.random() * 10000000));
			switch(containerType){
				case "video/mp4":
					var name = "video_"+rand+".mp4";
					break;
				default : 
					var name = "video_"+rand+".webm";
			}
			downloadLink.innerHTML = 'Download'+name;
			downloadLink.setAttribute("download", name);
			downloadLink.setAttribute("name", name);
		};

		mediaRecorder.onpause = function(){
		
			consolg.log('Paused!');
		}

		mediaRecorder.onwarning = function(e){
			console.log('warning: ' + e);
		}
		pauseResBtn.textContent = "Pause";
		mediaRecorder.start(1000);

		localStream.getTracks().forEach(function(track){
			console.log(track.getSettings());
		})
	}
}

navigator.mediaDevices.ondevicechange = function(event){
	console.log("mediaDevices.ondevicechange");
}

function onBtnStopClicked(){
	mediaRecorder.stop();
	recBtn.disabled = false;
	pauseResBtn.disabled = true;
	stopBtn.disabled = true;
}

function onPauseResumeClicked(){
	if(pauseResBtn.textContent == "Pause"){
		pauseResBtn.textContent = "Resume";
		mediaRecorder.pause();
		stopBtn.disabled = true;
	}
	else{
		pauseResBtn.textContent = 'Pause';
		mediaRecorder.resume();
		stopbtn.disabled = false;
	}
	recBtn.disabled = true;
	pauseResBtn.disabled = false;
}


function onStateClicked(){
	if(mediaRecorder != null && localStream != null && soundMeter != null){
		log("mediaRecorder.state="+mediaRecorder.state);
		log("mediaRecorder.mimeType="+mediaRecorder.mimeType);
		log("mediaRecorder.videoBitsPerSecond="+mediaRecorder.videoBitsPerSecond);
		log("mediaRecorder.audioBitsPerSecond="+mediaRecorder.audioBitsPerSecond);

		localStream.getTracks().forEach(function(track) {
			if(track.kind == "audio"){
				log("Audio: track.readyState="+track.readyState+", track.muted=" + track.muted);
			}
			if(track.kind == "video"){
				log("Video: track.readyState="+track.readyState+", track.muted=" + track.muted);
			}
		});

		log("Audio activity: " + Math.round(soundMeter.instant.toFixed(2) * 100));
	}

}


function log(message){
	console.log(message);
}

function SoundMeter(context){
	this.context = context;
	this.instant = 0.0;
	this.slow = 0.0;
	this.clip = 0.0;
	this.script = context.createScriptProcessor(2048, 1, 1);
	var that = this;
	this.script.onaudioprocess = function(event){
		var input = event.inputBuffer.getChannelData(0);
		var i;
		var sum = 0.0;
		var clipcount = 0;
		for(i=0; i < input.length; i++){
			sum += input[i] * input[i];
			if(Math.abs(input[i]) > 0.99){
				clipcount += 1;
			}
		}
		that.instant = Math.sqrt(sum / input.length);
		that.slow = 0.95 * that.slow + 0.05 * that.instant;
		that.clip = clipcount / input.length;
	};
}

SoundMeter.prototype.connectToSource = function(stream, callback) {
  console.log('SoundMeter connecting');
  try {
	this.mic = this.context.createMediaStreamSource(stream);
	this.mic.connect(this.script);
	// necessary to make sample run, but should not be.
	this.script.connect(this.context.destination);
	if (typeof callback !== 'undefined') {
	  callback(null);
	}
  } catch (e) {
	console.error(e);
	if (typeof callback !== 'undefined') {
	  callback(e);
	}
  }
};
SoundMeter.prototype.stop = function() {
  this.mic.disconnect();
  this.script.disconnect();
};


//browserId
//
function getBrowser(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
		   (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}


	return browserName;
}
