<script>
    import HomeIcon from '../../svelte-front-end/images/Home.png';
    import Home from "./home.svelte";
    import AboutIcon from '../../svelte-front-end/images/About.png';
    import SettingsIcon from '../../svelte-front-end/images/Settings.png';
</script>

<header class = "flex-container">
    <div class = "header-left">
        <a href = "#/">
            <img src = {HomeIcon} class = "icon" alt = "Home Icon" />
        </a>
    </div>
</header>

<style>
    header {
        background: #3a1910;
        margin: 0;

        display: flex;
        justify-content: space-between;
    
    }

    .icon {
        width: 160 px;
        padding: 15 px;
        padding-top: 20 px;
        align-self: flex-start;
    }


    
</style>