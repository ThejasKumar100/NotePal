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

</style>

<img src = {featherSrc} width = "120em" alt = "NotePal Logo">

<!-- <input type = "text" value = "ex. <q>CS 3377<q> or <q>UNIX<q>" disabled> -->

<SI></SI>
<SearchCom></SearchCom>