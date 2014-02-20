var assert = chai.assert;

suite('Fichero INI', function() {
    test('[Cabecera]', function() {
        //original.value = "[]";
		  var s = "[Cabecera]";
		  var t = lexer(s);
        assert.equal(t[0].type, 'header');
    });
     test(';Comentario', function() {
         var s = ";Comentario";
		   var t = lexer(s);
			var c = t[0].match
         assert.equal(c[0], ';Comentario');
     });
     test('Error!', function() {
		   var s = "Esto es un error";
		   var t = lexer(s);
         assert.match(t[0].type, /error/);
     });
});