<script>
   	import SearchCom from './search.svelte';

    let featherSrc = '/Feather.png';
</script>



<style>

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
		font-family: 'Futura Std', sans-serif;
		font-size: 1.2em;
		color: #3a1910;
		text-align: center;
		margin-top: -2em;
		margin-bottom: -1em;
	}
	h1 {text-align: center;}

</style>


<div class = "featherLoc">
	<img src = {featherSrc} width = "120em" alt = "NotePal Feather Logo">
</div>

<!-- <div class = "titleLoc">
	<link href="https://fonts.cdnfonts.com/css/stanley" rel="stylesheet">
	<h1 style = 
		"font-family: 'Stanley', sans-serif;
		font-size: 2em;
		color: #3a1910;
		text-align: center;
		margin-top: 1em;
		margin-bottom: -1em;"
	>
		NotePal
	</h1>
</div> -->


<!-- <link href="https://fonts.cdnfonts.com/css/ceuretas" rel="stylesheet">
<h1 style = "font-family: 'CEURETAS', sans-serif; font-size: 2.5em; color: #3a1910; text-align: center; margin-top: 1em;">
	NotePal
</h1> -->

<div class = titleLoc>
	<link href="https://fonts.cdnfonts.com/css/futura-std-4" rel="stylesheet">
	<h1 style = "font-family: 'Futura Std', sans-serif; font-size: 2.5em; color: #3a1910; text-align: center; margin-top: 1em;">
		NotePal
	</h1>
</div>

<SearchCom></SearchCom>

<div>
	<h1> Recently Viewed: </h1>
	<br>
	<h1> Favorites: </h1>
</div>
