<script>
	let navOptions = "";

	import feather from '$npkit/static/Feather.png';
</script>


<style>

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}


</style>


<header>

	<!-- For making a small logo in the top right corner-->
	<!-- <div class="corner">
		<a href="https://kit.svelte.dev">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div> -->


	<nav>

		<div class="corner">
			<a href="https://kit.svelte.dev">
				<img src={feather} alt="NotePal Icon" />
			</a>
		</div>
	

		<ul>
		

			

		</ul>

	</nav>

</header>

<slot />