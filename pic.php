<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Caapp</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
	
<style>

video{
	
	margin-top:50px;

}


body{
margin: 0 auto;
padding:10px
}

</style>

	
</head>

<body>


	<div align="center" id="maindiv">
	
		<video id="player" playsinline  autoplay align="center"></video>
	

		<canvas id="canvas" ></canvas>

		<div class="text-center">
			<button align="center" class="btn btn-dark rounded-pill m-0 mt-5" id="capture-btn">
				Snap
			</button>

		</div>
	</div>

	<select id="videoSource">
	
	</select>


<script src="main.js"></script>

</body>
</html>
