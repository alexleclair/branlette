<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div id="logo">
            <img src="img/logo_branlette.png" width="277" height="277" alt="Brrrrrrrranlettteee" />
        </div>
<!-- Quand qqun arrive sur le browser -->
<div class="page-landing step">
    <div class="stepmaster">Page-Landing</div>

    <div class="landing-intro">

         <div class="bras"></div>
        <div class="main">
        <button type="button" class="right start">Let's do this bro.</button>
        <div class="clear">
        <h1 class="left">Un contest <span>interagence</span>  de branlette interactive</h1>
        <p class="right">Etiam nulla ipsum, hendrerit sit amet vestibulum ac, mollis eget leo. Fusce egestas ligula ac leo varius dapibus sed sit amet eros. Integer scelerisque egestas dui sit amet aliquet. Nulla posuere mattis ante.</p>
        </div>
    </div>

    </div>

    <div class="landing-code">
        <div class="bras2">
        <div class="biphone-contenu">
            <h1>Sur ton mobile var sur:</h1>
            <h2>gatetoecestnoel.com</h2>
            <p>Entre le code suivant pour connecter ton intelligent téléfun.</p>
            <div class="code" data-info="code"></div>
        </div>
    </div>
    </div>

    <div class="landing-confirmation">
        <div class="bras2">
        <div class="biphone-contenu">
            <h1>Baisse les yeux:</h1>
            <h2>Le code a synché.</h2>
            <p>Bravo</p>
            <div class="code" data-info="code"></div>
        </div>
    </div>
    </div>

   
    <div class="sidebar">
        <header>
            <div class="left">Top 5 des plus vigoureux branleurs</div>
            <div class="right"><a href="#twitter" class="icon-twitter"><div>twitter</div></a><a href="#facebook" class="icon-facebook"><div>facebook</div></a></div>
        </header>
            <div id="top5">

            </div>
        <footer>
            <a href="#"><div class="arrow-right"></div>Voir le classement complet</a>
        </footer>
    </div>


</div>

<!-- Page de crossage -->

<!-- 3 states: 1. intro, 2. shaking, 3. repos/fatigué -->

<div class="page-shake step" style="display: none;">
    <div class="stepmaster">page-shake</div>
    <!-- intro -->
    <div class="shake-intro">
        <h1 style="display: none;">Allo Cossette.<br>Shake comme si y’avait pas de lendemain.</h1>
    </div>

    <!-- shake -->

    <div class="shake-shake">
        <div class="shake-nombre">  
        <div data-info="shake-sessioncount">0</div>

        <div class="shake-bulle">
            <h3>Enweille. Lâche-pas la banane!</h3>
        </div>

    </div>


    </div>
    

    <!-- repos submit -->
    <div class="shake-repos">

    </div>


    <div class="shake-bras">
        <img src="img/bras3.png" />
    </div>
    

    <div class="switch">
        <button type="button" class="small">Permuter la branlette</button>
        <button type="button" class="small" data-action="shake">Shake it</button>
    </div>
    
    <div class="shake-bottomcount"></div>

</div>


<!-- Classement -->

<div class="page-classement step" style="display: none;">
    <div class="stepmaster">page-classement</div>
    <div class="classement">
        <header>
            <div>Hey Cossette, Gâte-toé, c'est Noël</div>
        
        </header>
    <div id="leaderboard">
        
    </div>
</div>
    <div class="sidebar">
        <header>
            <div class="left">Hey Cossette, Gâte-toé, c'est Noël</div>
            <div class="right"><a href="#twitter" class="icon-twitter"><div>twitter</div></a><a href="#facebook" class="icon-facebook"><div>facebook</div></a></div>
        </header>
        <div class="leftscore">
            <h1>14/168</h1>
            <footer><a href="/"><div class="arrow-left"></div>Retour à la branlette</a></footer>
        </div>
            <p class="right">Etiam nulla ipsum, hendrerit sit amet vestibulum ac, mollis eget leo. Fusce egestas ligula ac leo varius dapibus sed sit amet eros. Integer scelerisque egestas dui sit amet aliquet. Nulla posuere mattis ante, a f orci quam, tempor eu tristique vel, ultricies sit amet felis. Mauris volutpat, lacus non viverra porta, nisi mi fringilla risus, pharetra rutrum metus diam a purus.</p>
        </div>
    </div>

</div>
        
<!-- IPHONE -->



<!-- Quand il pogne son iphone pis qu'il check dedans -->
<div class="pageiphone-landing step" style="display: none;">
    <div class="stepmaster">page-landing-iphonecode</div>
    <div class="logo">
        <img src="img/logo_branlette.png" width="120" height="120" alt="Brrrrrrrranlettteee" />
    </div>
    <h1>Un <span>contest</span> interagence de branlette interactive</h1>
    <p>Etiam nulla ipsum, hendrerit sit amet vestibulum ac, mollis eget leo. </p>
    <h2>Entre ton code</h2>
    <form><input type="text" class="code" value="" /></form>
    <button class="btn-submit-code btn">Shake-là</button>

</div>

<!-- Liste d'agence à choisir dans le iphone -->

<div class="pageiphone-agence step" style="display: none;">
    <div class="stepmaster">page-landing-agence-iphone</div>
    <div class="logo">
        <img src="img/logo_branlette.png" width="100" height="100" alt="Brrrrrrrranlettteee" />
        <div class="right">
        <h1>Tu branles pour qui? *</h1>
        <p>* Etiam nulla ipsum, hendrerit sit amet vestibulum ac, mollis eget leo. </p></div>
    </div>
    
    <ul>
        <li><span>Agence</span></li>
        <li><span>Akufplottes</span></li>
        <li><span>Agence</span></li>
        <li><span>281</span></li>
        <li><span>288</span></li>
        <li><span>Akufen</span></li>
        <li><span>Agence</span></li>
        <li><span>Cossette</span></li>
        <li><span>Bos</span></li>
        <li><span>Agence</span></li>
        <li><span>Akufplottes</span></li>
        <li><span>Agence</span></li>
        <li><span>281</span></li>
        <li><span>288</span></li>
        <li><span>Akufen</span></li>
        <li><span>Agence</span></li>
        <li><span>Cossette</span></li>
        <li><span>Bos</span></li>
        <li><span>Agence</span></li>
        <li><span>Akufplottes</span></li>
        <li><span>Agence</span></li>
        <li><span>281</span></li>
        <li><span>288</span></li>
        <li><span>Akufen</span></li>
        <li><span>Agence</span></li>
        <li><span>Cossette</span></li>
        <li><span>Bos</span></li>
        <li><span>Agence</span></li>
        <li><span>Akufplottes</span></li>
        <li><span>Agence</span></li>
        <li><span>281</span></li>
        <li><span>288</span></li>
        <li><span>Akufen</span></li>
        <li><span>Agence</span></li>
        <li><span>Cossette</span></li>
        <li><span>Bos</span></li>
    </ul>
<br><br>
    <h3>Ajouter mon agence de branleur:</h3> <form><input type="text" value="" /></form>
</div>

<div class="pageiphone-shake">

        <div>

        </div>

</div>


<?php include('footer.php');?>