<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>La Grande Branlette de Noël</title>
        <meta name="description" content="Viens te la shaker pour ton équipe préférée sur La Grande Branlette De Noël.">
        <meta property="og:image" content="http://branlettedenoel.com/img/logo_branlette_fb.png"/>
        <meta property="og:title" content="La Grande Branlette de Noël"/>
        <meta property="og:url" content="http://branlettedenoel.com/"/>
        <meta property="og:site_name" content="La Grande Branlette de Noël"/>
        <meta property="og:description" content="Viens te la shaker pour ton équipe préférée sur La Grande Branlette De Noël.">



        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=1376056199312103";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div id="logo">
            <a href="/" style="border:0 !important;"><img src="img/logo_branlette.png" width="277" height="277" alt="Brrrrrrrranlettteee" /></a>
        </div>
<!-- Quand qqun arrive sur le browser -->

<div class="page-loading step">
</div>

<div class="page-landing step" style="display: none">
    <div class="stepmaster">Page-Landing</div>

    <!-- <div class="landing-intro" style="display: none;">
        <div class="bras"></div>
        <div class="cta">
            <button type="button" class="start right">Une p&#8217tite vite</button>
        </div>
    </div> -->

    <div class="landing-code substep" style="display: none">
        <div class="bras2">
            <div class="biphone-contenu" style="display: none">
                <h1>Sur ton mobile, va sur:</h1>
                <h2>branlettedenoel.com</h2>
                <p>Entre le code pour le synchroniser avec l'écran.</p>
                <div class="code" data-info="code"></div>
            </div>
        </div>
        
    </div>

    <div class="landing-confirmation substep" style="display: none">
        <div class="bras2">
            <div class="biphone-contenu">
                <h1>C&#8217;est bien synché...</h1>
                <h2>Baisse les yeux:</h2>
                <p>Regarde sur ton mobile, et sélectionne ton agence pour qui tu vas shaker ton téléphone.</p><p style="text-align: center; font-size: 30px;">&darr;<p>
            </div>
        </div>
    </div>

    <div class="main">
        
        <div class="clear">
        <h1 class="left">Un concours <span>festif</span> de branlette interactive</h1>
        <p class="right">Comme le temps des fêtes se doit un moment de joie et d'allégresse, nous invitons clients, agences et amis de l'industrie à venir se mesurer à un concours de branlette interactive.</p>
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
            <a href="#" class="btn-leaderboard"><div class="arrow-right"></div>Voir le classement complet</a>
        </footer>
    </div>


</div>

<!-- Page de crossage -->

<!-- 3 states: 1. intro, 2. shaking, 3. repos/fatigué -->

<div class="page-shake step" style="display: none">
    <!-- intro -->
    <div class="shake-intro substep">
        <header><span>Allo <span class="agencyName"></span></span></header>
        <h1>Shake comme si y’avait pas de lendemain.</h1>
    </div>

    <!-- shake -->

    <div class="shake-shake substep">
        <div class="shake-nombre">  
        <div data-info="shake-sessioncount">0</div>

        <div class="shake-bulle">
            <h3>Enweille. Lâche-pas la banane!</h3>
        </div>

    </div>


    </div>
    

    <!-- repos submit -->
    <div class="shake-repos substep" style="display: none;">

        <div class="fatigue">
            <h1>Deja fatigué?</h1>
            <h2>Tu as shaké <div data-info="shake-sessioncount" style="display: inline">0</div> fois. Hey, Bravo. Fais pas ton égoïste. Partage ton plaisir pis ton score de branlette. Pas game!</h2>
            <footer><a href="#twitter" class="icon-twitter"><div>twitter</div></a><a href="#facebook" class="icon-facebook"><div>facebook</div></a></footer>
        </div>

    </div>


    <div class="shake-bras">

    </div>
    

    <div class="switch">
        <button type="button" class="small btn-change-object"><span class="picto">;</span>Changer de branlette</button>
    </div>
    
    <div class="shake-bottomcount"></div>

    <div class="sidebar">
        <header>
            <div class="left">Hey <span class="agencyName"></span>, Gâte-toé, c'est Noël</div>
            <div class="right"><a href="#twitter" class="icon-twitter"><div>twitter</div></a><a href="#facebook" class="icon-facebook"><div>facebook</div></a></div>
        </header>
        <div class="leftscore">
            <h1><span class="agencyIndex">?</span>/<span class="agenciesCount">?</span></h1>
            <footer><a href="#" class="btn-leaderboard"><div class="arrow-right"></div>Voir le classement complet</a></footer>
        </div>
            <p class="right">Etiam nulla ipsum, hendrerit sit amet vestibulum ac, mollis eget leo. Fusce egestas ligula ac leo varius dapibus sed sit amet eros. Integer scelerisque egestas dui sit amet aliquet. Nulla posuere mattis ante, a f orci quam, tempor eu tristique vel, ultricies sit amet felis. Mauris volutpat, lacus non viverra porta, nisi mi fringilla risus, pharetra rutrum metus diam a purus.</p>
        </div>


        <div class="shake-droite">
        <h1><span class='agencyShakes'>0</span> shakes</h1>
        <h2><span class="agencyBranleurCount agencyPeople">0</span> branleurs connectés chez <span class="agencyName"></span></h2>
        </div>
    </div>

    


</div>


<!-- Classement -->

<div class="page-classement step" style="display: none;">
    <div class="classement">
        <header>
            <div>Hey <span class="agencyName"></span>, Gâte-toé, c'est Noël</div>
        
        </header>
    <div id="leaderboard">
        
    </div>
</div>
    <div class="sidebar">
        <header><!-- 
            <div class="left">Hey <span class="agencyName"></span>, Gâte-toé, c'est Noël</div> -->
            <div class="right"><a href="#twitter" class="icon-twitter"><div>twitter</div></a><a href="#facebook" class="icon-facebook"><div>facebook</div></a></div>
        </header>
            <p class="right">À toutes les semaines, nous allons faire faire des affaires nices à plein de monde nice, selon le nombre de shakes, donc share-lé.</p>
        <div class="leftscore">
            <h1><span class="agencyIndex">?</span>/<span class="agenciesCount">?</span></h1>
            <footer><a href="/" class="back-to-business"><div class="arrow-left"></div>Retour à la branlette</a></footer>
        </div>
        </div>
    </div>

</div>
        
<!-- IPHONE -->



<!-- Quand il pogne son iphone pis qu'il check dedans -->
<div class="pageiphone-landing step" style="display: none;">
    <div class="logo">
        <img src="img/logo_branlette.png" width="120" height="120" alt="Brrrrrrrranlettteee" />
    </div>
    <h1>Un concours* de branlette interactive.</h1>
    <p>Oui... on est rendu là.</p><h2>Entre le code qui apparaît sur ton écran desktop:</h2>
    <form id="code-form"><input type="text" class="code" autocapitalize="off" autocorrect="off" value="" />
    <button class="btn-submit-code" type="submit">Connecter</button>
    </form>
    <a href="#" class="btn-no-code" style="margin-top: 70px; display: block; clear: both;"><div class="arrow-right"></div>Pas de code?</a>

</div>

<!-- Liste d'agence à choisir dans le iphone -->

<div class="pageiphone-agence step" style="display: none;">
    <div class="logo">
        <img src="img/logo_branlette.png" width="100" height="100" alt="Brrrrrrrranlettteee" />
        <div class="right">
        <h1>Tu branles pour qui? *</h1>
        <p>* Etiam nulla ipsum, hendrerit sit amet vestibulum ac, mollis eget leo. </p></div>
    </div>
    
    <ul id="agency-picker">
        
    </ul>
<br><br>
    <h3>Ajouter mon agence de branleur:</h3> <form id="add-agency"><input type="text" class="add-agency" value="" />
    <input type="submit" value="Ajouter" class="button" /></form>
</div>

<div class="pageiphone-shake step" style="display: none;">

    <div class="shake-menu">
        <div class="count"><div data-info="shake-sessioncount">0</div>&nbsp;shakes</div>
        <a href="#" class="btn-leaderboard"><div class="arrow-right"></div>Classement</a>
    </div>

    <div class="image"></div>
</div>

<div id="audio-player" style="display:none">
    <audio id="audio">
        <source src="" type="audio/mpeg" class="mp3" />
        <source src="" type="audio/ogg" class="ogg" />
    </audio>
</div>



<?php include('footer.php');?>