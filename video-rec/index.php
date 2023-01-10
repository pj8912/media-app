
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<base target="_blank">
	<title>Media</title>
	<style>
		video{
			
			margin-top:50px;
			height:500px;

			justify-self:center;
			align-items:center;
			align-self:center
		}

	</style>
</head>
<body>
<div>
	<h1>Video Recorder</h1>

	<div align="center">

		<video id="live" controls autoplay muted ></video> <br>
		<div id="controls">
			<button id="rec" onclick="onBtnRecordClicked()">Record</button>
			<button id="pauseRes"   onclick="onPauseResumeClicked()" disabled>Pause</button>
			<button id="stop"  onclick="onBtnStopClicked()" disabled>Stop</button>

		</div>

	</div>
	<a id="downloadLink" download="mediarecorder.webm" name="mediarecorder.webm" href></a>

	<script src="main.js"></script>
	<script src="adapter.js"></script>


</div>

</body>
</html>
