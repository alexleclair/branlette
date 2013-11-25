<table border="0" cellpadding="0" cellspacing="0" width="100%">
    {{#each_upto agencies limit}}
    <tr>
        <td class="position">{{rank}}</td><td class="agence">{{name}}</td><td class="score">{{score}}</td>
    </tr>
    {{/each_upto}}
</table>