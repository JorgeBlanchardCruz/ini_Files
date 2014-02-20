var assert = chai.assert;

suite('Fichero INI', function() {
    test('[Cabecera]', function() {
        //original.value = "[]";
		  var s = "[Cabecera]";
		  var t = lexer(s);
        assert.equal(t[0].type, 'header');
		  assert.equal(t[0].match[1], 'Cabecera');
    });
     test(';Comentario', function() {
         var s = ";Comentario";
		   var t = lexer(s);
			var c = t[0].match;
         assert.equal(c[0], ';Comentario');
			assert.equal(c[1], 'Comentario');
     });
	  test('Nombre = Valor', function() {
		  var s = "Nombre = Gonzalo";
		  var t = lexer(s);
		  var m = t[0].match;
		  assert.equal(t[0].type, 'nameEqualValue');
		  assert.equal(m[0], 'Nombre = Gonzalo');
		  assert.equal(m[1], 'Nombre ');
		  assert.equal(m[2], ' Gonzalo');
	  });
     test('Error!', function() {
		   var s = "Esto es un error";
		   var t = lexer(s);
         assert.match(t[0].type, /error/);
     });
});