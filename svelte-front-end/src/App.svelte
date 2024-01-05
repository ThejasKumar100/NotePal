<script>
	import SI from './socialInfo.svelte';
	import SearchCom from './search.svelte';


	let featherSrc = '/Feather.png';
</script>

<style>
	:global(body)
	{
		background-color: #f9f7ea;
	}

	@import url('https://fonts.cdnfonts.com/css/stanley');
	/* @import url('https://fonts.cdnfonts.com/css/ceuretas'); */
	/* @import url('https://fonts.cdnfonts.com/css/futura-std-4'); */

	.featherLoc {
		display: flex;
		justify-content: center; 
		align-items: center; 
		/* margin: auto; */
		/* height: 100vh; */
		margin-top: 7em;
		margin-bottom: -1.8em;
	}

	.titleLoc {
		font-family: 'Stanley', sans-serif;
		font-size: 2em;
		color: #3a1910;
		text-align: center;
		margin-top: 1em;
		margin-bottom: -1em;
	}

</style>

<div class = "featherLoc">
	<img src = {featherSrc} width = "120em" alt = "NotePal Feather Logo">
</div>

<div class = "titleLoc">
	<link href="https://fonts.cdnfonts.com/css/stanley" rel="stylesheet">
	<h1>
		NotePal
	</h1>
</div>


<!-- <link href="https://fonts.cdnfonts.com/css/ceuretas" rel="stylesheet">
<h1 style = "font-family: 'CEURETAS', sans-serif; font-size: 2.5em; color: #3a1910; text-align: center; margin-top: 1em;">
	NotePal
</h1> -->

<!-- <link href="https://fonts.cdnfonts.com/css/futura-std-4" rel="stylesheet">
<h1 style = "font-family: 'Futura Std', sans-serif; font-size: 2.5em; color: #3a1910; text-align: center; margin-top: 1em;">
	NotePal
</h1> -->




<!-- <SI></SI> -->
<SearchCom></SearchCom>