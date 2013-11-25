

        <div id="akfnlogo">
            <img src="img/logoAKFN-bloc.png" height="40" width="40" />
        </div>

        <script type="text/html" id="template-leaderboard">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                {{#each_upto agencies limit}}
                <tr>
                    <td class="position">{{rank}}</td><td class="agence">{{name}}</td><td class="score">{{score}}</td>
                </tr>
                {{/each_upto}}
            </table>
        </script>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
        <script src="js/vendor/handlebars-v1.1.2.js"></script>  
        <script src="js/main.js"></script>
        <script src="js/vendor/socket.io.js"></script>
        <script src="js/sockets.js"></script>
        

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X');ga('send','pageview');
        </script>
    </body>
</html>
