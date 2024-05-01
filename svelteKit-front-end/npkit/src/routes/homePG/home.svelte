<script>
   	import SearchCom from './search.svelte';

    let featherSrc = '/Feather.png';
</script>


<style>

    @import url('https://fonts.cdnfonts.com/css/stanley');

	.featherLoc {
		display: flex;
		justify-content: center; 
		align-items: center; 
		/* margin: auto; */
		/* height: 100vh; */
		margin-top: 9em;
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

</style>


<div class = "featherLoc">
	<img src = {featherSrc} width = "120em" alt = "NotePal Feather Logo">
</div>


<div class = titleLoc>
	<link href="https://fonts.cdnfonts.com/css/futura-std-4" rel="stylesheet">
	<h1 style = "font-family: 'Futura Std', sans-serif; font-size: 2.5em; color: #3a1910; text-align: center; margin-top: 1em;">
		NotePal
	</h1>
</div>

<SearchCom></SearchCom>
